import argparse
import csv
import sys
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from pathlib import Path
from uuid import UUID

BACKEND_DIR = Path(__file__).resolve().parents[2]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from sqlalchemy import text

from app.core.database import engine

UTILS_DIR = Path(__file__).resolve().parent
SENSOR_FIELDS = (
    "temperature",
    "humidity",
    "water_temperature",
    "water_level",
    "ph",
    "tds",
    "light",
)
SENSOR_PRECISION = {
    "temperature": (5, 2),
    "humidity": (5, 2),
    "water_temperature": (5, 2),
    "water_level": (5, 2),
    "ph": (4, 2),
    "tds": (6, 2),
    "light": (8, 2),
}


def find_csv_file(filename: str | None = None) -> Path:
    if filename:
        csv_path = (UTILS_DIR / filename).resolve()
        if csv_path.parent != UTILS_DIR or csv_path.suffix.lower() != ".csv":
            raise ValueError("Provide the name of a CSV file in the utils folder.")
        if not csv_path.is_file():
            raise FileNotFoundError(f"CSV file not found: {csv_path}")
        return csv_path

    csv_files = sorted(UTILS_DIR.glob("*.csv"))
    if not csv_files:
        raise FileNotFoundError(f"No CSV files found in {UTILS_DIR}")
    if len(csv_files) > 1:
        names = ", ".join(csv_file.name for csv_file in csv_files)
        raise ValueError(f"Multiple CSV files found ({names}); pass one filename.")
    return csv_files[0]


def parse_sensor_readings(csv_path: Path) -> tuple[list[dict], list[str]]:
    readings = []
    skipped_rows = []
    with csv_path.open("r", encoding="utf-8-sig", newline="") as csv_file:
        reader = csv.DictReader(csv_file)
        headers = set(reader.fieldnames or [])

        if "plant_id" not in headers:
            raise ValueError("CSV must include a plant_id column.")
        if not headers.intersection(SENSOR_FIELDS):
            raise ValueError(
                f"CSV must include at least one sensor column: {', '.join(SENSOR_FIELDS)}."
            )

        for line_number, row in enumerate(reader, start=2):
            if None in row:
                raise ValueError(f"Unexpected extra values on CSV line {line_number}.")
            if not any(value and value.strip() for value in row.values() if value):
                continue

            plant_id_value = (row.get("plant_id") or "").strip()
            if not plant_id_value:
                raise ValueError(f"Missing plant_id on CSV line {line_number}.")

            try:
                reading = {"plant_id": UUID(plant_id_value)}
            except ValueError as exc:
                raise ValueError(
                    f"Invalid plant_id on CSV line {line_number}: {plant_id_value}"
                ) from exc

            row_errors = []
            for field in SENSOR_FIELDS:
                value = (row.get(field) or "").strip()
                reading[field] = None
                if value:
                    try:
                        number = Decimal(value)
                    except InvalidOperation as exc:
                        raise ValueError(
                            f"Invalid {field} value on CSV line {line_number}: {value}"
                        ) from exc
                    if not number.is_finite():
                        row_errors.append(
                            f"{field}={value} is not a finite numeric value"
                        )
                        continue

                    precision, scale = SENSOR_PRECISION[field]
                    rounded_number = number.quantize(
                        Decimal(1).scaleb(-scale),
                        rounding=ROUND_HALF_UP,
                    )
                    maximum = Decimal(10) ** (precision - scale)
                    if abs(rounded_number) >= maximum:
                        row_errors.append(
                            f"{field}={value} exceeds the NUMERIC"
                            f"({precision},{scale}) column limit"
                        )
                    else:
                        reading[field] = rounded_number

            if row_errors:
                skipped_rows.append(
                    f"CSV line {line_number}: {'; '.join(row_errors)}"
                )
                continue

            timestamp_value = (row.get("recorded_at") or row.get("timestamp") or "").strip()
            if timestamp_value:
                try:
                    recorded_at = datetime.fromisoformat(
                        timestamp_value.replace("Z", "+00:00")
                    )
                except ValueError as exc:
                    raise ValueError(
                        f"Invalid recorded_at/timestamp on CSV line {line_number}: "
                        f"{timestamp_value}"
                    ) from exc
                if recorded_at.tzinfo is not None:
                    recorded_at = recorded_at.astimezone(timezone.utc).replace(
                        tzinfo=None
                    )
                reading["recorded_at"] = recorded_at
            else:
                reading["recorded_at"] = None

            if not any(field in reading for field in SENSOR_FIELDS):
                raise ValueError(
                    f"CSV line {line_number} has no sensor measurement values."
                )
            readings.append(reading)

    if not readings and not skipped_rows:
        raise ValueError(f"No sensor readings found in {csv_path.name}.")
    return readings, skipped_rows


def import_sensor_readings(csv_path: Path) -> int:
    readings, skipped_rows = parse_sensor_readings(csv_path)
    for skipped_row in skipped_rows:
        print(f"Skipped {skipped_row}", file=sys.stderr)
    if not readings:
        print("No valid sensor readings to import.", file=sys.stderr)
        return 0

    statement = text(
        """
        INSERT INTO sensor_readings (
            plant_id, temperature, humidity, water_temperature, water_level,
            ph, tds, light, recorded_at
        ) VALUES (
            :plant_id, :temperature, :humidity, :water_temperature, :water_level,
            :ph, :tds, :light, COALESCE(:recorded_at, CURRENT_TIMESTAMP)
        )
        """
    )
    with engine.begin() as connection:
        connection.execute(statement, readings)
    return len(readings)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Import sensor readings from a CSV in this utils folder."
    )
    parser.add_argument(
        "filename",
        nargs="?",
        help="CSV filename in this folder; omit when it contains exactly one CSV.",
    )
    args = parser.parse_args()

    csv_path = find_csv_file(args.filename)
    imported_count = import_sensor_readings(csv_path)
    print(f"Imported {imported_count} sensor readings from {csv_path.name}.")


if __name__ == "__main__":
    main()
