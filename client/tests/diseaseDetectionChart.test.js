import assert from 'node:assert/strict';
import test from 'node:test';

import {
  asksForAllDiseaseDetections,
  getDiseaseDistribution,
} from '../src/utils/diseaseDetectionChart.js';

test('all-disease requests show the chart but a named-disease request does not', () => {
  assert.equal(asksForAllDiseaseDetections('Show all diseases detected'), true);
  assert.equal(asksForAllDiseaseDetections('Give me diseases detected'), true);
  assert.equal(asksForAllDiseaseDetections('Montre toutes les maladies détectées'), true);
  assert.equal(asksForAllDiseaseDetections('Show detections for Tomato Bacterial Spot'), false);
});

test('disease distribution reports counts and proportions', () => {
  const distribution = getDiseaseDistribution([
    { prediction: 'Tomato Bacterial Spot' },
    { prediction: 'Tomato Bacterial Spot' },
    { prediction: 'Early Blight' },
  ]);

  assert.deepEqual(distribution, [
    { disease: 'Tomato Bacterial Spot', count: 2, proportion: 2 / 3 },
    { disease: 'Early Blight', count: 1, proportion: 1 / 3 },
  ]);
});
