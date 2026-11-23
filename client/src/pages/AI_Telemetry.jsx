import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import API from '../services/app';
import {
  asksForAllDiseaseDetections,
  asksForDetectionHistory,
  DISEASE_CHART_COLORS,
  getDiseaseChartGradient,
  getDiseaseDistribution,
  normalizeChatText,
} from '../utils/diseaseDetectionChart';
import {
  asksForSensorChart,
  getSensorChartValues,
  SENSOR_CHART_COLORS,
} from '../utils/sensorReadingsChart';

const sensorMetrics = [
  { key: 'ph', label: 'pH', unit: '' },
  { key: 'tds', label: 'TDS', unit: 'ppm' },
  { key: 'temperature', label: 'Air temperature', unit: '°C' },
  { key: 'humidity', label: 'Humidity', unit: '%' },
  { key: 'water_temperature', label: 'Water temperature', unit: '°C' },
  { key: 'water_level', label: 'Water level', unit: '%' },
  { key: 'light', label: 'Light', unit: '' },
];

function getRequestedSensorMetrics(question) {
  const normalizedQuestion = normalizeChatText(question);
  const metrics = sensorMetrics.filter(({ key, label }) => {
    const terms = {
      ph: [/\bp\s*h\b|\bph\b/],
      tds: [/\btds\b/],
      temperature: [
        /\bair temperature\b/,
        /\btemperature (?:of (?:the )?air|de l air)\b/,
        /\btemperature\b(?!\s*(?:(?:of|in)\s*(?:the\s*)?water|de\s*(?:l\s*)?eau))/,
      ],
      humidity: [/\bhumidity\b/, /\bhumidite\b/],
      water_temperature: [
        /\bwater temperature\b/,
        /\btemperature of (?:the )?water\b/,
        /\btemperature de l eau\b/,
      ],
      water_level: [/\bwater level\b/, /\bniveau d eau\b/],
      light: [/\blight\b/, /\blux\b/, /\blumiere\b/],
    }[key];
    return terms.some((term) => term.test(normalizedQuestion)) || normalizedQuestion.includes(label.toLowerCase());
  });

  if (metrics.length > 0) return metrics;

  const asksAboutSensorData =
    /\b(current|currently|latest|now|sensor|reading|measurement|capteur|releve|mesure|lecture|actuel|actuellement|maintenant|dernier)\w*\b/.test(normalizedQuestion)
    || /\b(my|mon|ma|mes)\b/.test(normalizedQuestion);
  return asksAboutSensorData ? sensorMetrics : [];
}

function formatReadingTimestamp(timestamp) {
  if (!timestamp) return '—';
  const parsedTimestamp = new Date(timestamp);
  return Number.isNaN(parsedTimestamp.getTime())
    ? String(timestamp)
    : parsedTimestamp.toLocaleString();
}

function getDetectionImageUrl(imagePath) {
  if (!imagePath) return '';
  return new URL(
    imagePath,
    new URL(API.defaults.baseURL, window.location.origin),
  ).toString();
}

function formatChatTime(timestamp) {
  if (!timestamp) return '';
  const parsedTimestamp = new Date(timestamp);
  return Number.isNaN(parsedTimestamp.getTime())
    ? ''
    : parsedTimestamp.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
}

function formatSessionTime(session) {
  const timestamp = session.last_message_at ?? session.created_at;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  if (date.toDateString() === now.toDateString()) return formatChatTime(timestamp);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function isRecentSession(session) {
  const timestamp = session.last_message_at ?? session.created_at;
  const date = new Date(timestamp);
  return !Number.isNaN(date.getTime())
    && Date.now() - date.getTime() < 24 * 60 * 60 * 1000;
}

function mapStoredChatMessage(message) {
  const details = message.details ?? {};
  const userMessage = details.user_message ?? '';
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    sources: details.sources ?? [],
    sensorSnapshot: details.sensor_snapshot ?? {},
    sensorReadings: details.sensor_readings ?? [],
    sensorChartReadings: details.sensor_chart_readings ?? [],
    sensorMetrics: getRequestedSensorMetrics(userMessage),
    showSensorChart: asksForSensorChart(userMessage),
    diseaseDetections: details.disease_detections ?? [],
    showDiseaseDetections: asksForDetectionHistory(userMessage),
    showDiseaseChart: asksForAllDiseaseDetections(userMessage),
    time: formatChatTime(message.created_at),
  };
}

