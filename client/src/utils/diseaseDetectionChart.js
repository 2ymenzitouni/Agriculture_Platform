export const DISEASE_CHART_COLORS = [
  '#2563eb',
  '#16a34a',
  '#eab308',
  '#ea580c',
  '#dc2626',
  '#9333ea',
  '#0891b2',
  '#db2777',
  '#64748b',
];

export function normalizeChatText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’_-]+/g, ' ');
}

export function asksForDetectionHistory(question) {
  const normalizedQuestion = normalizeChatText(question);
  return /\b(detect\w*|diagnos\w*|image\w*|photo\w*|picture\w*|history|record\w*|found|seen|historique|enregistr\w*|trouv\w*|observ\w*)\b/.test(normalizedQuestion)
    && /\b(disease\w*|detect\w*|image\w*|photo\w*|picture\w*|diagnos\w*|infection\w*|infected|sick|blight|spot|mildew|mosaic|rust|rot|wilt|canker|scab|septoria|anthracnose|target|maladie\w*|infect\w*|mildiou|oidium|tache\w*|mosaique|rouille|pourriture|fletr\w*|chancre\w*|gale|septoriose)\b/.test(normalizedQuestion);
}

export function asksForAllDiseaseDetections(question) {
  const normalizedQuestion = normalizeChatText(question);
  const requestsAll = /\b(all|every|entire|full|tous|toutes|tout|toute|ensemble|history|historique)\b/
    .test(normalizedQuestion)
    || /\b(disease\w*\s+detect\w*|detect\w*\s+disease\w*|maladie\w*\s+detect\w*|detect\w*\s+maladie\w*)\b/
      .test(normalizedQuestion);
  const namesSpecificDisease = /\b(bacterial\s+spot|early\s+blight|late\s+blight|leaf\s+mold|leaf\s+spot|target\s+spot|yellow\s+leaf\s+curl|septoria|septoriose|anthracnose|mildiou|oidium|mosaique|rouille|pourriture|fletr\w*|chancre|gale)\b/
    .test(normalizedQuestion);

  return requestsAll
    && asksForDetectionHistory(question)
    && !namesSpecificDisease;
}

export function getDiseaseDistribution(detections) {
  const grouped = new Map();

  detections.forEach((detection) => {
    const disease = String(detection.prediction ?? '').trim() || 'Unknown';
    const key = disease.toLocaleLowerCase();
    const existing = grouped.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      grouped.set(key, { disease, count: 1 });
    }
  });

  const total = detections.length;
  return [...grouped.values()]
    .map((entry) => ({
      ...entry,
      proportion: entry.count / total,
    }))
    .sort((left, right) => (
      right.count - left.count || left.disease.localeCompare(right.disease)
    ));
}

export function getDiseaseChartGradient(distribution) {
  let position = 0;
  const stops = distribution.map((entry, index) => {
    const start = position;
    position += entry.proportion * 100;
    return `${DISEASE_CHART_COLORS[index % DISEASE_CHART_COLORS.length]} ${start}% ${position}%`;
  });

  return `conic-gradient(${stops.join(', ')})`;
}
