export const SENSOR_CHART_COLORS = [
  '#2563eb',
  '#16a34a',
  '#ea580c',
  '#9333ea',
  '#dc2626',
  '#0891b2',
  '#db2777',
];

export function asksForSensorChart(question) {
  const normalizedQuestion = question
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’_-]+/g, ' ');
  const mentionsSensor = /\b(sensor\w*|capteur\w*|ph|tds|humidity|humidite|temperature|light|lumiere|water|eau)\b/
    .test(normalizedQuestion);
  const asksForMeasurements = /\b(readings?|measurements?|history|historical|trend\w*|over\s+time|releves?|mesures?|lectures?|historique|tendance\w*|evolution)\b/
    .test(normalizedQuestion);
  const requestsRecentCount = /\b(?:last|latest|most recent|past|previous|dernier\w*)\s+(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix)\b|\b(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix)\s+(?:last|latest|most recent|past|previous|dernier\w*)\b/
    .test(normalizedQuestion);
  const requestsOnlyLatest = /\b(current|currently|now|right now|latest|most recent|actuel\w*|maintenant|en ce moment|dernier\w*)\b/
    .test(normalizedQuestion)
    && !requestsRecentCount;

  return mentionsSensor && asksForMeasurements && !requestsOnlyLatest;
}

export function getSensorChartValues(readings, metricKey) {
  return readings
    .filter((reading) => reading[metricKey] !== null && reading[metricKey] !== undefined)
    .map((reading) => ({
      timestamp: new Date(reading.timestamp),
      value: Number(reading[metricKey]),
    }))
    .filter(({ timestamp, value }) => (
      !Number.isNaN(timestamp.getTime()) && Number.isFinite(value)
    ))
    .sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());
}
