import assert from 'node:assert/strict';
import test from 'node:test';

import {
  asksForSensorChart,
  getSensorChartValues,
} from '../src/utils/sensorReadingsChart.js';

test('sensor history requests show a chart, but current-only requests do not', () => {
  assert.equal(asksForSensorChart('Show me the sensor readings'), true);
  assert.equal(asksForSensorChart('Montre les relevés des capteurs'), true);
  assert.equal(asksForSensorChart('Show the latest sensor reading'), false);
  assert.equal(asksForSensorChart('Show the last 5 humidity readings'), true);
});

test('chart values omit missing data and sort readings chronologically', () => {
  const values = getSensorChartValues([
    { timestamp: '2026-03-02T10:00:00Z', humidity: 45 },
    { timestamp: '2026-03-01T10:00:00Z', humidity: 40 },
    { timestamp: '2026-03-03T10:00:00Z', humidity: null },
  ], 'humidity');

  assert.deepEqual(values.map(({ timestamp, value }) => [
    timestamp.toISOString(),
    value,
  ]), [
    ['2026-03-01T10:00:00.000Z', 40],
    ['2026-03-02T10:00:00.000Z', 45],
  ]);
});