function SensorReadingsLineCharts({ readings, metrics }) {
  const metricSeries = metrics
    .map((metric) => ({
      metric,
      values: getSensorChartValues(readings, metric.key),
    }))
    .filter(({ values }) => values.length > 0);

  return (
    <section className="space-y-4 rounded-xl border border-outline-variant/40 p-4">
      <h3 className="text-label-sm font-label-sm font-semibold text-on-surface">
        Évolution des relevés capteurs
      </h3>
      {readings.length === 0 ? (
        <p className="text-label-sm font-label-sm text-on-surface-variant">
          Aucun relevé de capteur disponible pour tracer une courbe.
        </p>
      ) : metricSeries.length === 0 ? (
        <p className="text-label-sm font-label-sm text-on-surface-variant">
          Aucun relevé numérique disponible pour les mesures demandées.
        </p>
      ) : metricSeries.map(({ metric, values }, metricIndex) => {
        if (values.length < 2) {
          return (
            <div className="rounded-lg bg-surface-container-low p-3" key={metric.key}>
              <p className="font-semibold text-on-surface">{metric.label}</p>
              <p className="text-label-sm font-label-sm text-on-surface-variant">
                Un seul relevé est disponible ({values[0].value}{metric.unit ? ` ${metric.unit}` : ''}) ;
                il en faut au moins deux pour tracer une courbe.
              </p>
            </div>
          );
        }

        const rawMin = Math.min(...values.map(({ value }) => value));
        const rawMax = Math.max(...values.map(({ value }) => value));
        const padding = rawMin === rawMax
          ? Math.max(Math.abs(rawMin) * 0.05, 1)
          : (rawMax - rawMin) * 0.1;
        const min = rawMin - padding;
        const max = rawMax + padding;
        const width = 640;
        const height = 220;
        const left = 54;
        const right = 624;
        const top = 18;
        const bottom = 184;
        const points = values.map(({ value }, index) => {
          const x = left + (index / (values.length - 1)) * (right - left);
          const y = top + ((max - value) / (max - min)) * (bottom - top);
          return { x, y };
        });
        const linePoints = points.map(({ x, y }) => `${x},${y}`).join(' ');
        const color = SENSOR_CHART_COLORS[metricIndex % SENSOR_CHART_COLORS.length];
        const gridValues = [max, (max + min) / 2, min];

        return (
          <div className="rounded-lg bg-surface-container-low p-3" key={metric.key}>
            <p className="font-semibold text-on-surface">
              {metric.label}{metric.unit ? ` (${metric.unit})` : ''}
            </p>
            <svg
              aria-label={`Évolution de ${metric.label}, de ${values[0].value} à ${values[values.length - 1].value}, sur ${values.length} relevés`}
              className="mt-2 h-52 w-full"
              role="img"
              viewBox={`0 0 ${width} ${height}`}
            >
              {gridValues.map((value, index) => {
                const y = top + (index / (gridValues.length - 1)) * (bottom - top);
                return (
                  <g key={`${metric.key}-grid-${index}`}>
                    <line
                      opacity="0.25"
                      stroke="#64748b"
                      strokeWidth="1"
                      x1={left}
                      x2={right}
                      y1={y}
                      y2={y}
                    />
                    <text
                      fill="#64748b"
                      fontSize="12"
                      textAnchor="end"
                      x={left - 8}
                      y={y + 4}
                    >
                      {value.toFixed(1)}
                    </text>
                  </g>
                );
              })}
              <polyline
                fill="none"
                points={linePoints}
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
              {points.map(({ x, y }, index) => {
                const point = values[index];
                const pointDescription = `${metric.label} : ${point.value}${metric.unit ? ` ${metric.unit}` : ''} — ${formatReadingTimestamp(point.timestamp)}`;
                return (
                  <circle
                    aria-label={pointDescription}
                    className="cursor-pointer"
                    cx={x}
                    cy={y}
                    fill={color}
                    key={`${metric.key}-point-${index}`}
                    r="5"
                    tabIndex={0}
                  >
                    <title>{pointDescription}</title>
                  </circle>
                );
              })}
            </svg>
            <div className="flex justify-between gap-3 text-label-sm font-label-sm text-on-surface-variant">
              <span>{formatReadingTimestamp(values[0].timestamp)}</span>
              <span>{formatReadingTimestamp(values[values.length - 1].timestamp)}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function splitAnswerIntoSections(answer) {
  const normalizedAnswer = answer
    .replace(/\*{3}([^*\n]+)\*\*/g, '**$1**')
    .replace(/\s+(?=#{1,3}\s+)/g, '\n')
    .replace(/(^#{1,3}\s+.+?\*\*)\s+(?=[-*]\s+)/gm, '$1\n')
    .replace(/([.!?])\s+(?=[-*]\s+)/g, '$1\n');
  const lines = normalizedAnswer.split(/\r?\n/);
  const headingLevel = lines.some((line) => /^##\s+/.test(line)) ? 2 : 3;
  const headingPattern = new RegExp(`^#{1,${headingLevel}}\\s+(.+)$`);
  const sections = [];
  let currentSection = null;

  lines.forEach((line) => {
    const heading = line.match(headingPattern);
    if (heading) {
      currentSection = {
        title: heading[1].trim(),
        lines: [],
      };
      sections.push(currentSection);
    } else if (currentSection) {
      currentSection.lines.push(line);
    } else if (line.trim()) {
      currentSection = { title: 'Overview', lines: [line] };
      sections.push(currentSection);
    }
  });

  return sections;
}

function renderInlineMarkdown(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code className="rounded bg-surface-container px-1" key={key}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function renderDiseaseSectionContent(lines) {
  const blocks = [];
  let paragraph = [];
  let listItems = [];
  let tableLines = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(
        <p className="text-body-md text-on-surface-variant" key={`paragraph-${blocks.length}`}>
          {paragraph.flatMap((line, index) => [
            ...(index > 0 ? [' '] : []),
            ...renderInlineMarkdown(line, `paragraph-${blocks.length}-${index}`),
          ])}
        </p>,
      );
      paragraph = [];
    }
  };
  const flushList = () => {
    if (listItems.length) {
      blocks.push(
        <ul className="list-disc space-y-1 pl-5 text-body-md text-on-surface-variant" key={`list-${blocks.length}`}>
          {listItems.map((item, index) => (
            <li key={`list-${blocks.length}-${index}`}>{renderInlineMarkdown(item, `list-${blocks.length}-${index}`)}</li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  };
  const flushTable = () => {
    if (tableLines.length) {
      const rows = tableLines
        .filter((line) => !/^\|?[\s:|-]+\|?$/.test(line.trim()))
        .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()));
      if (rows.length) {
        blocks.push(
          <div className="overflow-x-auto" key={`table-${blocks.length}`}>
            <table className="w-full min-w-max border-collapse text-left text-label-sm font-label-sm">
              <thead className="bg-surface-container-low text-on-surface">
                <tr>
                  {rows[0].map((cell, index) => (
                    <th className="border-b border-outline-variant/40 px-3 py-2 font-semibold" key={`header-${index}`}>
                      {renderInlineMarkdown(cell, `table-header-${index}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, rowIndex) => (
                  <tr className="border-b border-outline-variant/30 last:border-b-0" key={`row-${rowIndex}`}>
                    {rows[0].map((_, cellIndex) => (
                      <td className="px-3 py-2 text-on-surface-variant" key={`cell-${cellIndex}`}>
                        {renderInlineMarkdown(row[cellIndex] ?? '', `table-${rowIndex}-${cellIndex}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
      }
      tableLines = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('|')) {
      flushParagraph();
      flushList();
      tableLines.push(trimmedLine);
      return;
    }
    flushTable();

    const subheading = trimmedLine.match(/^###\s+(.+)$/);
    if (subheading) {
      flushParagraph();
      flushList();
      blocks.push(
        <h4 className="pt-1 font-semibold text-on-surface" key={`subheading-${index}`}>
          {renderInlineMarkdown(subheading[1], `subheading-${index}`)}
        </h4>,
      );
      return;
    }

    const listItem = trimmedLine.match(/^[-*]\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      listItems.push(listItem[1]);
      return;
    }
    flushList();

    if (!trimmedLine) {
      flushParagraph();
      return;
    }
    paragraph.push(trimmedLine);
  });

  flushTable();
  flushList();
  flushParagraph();
  return blocks;
}

function StructuredAnswerCards({ answer }) {
  const sections = splitAnswerIntoSections(answer);
  if (!sections.length) return null;

  return (
    <div className="grid gap-3">
      {sections.map((section, index) => (
        <section
          className="overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest"
          key={`${section.title}-${index}`}
        >
          <h3 className="border-b border-outline-variant/30 bg-surface-container-low px-4 py-3 font-semibold text-on-surface">
            {renderInlineMarkdown(section.title, `section-title-${index}`)}
          </h3>
          <div className="space-y-3 p-4">
            {renderDiseaseSectionContent(section.lines)}
          </div>
        </section>
      ))}
    </div>
  );
}

function DiseaseDetectionPieChart({ detections }) {
  const distribution = getDiseaseDistribution(detections);
  if (distribution.length === 0) return null;

  const total = detections.length;
  const chartDescription = distribution
    .map(({ disease, proportion }) => `${disease} : ${(proportion * 100).toFixed(1)} %`)
    .join(', ');

  return (
    <div className="grid gap-4 border-t border-outline-variant/30 p-4 sm:grid-cols-[auto_1fr] sm:items-center">
      <div
        aria-label={`Répartition des maladies détectées : ${chartDescription}`}
        className="mx-auto h-40 w-40 rounded-full"
        role="img"
        style={{ background: getDiseaseChartGradient(distribution) }}
      />
      <div className="space-y-3">
        <p className="text-label-sm font-label-sm font-semibold text-on-surface">
          Proportions sur {total} détections
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {distribution.map((entry, index) => (
            <li className="flex items-center justify-between gap-3 text-label-sm font-label-sm" key={entry.disease}>
              <span className="flex min-w-0 items-center gap-2 text-on-surface-variant">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{
                    backgroundColor: DISEASE_CHART_COLORS[index % DISEASE_CHART_COLORS.length],
                  }}
                />
                <span className="truncate">{entry.disease}</span>
              </span>
              <span className="shrink-0 font-semibold text-on-surface">
                {entry.count} ({(entry.proportion * 100).toFixed(1)}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function AI_Telemetry() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sessionSearch, setSessionSearch] = useState('');
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const chatEndRef = useRef(null);
  const sessionLoadRef = useRef(0);
  const activeSession = chatSessions.find((session) => session.id === activeSessionId);
  const normalizedSessionSearch = normalizeChatText(sessionSearch.trim());
  const filteredChatSessions = chatSessions.filter((session) => (
    !normalizedSessionSearch
    || normalizeChatText(`${session.title} ${session.preview ?? ''}`)
      .includes(normalizedSessionSearch)
  ));
  const recentChatSessions = filteredChatSessions.filter(isRecentSession);
  const previousChatSessions = filteredChatSessions.filter((session) => !isRecentSession(session));

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSending, chatError]);

  useEffect(() => {
    let isActive = true;

    async function clearStoredSessions() {
      try {
        await API.delete('/chat/sessions');
        if (!isActive) return;
        setChatSessions([]);
        setActiveSessionId(null);
        setChatMessages([]);
        setChatError('');
        setIsLoadingMessages(false);
      } catch (error) {
        if (isActive) {
          setSessionError(
            error.response?.data?.detail
            ?? 'Unable to clear your chat sessions. Please try again.',
          );
        }
      } finally {
        if (isActive) {
          setIsLoadingSessions(false);
          setIsLoadingMessages(false);
        }
      }
    }

    clearStoredSessions();
    return () => {
      isActive = false;
      sessionLoadRef.current += 1;
    };
  }, []);

  async function createChatSession() {
    if (isCreatingSession) return null;
    setIsCreatingSession(true);
    sessionLoadRef.current += 1;
    setIsLoadingMessages(false);
    setSessionError('');
    try {
      const { data: newSession } = await API.post('/chat/sessions', {});
      setChatSessions((sessions) => [newSession, ...sessions]);
      setActiveSessionId(newSession.id);
      setChatMessages([]);
      setChatError('');
      sessionLoadRef.current += 1;
      return newSession;
    } catch (error) {
      setSessionError(
        error.response?.data?.detail
        ?? 'Unable to create a new chat session. Please try again.',
      );
      return null;
    } finally {
      setIsCreatingSession(false);
    }
  }

  async function openChatSession(sessionId) {
    if (sessionId === activeSessionId || isSending || isLoadingMessages) return;
    const requestId = sessionLoadRef.current + 1;
    sessionLoadRef.current = requestId;
    setActiveSessionId(sessionId);
    setChatMessages([]);
    setChatError('');
    setSessionError('');
    setIsLoadingMessages(true);
    try {
      const { data: storedMessages } = await API.get(
        `/chat/sessions/${sessionId}/messages`,
      );
      if (requestId === sessionLoadRef.current) {
        setChatMessages(storedMessages.map(mapStoredChatMessage));
      }
    } catch (error) {
      if (requestId === sessionLoadRef.current) {
        setSessionError(
          error.response?.data?.detail
          ?? 'Unable to load this conversation. Please try again.',
        );
      }
    } finally {
      if (requestId === sessionLoadRef.current) setIsLoadingMessages(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const userMessage = message.trim();
    if (
      !userMessage
      || isSending
      || isCreatingSession
      || isLoadingMessages
      || isLoadingSessions
    ) return;

    setMessage('');
    setChatError('');
    setIsSending(true);

    try {
      let sessionId = activeSessionId;
      if (!sessionId) {
        const newSession = await createChatSession();
        if (!newSession) return;
        sessionId = newSession.id;
      }
      const userMessageTime = new Date().toISOString();
      setChatMessages((currentMessages) => [
        ...currentMessages,
        {
          role: 'user',
          content: userMessage,
          time: formatChatTime(userMessageTime),
        },
      ]);
      setChatSessions((sessions) => {
        const existing = sessions.find((session) => session.id === sessionId);
        const updatedSession = {
          ...existing,
          id: sessionId,
          title: existing?.title === 'New Chat Session'
            ? userMessage.slice(0, 80)
            : existing?.title ?? userMessage.slice(0, 80),
          preview: userMessage,
          message_count: (existing?.message_count ?? 0) + 1,
          last_message_at: userMessageTime,
        };
        return [
          updatedSession,
          ...sessions.filter((session) => session.id !== sessionId),
        ];
      });
      const { data } = await API.post('/chat/', {
        session_id: sessionId,
        message: userMessage,
      });
      setChatMessages((currentMessages) => [
        ...currentMessages,
        mapStoredChatMessage({
          role: 'assistant',
          content: data.answer,
          details: {
            user_message: userMessage,
            sources: data.sources_used ?? [],
            sensor_snapshot: data.sensor_snapshot ?? {},
            sensor_readings: data.sensor_readings ?? [],
            sensor_chart_readings: data.sensor_chart_readings ?? [],
            disease_detections: data.disease_detections ?? [],
          },
          created_at: new Date().toISOString(),
        }),
      ]);
      const sentAt = new Date().toISOString();
      setChatSessions((sessions) => {
        const existing = sessions.find((session) => session.id === sessionId);
        const updatedSession = {
          ...existing,
          id: sessionId,
          title: existing?.title ?? userMessage.slice(0, 80),
          preview: data.answer,
          message_count: (existing?.message_count ?? 0) + 1,
          last_message_at: sentAt,
        };
        return [
          updatedSession,
          ...sessions.filter((session) => session.id !== sessionId),
        ];
      });
    } catch (error) {
      const detail = error.response?.data?.detail;
      setChatError(
        typeof detail === 'string'
          ? detail
          : 'Impossible d’obtenir une réponse pour le moment. Veuillez réessayer.',
      );
    } finally {
      setIsSending(false);
    }
  }

  function renderChatSession(session) {
    const isActive = session.id === activeSessionId;
    return (
      <button
        className={isActive
          ? 'w-full p-3 rounded-xl bg-surface-container/70 border border-primary/20 cursor-pointer flex flex-col gap-1 text-left transition-all'
          : 'w-full p-3 rounded-xl hover:bg-surface-container-low border border-transparent cursor-pointer flex flex-col gap-1 text-left transition-all group'}
        disabled={isSending || isLoadingMessages}
        key={session.id}
        onClick={() => openChatSession(session.id)}
        type="button"
      >
        <span className="flex items-center justify-between gap-2">
          <span className={`font-label-md font-semibold truncate ${isActive ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
            {session.title}
          </span>
          {isActive && <span className="w-2 h-2 rounded-full bg-tertiary shrink-0" />}
          {!isActive && (
            <span className="text-label-sm font-label-sm text-outline shrink-0">
              {formatSessionTime(session)}
            </span>
          )}
        </span>
        <span className="font-body-md text-label-sm text-on-surface-variant line-clamp-1">
          {session.preview || 'No messages yet'}
        </span>
        <span className="flex items-center gap-2 text-label-sm font-label-sm text-outline mt-0.5">
          <span className="material-symbols-outlined text-[14px]">forum</span>
          {session.message_count || 0} msgs
          {isActive && <span>{formatSessionTime(session)}</span>}
        </span>
      </button>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-on-surface flex flex-col overflow-x-hidden">
      
      {/* 1. Fixed Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-[68px] z-40 bg-surface-container-lowest border-r border-outline-variant/30 shadow-sm flex flex-col justify-between items-center py-5 margin-top: 68.8px;">
        <div className="invisible flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[24px]">sensors</span>
          </div>
          <span className="font-label-caps text-label-caps text-primary tracking-wider scale-90">AERO</span>
        </div>

        <nav className="flex flex-col items-center gap-2 text-center">
          <Link className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors text-center" to="/" title="Dashboard">
            <span className="material-symbols-outlined text-[22px]">dashboard</span>
          </Link>

          <Link className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors text-center" to="/image-analysis" title="Media Analysis">
            <span className="material-symbols-outlined text-[22px]">perm_media</span>
          </Link>
          <Link className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors text-center" to="/knowledge-base" title="File Ingestion">
            <span className="material-symbols-outlined text-[22px]">upload_file</span>
          </Link>
          <Link className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors text-center" to="/plants" title="Plant Registry &amp; Crop Systems">
            <span className="material-symbols-outlined text-[22px]">potted_plant</span>
          </Link>

          <Link className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface-container text-primary transition-colors text-center" to="/ai-chat" title="AI Assistant">
            <span className="material-symbols-outlined text-[22px]">smart_toy</span>
          </Link>

          <Link className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors text-center" to="/iot-simulator" title="Telemetry Simulator">
            <span className="material-symbols-outlined text-[22px]">tune</span>
          </Link>

          <Link className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors text-center" to="/iot-simulator" title="Devices">
            <span className="material-symbols-outlined text-[22px]">sensors</span>
          </Link>
        </nav>

        <div className="flex flex-col items-center gap-2 text-center">
          <LogoutButton className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-error hover:bg-surface-container-low transition-colors text-center" title="Logout" aria-label="Logout">
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </LogoutButton>
        </div>
      </aside>

      {/* 2. Fixed Top Header Navbar */}
      {/* <header className="fixed top-0 right-0 z-30 ml-[68px] w-[calc(100%-68px)] h-[61px] bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm flex justify-between items-center px-6">
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col leading-tight">
            <span className="font-headline-md text-headline-md text-on-surface font-bold">SmartPlant</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider font-bold">Telemetry</span>
          </div>
          <span className="bg-primary/10 text-primary text-label-caps font-label-caps px-2 py-0.5 rounded-full border border-primary/20">v2.4</span>
        </div>
        <div className="flex-1 flex justify-center px-6">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">search</span>
            <input className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-9 pr-3 py-1.5 text-label-md font-label-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Search sensors, logs, or tags..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/50 text-label-md font-label-md font-medium text-on-surface hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[18px]">file_download</span>Export Data
          </button>
          <button className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors relative" title="Notifications">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest"></span>
          </button>
          <div className="flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center text-label-sm">AD</div>
          </div>
        </div>
      </header> */}

      {/* 3. Main Workspace Area (Offset by sidebar width and top header height) */}
      <div className="ml-[68px] pt-3 w-[calc(100%-68px)] h-[calc(100vh-61px)] flex overflow-hidden">
        
        {/* Left Conversations Sidebar */}
        <section className="w-80 h-full bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col shrink-0">
          <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">forum</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Conversations</h2>
            </div>
            <button
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-low text-primary hover:bg-surface-container text-label-md font-label-md transition-colors disabled:opacity-50"
              disabled={isCreatingSession || isLoadingSessions || isLoadingMessages || isSending}
              onClick={createChatSession}
              title="Start new diagnostics chat"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              New Chat
            </button>
          </div>

          <div className="px-4 py-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-[16px]">search</span>
              <input
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-8 pr-3 py-1.5 text-label-sm font-label-sm text-on-surface focus:outline-none focus:border-primary"
                onChange={(event) => setSessionSearch(event.target.value)}
                placeholder="Search sessions..."
                type="text"
                value={sessionSearch}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            <span className="text-label-caps font-label-caps text-outline px-2 tracking-wider">ACTIVE &amp; RECENT</span>
            {sessionError && (
              <p className="px-2 py-2 text-label-sm font-label-sm text-error" role="alert">
                {sessionError}
              </p>
            )}
            {isLoadingSessions ? (
              <p className="px-2 py-3 text-label-sm font-label-sm text-outline">Loading sessions…</p>
            ) : (
              <>
                {recentChatSessions.map(renderChatSession)}
                {previousChatSessions.length > 0 && (
                  <>
                    <span className="text-label-caps font-label-caps text-outline px-2 tracking-wider pt-3 block">
                      PREVIOUS DAYS
                    </span>
                    {previousChatSessions.map(renderChatSession)}
                  </>
                )}
                {filteredChatSessions.length === 0 && (
                  <p className="px-2 py-3 text-label-sm font-label-sm text-outline">
                    {chatSessions.length === 0
                      ? 'No conversations yet. Start a new chat.'
                      : 'No sessions match your search.'}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="p-3.5 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></div>
              <div>
                <p className="text-label-sm font-label-sm font-semibold text-on-surface">Telemetry Gateway</p>
                <p className="text-label-sm font-label-sm text-outline">Latency: 14ms (Healthy)</p>
              </div>
            </div>
            <button className="p-1 rounded text-outline hover:text-on-surface" title="Gateway Details">
              <span className="material-symbols-outlined text-[18px]">info</span>
            </button>
          </div>
        </section>

        {/* Right Content / Chat Panel */}
        <main className="flex-1 flex flex-col bg-background h-full overflow-hidden">
          
          {/* Chat Panel Top Sub-Header */}
          <header className="h-14 bg-surface-container-lowest border-b border-outline-variant/30 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-md text-headline-md text-on-surface leading-tight">SmartPlant AI Assistant</h1>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-low text-tertiary font-label-sm text-label-sm font-semibold border border-tertiary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    Online (Active)
                  </span>
                </div>
                <p className="text-label-sm font-label-sm text-outline">Automated Telemetry Reasoning Engine • Model v2.4-IoT</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low text-label-md font-label-md transition-colors" title="Export conversation log">
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                Audit Log
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:text-error hover:border-error/30 hover:bg-error-container/20 text-label-md font-label-md transition-colors" title="Clear current chat stream">
                <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                Clear Chat
              </button>
            </div>
          </header>

          {/* Chat Messages Scrollable Stream */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <div className="flex items-center justify-center">
              <span className="px-3 py-1 bg-surface-container rounded-full text-label-sm font-label-sm text-outline border border-outline-variant/30">
                {activeSession
                  ? `${formatSessionTime(activeSession)} - ${activeSession.title}`
                  : 'New conversation'}
              </span>
            </div>
            {isLoadingMessages && (
              <p className="text-center text-label-sm font-label-sm text-outline" aria-live="polite">
                Loading conversation...
              </p>
            )}
            {!isLoadingMessages && chatMessages.length === 0 && (
              <div className="flex gap-3 max-w-5xl">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl rounded-tl-xs p-5 shadow-sm flex-1">
                  <p className="text-body-md text-on-surface">
                    Start a conversation by asking about your crops, sensor readings, or disease detections.
                  </p>
                </div>
              </div>
            )}
            {chatMessages.map((chatMessage, index) => (
              chatMessage.role === 'user' ? (
                <div className="flex justify-end gap-3 max-w-4xl ml-auto" key={`user-${index}`}>
                  <div className="flex flex-col items-end">
                    <div className="bg-primary text-on-primary rounded-2xl rounded-tr-xs px-4 py-3 shadow-sm max-w-xl">
                      <p className="font-body-md text-body-md whitespace-pre-wrap">{chatMessage.content}</p>
                    </div>
                    <div className="flex items-center gap-1 text-label-sm font-label-sm text-outline mt-1 pr-1">
                      <span>{chatMessage.time}</span>
                      <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-label-sm font-bold shrink-0">
                    You
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 max-w-5xl" key={`assistant-${index}`}>
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl rounded-tl-xs p-5 shadow-sm space-y-3 flex-1">
                    {chatMessage.showSensorChart && (
                      <SensorReadingsLineCharts
                        metrics={chatMessage.sensorMetrics}
                        readings={chatMessage.sensorChartReadings}
                      />
                    )}
                    {chatMessage.sensorMetrics.length > 0 && chatMessage.sensorReadings.length > 0 && (
                      <div className="overflow-x-auto rounded-xl border border-outline-variant/40">
                        <table className="w-full min-w-max border-collapse text-left text-label-sm font-label-sm">
                          <caption className="bg-surface-container-low px-3 py-2 text-left font-semibold text-on-surface">
                            Sensor readings ({chatMessage.sensorReadings.length})
                          </caption>
                          <thead className="bg-surface-container-low/60 text-on-surface-variant">
                            <tr>
                              {chatMessage.sensorMetrics.map((metric) => (
                                <th className="px-3 py-2 font-semibold" key={metric.key} scope="col">
                                  {metric.label}
                                </th>
                              ))}
                              <th className="px-3 py-2 font-semibold" scope="col">Recorded</th>
                            </tr>
                          </thead>
                          <tbody>
                            {chatMessage.sensorReadings.map((reading, readingIndex) => (
                              <tr className="border-t border-outline-variant/30" key={`${reading.timestamp}-${readingIndex}`}>
                                {chatMessage.sensorMetrics.map((metric) => {
                                  const value = reading[metric.key];
                                  return (
                                    <td className="px-3 py-2 text-on-surface-variant" key={metric.key}>
                                      {value === null || value === undefined
                                        ? '—'
                                        : `${value}${metric.unit ? ` ${metric.unit}` : ''}`}
                                    </td>
                                  );
                                })}
                                <td className="px-3 py-2 text-on-surface-variant">
                                  {formatReadingTimestamp(reading.timestamp)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {chatMessage.showDiseaseDetections && (
                      <section className="overflow-hidden rounded-xl border border-outline-variant/40">
                        <h3 className="bg-surface-container-low px-3 py-2 text-label-sm font-label-sm font-semibold text-on-surface">
                          Disease detection history ({chatMessage.diseaseDetections.length})
                        </h3>
                        {chatMessage.showDiseaseChart && chatMessage.diseaseDetections.length > 0 && (
                          <DiseaseDetectionPieChart detections={chatMessage.diseaseDetections} />
                        )}
                        {chatMessage.diseaseDetections.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2">
                            {chatMessage.diseaseDetections.map((detection, detectionIndex) => (
                              <article
                                className="overflow-hidden rounded-lg border border-outline-variant/40 bg-surface-container-lowest"
                                key={detection.id ?? `${detection.detection_time}-${detectionIndex}`}
                              >
                                {detection.image_path ? (
                                  <img
                                    alt={`${detection.prediction} detection on ${detection.crop ?? 'plant'}`}
                                    className="h-48 w-full bg-surface-container object-contain"
                                    loading="lazy"
                                    src={getDetectionImageUrl(detection.image_path)}
                                  />
                                ) : (
                                  <div className="flex h-24 items-center justify-center bg-surface-container text-label-sm font-label-sm text-outline">
                                    No detection image available
                                  </div>
                                )}
                                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-outline-variant/30 p-3 text-label-sm font-label-sm">
                                  <dt className="font-semibold text-on-surface">Disease</dt>
                                  <dd className="text-on-surface-variant">{detection.prediction ?? 'Unknown'}</dd>
                                  <dt className="font-semibold text-on-surface">Crop</dt>
                                  <dd className="text-on-surface-variant">{detection.crop ?? '—'}</dd>
                                  <dt className="font-semibold text-on-surface">Plant</dt>
                                  <dd className="text-on-surface-variant">{detection.plant_name ?? '—'}</dd>
                                  <dt className="font-semibold text-on-surface">Confidence</dt>
                                  <dd className="text-on-surface-variant">
                                    {detection.confidence == null
                                      ? '—'
                                      : `${(Number(detection.confidence) * 100).toFixed(1)}%`}
                                  </dd>
                                  <dt className="font-semibold text-on-surface">Detected</dt>
                                  <dd className="text-on-surface-variant">
                                    {formatReadingTimestamp(detection.detection_time)}
                                  </dd>
                                </dl>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <p className="px-3 py-4 text-label-sm font-label-sm text-on-surface-variant">
                            No disease detections have been recorded for your plants.
                          </p>
                        )}
                      </section>
                    )}
                    <StructuredAnswerCards answer={chatMessage.content} />
                    {chatMessage.sources.length > 0 && (
                      <div className="border-t border-outline-variant/20 pt-2 text-label-sm font-label-sm text-outline">
                        Sources: {[...new Set(chatMessage.sources.map((source) => source.document))].join(', ')}
                      </div>
                    )}
                    <div className="text-right text-label-sm font-label-sm text-outline">
                      {chatMessage.time}
                    </div>
                  </div>
                </div>
              )
            ))}

            {isSending && (
              <div className="flex gap-3 max-w-5xl" aria-live="polite">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl rounded-tl-xs px-4 py-3 shadow-sm text-body-md text-on-surface-variant">
                  Searching your farm data and preparing an answer…
                </div>
              </div>
            )}
            {chatError && (
              <p className="ml-11 text-label-sm font-label-sm text-error" role="alert">
                {chatError}
              </p>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Footer */}
          <footer className="p-4 bg-surface-container-lowest border-t border-outline-variant/30 shrink-0">
            <div className="max-w-5xl mx-auto space-y-2">
              <form className="relative bg-surface-container-low border border-outline-variant/40 rounded-xl p-2 flex items-center gap-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm" onSubmit={handleSubmit}>
                <button className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors shrink-0" title="Attach telemetry dump, sensor log, or CSV">
                  <span className="material-symbols-outlined text-[20px]">attach_file</span>
                </button>

                <input
                  className="w-full bg-transparent border-0 focus:ring-0 text-body-md font-body-md text-on-surface placeholder:text-outline/70 focus:outline-none"
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Ask about your crop, sensor readings, or disease detections..."
                  type="text"
                  value={message}
                />

                <button className="p-2 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors shrink-0" title="Voice Telemetry Input">
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </button>

                <button className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-primary/90 transition-all shrink-0 shadow-sm active:scale-95 disabled:opacity-50" disabled={isSending || isCreatingSession || isLoadingMessages || isLoadingSessions || !message.trim()} title="Send message" type="submit">
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </form>

              <div className="flex items-center justify-between px-1 text-label-sm font-label-sm text-outline">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">shield</span>
                  <span>Encrypted Diagnostics Channel • ISO 27001 Certified IoT Telemetry Protocol</span>
                </div>
                <span>Press <kbd className="px-1.5 py-0.5 bg-surface-container rounded border border-outline-variant/40 text-label-sm">Enter ↵</kbd> to execute</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}