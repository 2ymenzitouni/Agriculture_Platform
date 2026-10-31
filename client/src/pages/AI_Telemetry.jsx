<<<<<<< HEAD
import { useEffect, useRef, useState } from 'react';
import LogoutButton from '../components/LogoutButton';
import API from '../services/app';

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
  const normalizedQuestion = question.toLowerCase();
  const metrics = sensorMetrics.filter(({ key, label }) => {
    const terms = {
      ph: [/\bp\s*h\b|\bph\b/],
      tds: [/\btds\b/],
      temperature: [/\bair temperature\b/, /\btemperature\b(?!\s*(?:of|in)\s*water)/],
      humidity: [/\bhumidity\b/],
      water_temperature: [/\bwater temperature\b/, /\btemperature of (?:the )?water\b/],
      water_level: [/\bwater level\b/],
      light: [/\blight\b/, /\blux\b/],
    }[key];
    return terms.some((term) => term.test(normalizedQuestion)) || normalizedQuestion.includes(label.toLowerCase());
  });

  if (metrics.length > 0) return metrics;

  const asksAboutSensorData =
    /\b(current|currently|latest|now|sensor|reading|measurement)\b/.test(normalizedQuestion)
    || /\bmy\b/.test(normalizedQuestion);
  return asksAboutSensorData ? sensorMetrics : [];
}

function formatReadingTimestamp(timestamp) {
  if (!timestamp) return '—';
  const parsedTimestamp = new Date(timestamp);
  return Number.isNaN(parsedTimestamp.getTime())
    ? String(timestamp)
    : parsedTimestamp.toLocaleString();
}

function asksForDetectionHistory(question) {
  return /\b(detect\w*|diagnos\w*|image\w*|photo\w*|picture\w*|history|record\w*|found|seen)\b/i.test(question)
    && /\b(disease\w*|detect\w*|image\w*|photo\w*|picture\w*|diagnos\w*|infection\w*|infected|sick|blight|spot|mildew|mosaic|rust|rot|wilt|canker|scab|septoria|anthracnose|target)\b/i.test(question);
}

function getDetectionImageUrl(imagePath) {
  if (!imagePath) return '';
  return new URL(
    imagePath,
    new URL(API.defaults.baseURL, window.location.origin),
  ).toString();
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

export default function AI_Telemetry() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSending, chatError]);

  async function handleSubmit(event) {
    event.preventDefault();
    const userMessage = message.trim();
    if (!userMessage || isSending) return;

    setChatMessages((currentMessages) => [
      ...currentMessages,
      {
        role: 'user',
        content: userMessage,
        time: new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        }),
      },
    ]);
    setMessage('');
    setChatError('');
    setIsSending(true);

    try {
      const { data } = await API.post('/chat/', {
        session_id: 1,
        message: userMessage,
      });
      setChatMessages((currentMessages) => [
        ...currentMessages,
        {
          role: 'assistant',
          content: data.answer,
          sources: data.sources_used ?? [],
          sensorSnapshot: data.sensor_snapshot ?? {},
          sensorReadings: data.sensor_readings ?? [],
          sensorMetrics: getRequestedSensorMetrics(userMessage),
          diseaseDetections: data.disease_detections ?? [],
          showDiseaseDetections: asksForDetectionHistory(userMessage),
          time: new Date().toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
          }),
        },
      ]);
    } catch (error) {
      const detail = error.response?.data?.detail;
      setChatError(
        typeof detail === 'string'
          ? detail
          : 'Unable to get an answer right now. Please try again.',
      );
    } finally {
      setIsSending(false);
    }
  }

=======
import LogoutButton from '../components/LogoutButton';

export default function AI_Telemetry() {
>>>>>>> origin/main
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
          <a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors text-center" href="#" title="Dashboard">
            <span className="material-symbols-outlined text-[22px]">dashboard</span>
          </a>

          <a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors text-center" href="#" title="Media Analysis">
            <span className="material-symbols-outlined text-[22px]">perm_media</span>
          </a>
          <a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors text-center" href="#" title="File Ingestion">
            <span className="material-symbols-outlined text-[22px]">upload_file</span>
          </a>
          <a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors text-center" href="#" title="Plant Registry &amp; Crop Systems">
            <span className="material-symbols-outlined text-[22px]">potted_plant</span>
          </a>

          <a className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface-container text-primary transition-colors text-center" href="#" title="AI Assistant">
            <span className="material-symbols-outlined text-[22px]">smart_toy</span>
          </a>

          <a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors text-center" href="#" title="Telemetry Simulator">
            <span className="material-symbols-outlined text-[22px]">tune</span>
          </a>

          <a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors text-center" href="#" title="Devices">
            <span className="material-symbols-outlined text-[22px]">sensors</span>
          </a>
        </nav>

        <div className="flex flex-col items-center gap-2 text-center">
          <button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors text-center" title="Settings">
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>
          <LogoutButton className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-error hover:bg-surface-container-low transition-colors text-center" title="Logout" aria-label="Logout">
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </LogoutButton>
        </div>
      </aside>

      {/* 2. Fixed Top Header Navbar */}
      {/* <header className="fixed top-0 right-0 z-30 ml-[68px] w-[calc(100%-68px)] h-[61px] bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm flex justify-between items-center px-6">
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col leading-tight">
            <span className="font-headline-md text-headline-md text-on-surface font-bold">AeroSense</span>
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
            <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-low text-primary hover:bg-surface-container text-label-md font-label-md transition-colors" title="Start new diagnostics chat">
              <span className="material-symbols-outlined text-[16px]">add</span>
              New Chat
            </button>
          </div>

          <div className="px-4 py-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-[16px]">search</span>
              <input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-8 pr-3 py-1.5 text-label-sm font-label-sm text-on-surface focus:outline-none focus:border-primary" placeholder="Search sessions..." type="text" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            <span className="text-label-caps font-label-caps text-outline px-2 tracking-wider">ACTIVE &amp; RECENT</span>

            <div className="p-3 rounded-xl bg-surface-container/70 border border-primary/20 cursor-pointer flex flex-col gap-1 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-label-md font-semibold text-primary truncate">Anomaly check on Tank B</span>
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              </div>
              <p className="font-body-md text-label-sm text-on-surface-variant line-clamp-1">Telemetry alert: thermal runaway threshold...</p>
              <div className="flex items-center gap-2 text-label-sm font-label-sm text-outline mt-0.5">
                <span className="material-symbols-outlined text-[14px]">cloud_download</span>
                Just now • 12 msgs
              </div>
            </div>

            <div className="p-3 rounded-xl hover:bg-surface-container-low border border-transparent cursor-pointer flex flex-col gap-1 transition-all group">
              <div className="flex items-center justify-between">
                <span className="font-label-md font-semibold text-on-surface group-hover:text-primary truncate">Weather forecast summary</span>
                <span className="text-label-sm font-label-sm text-outline">10:45 AM</span>
              </div>
              <p className="font-body-md text-label-sm text-on-surface-variant line-clamp-1">Atmospheric humidity vs. condensation model...</p>
              <div className="flex items-center gap-2 text-label-sm font-label-sm text-outline mt-0.5">
                <span className="material-symbols-outlined text-[14px]">cloud</span>
                4 nodes verified
              </div>
            </div>

            <div className="p-3 rounded-xl hover:bg-surface-container-low border border-transparent cursor-pointer flex flex-col gap-1 transition-all group">
              <div className="flex items-center justify-between">
                <span className="font-label-md font-semibold text-on-surface group-hover:text-primary truncate">pH balance calibration</span>
                <span className="text-label-sm font-label-sm text-outline">Yesterday</span>
              </div>
              <p className="font-body-md text-label-sm text-on-surface-variant line-clamp-1">Electrode buffer offset aligned to 6.84...</p>
              <div className="flex items-center gap-2 text-label-sm font-label-sm text-outline mt-0.5">
                <span className="material-symbols-outlined text-[14px]">biotech</span>
                Sensor Probe #04
              </div>
            </div>
            <span className="text-label-caps font-label-caps text-outline px-2 tracking-wider pt-3 block">PREVIOUS DAYS</span>

            <div className="p-3 rounded-xl hover:bg-surface-container-low border border-transparent cursor-pointer flex flex-col gap-1 transition-all group">
              <div className="flex items-center justify-between">
                <span className="font-label-md font-semibold text-on-surface group-hover:text-primary truncate">Hydraulic valve pressure drop</span>
                <span className="text-label-sm font-label-sm text-outline">Mar 22</span>
              </div>
              <p className="font-body-md text-label-sm text-on-surface-variant line-clamp-1">Flow velocity reduced below 1.2 m/s safely...</p>
            </div>

            <div className="p-3 rounded-xl hover:bg-surface-container-low border border-transparent cursor-pointer flex flex-col gap-1 transition-all group">
              <div className="flex items-center justify-between">
                <span className="font-label-md font-semibold text-on-surface group-hover:text-primary truncate">Turbine 02 vibration harmonics</span>
                <span className="text-label-sm font-label-sm text-outline">Mar 19</span>
              </div>
              <p className="font-body-md text-label-sm text-on-surface-variant line-clamp-1">Spectral frequency peaks within zone 2 tolerance...</p>
            </div>
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
                  <h1 className="font-headline-md text-headline-md text-on-surface leading-tight">AeroSense AI Assistant</h1>
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
                Today • Telemetry Incident Session #8902-B
              </span>
            </div>

            <div className="flex justify-end gap-3 max-w-4xl ml-auto">
              <div className="flex flex-col items-end">
                <div className="bg-primary text-on-primary rounded-2xl rounded-tr-xs px-4 py-3 shadow-sm max-w-xl">
                  <p className="font-body-md text-body-md">Can you run an anomaly check on Tank B? We noticed temperature spikes around 11:20 AM and pressure oscillation.</p>
                </div>
                <div className="flex items-center gap-1 text-label-sm font-label-sm text-outline mt-1 pr-1">
                  <span>11:24 AM</span>
                  <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-label-sm font-bold shrink-0">
                AD
              </div>
            </div>

            <div className="flex gap-3 max-w-5xl">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div className="space-y-4 flex-1">
                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl rounded-tl-xs p-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
                    <span className="font-label-caps text-label-caps text-primary tracking-wider">DIAGNOSTIC TELEMETRY ANALYSIS</span>
                    <span className="text-label-sm font-label-sm text-outline">Generated in 240ms</span>
                  </div>
                  <p className="text-on-surface font-body-md text-body-md mb-2">
                    I ingested the last 30 minutes of multi-sensor telemetry from <strong className="text-primary font-semibold">Storage Tank B (Substation 4)</strong>. An abnormal thermal gradient was detected starting at 11:18 AM, correlating with an unexpected throttle drop on inlet Valve V-12.
                  </p>
                  <p className="text-on-surface-variant font-body-md text-body-md">
                    Current conditions exceed baseline thresholds by <strong>+18.4%</strong>. Here is the active telemetry breakdown:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                    <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between">
                      <div>
                        <div className="text-label-caps font-label-caps text-outline tracking-wider">TANK B CORE TEMP</div>
                        <div className="text-display-metric font-display-metric text-on-surface mt-0.5">84.2<span className="text-headline-md font-headline-md text-outline">°C</span></div>
                        <div className="inline-flex items-center gap-1 text-label-sm font-label-sm text-error mt-1 font-semibold">
                          <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                          +6.2°C above max
                        </div>
                      </div>

                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-14 h-14 transform -rotate-90">
                          <circle className="text-outline-variant/30 fill-none" cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="5"></circle>
                          <circle className="text-primary-container fill-none" cx="28" cy="28" r="22" stroke="currentColor" strokeDasharray="138" strokeDashoffset="35" strokeLinecap="round" strokeWidth="5"></circle>
                        </svg>
                        <span className="absolute font-label-sm text-label-sm font-bold text-on-surface">84%</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between">
                      <div>
                        <div className="text-label-caps font-label-caps text-outline tracking-wider">BAROMETRIC HEAD</div>
                        <div className="text-display-metric font-display-metric text-on-surface mt-0.5">4.8<span className="text-headline-md font-headline-md text-outline"> bar</span></div>
                        <div className="inline-flex items-center gap-1 text-label-sm font-label-sm text-tertiary mt-1 font-semibold">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Within safe yield
                        </div>
                      </div>

                      <div className="w-16 space-y-1">
                        <div className="h-2 w-full bg-outline-variant/30 rounded-full overflow-hidden">
                          <div className="h-full bg-secondary w-3/4 rounded-full"></div>
                        </div>
                        <div className="text-label-sm font-label-sm text-right text-outline">68% lim</div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between">
                      <div>
                        <div className="text-label-caps font-label-caps text-outline tracking-wider">COOLANT FLOW V-12</div>
                        <div className="text-display-metric font-display-metric text-on-surface mt-0.5">18<span className="text-headline-md font-headline-md text-outline"> L/m</span></div>
                        <div className="inline-flex items-center gap-1 text-label-sm font-label-sm text-error mt-1 font-semibold">
                          <span className="material-symbols-outlined text-[14px]">warning</span>
                          Deficit -42%
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-error-container/40 text-error flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">valve</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">monitoring</span>
                        <span className="font-label-md font-semibold text-on-surface">30-Minute Temperature Spike Spectrum (Probe T-B1)</span>
                      </div>
                      <span className="text-label-sm font-label-sm text-outline">Sample rate: 100ms</span>
                    </div>
                    <div className="w-full h-24 relative flex items-end">
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 90">
                        <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="4 4" x1="0" x2="500" y1="20" y2="20"></line>
                        <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="4 4" x1="0" x2="500" y1="60" y2="60"></line>

                        <defs>
                          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3"></stop>
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0"></stop>
                          </linearGradient>
                        </defs>
                        <path d="M 0 65 L 50 63 L 100 66 L 150 60 L 200 62 L 250 55 L 290 40 L 320 25 L 350 18 L 380 22 L 420 30 L 460 28 L 500 24 L 500 90 L 0 90 Z" fill="url(#chartGradient)"></path>
                        <path d="M 0 65 L 50 63 L 100 66 L 150 60 L 200 62 L 250 55 L 290 40 L 320 25 L 350 18 L 380 22 L 420 30 L 460 28 L 500 24" fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="2.5"></path>

                        <circle className="fill-error stroke-surface-container-lowest" cx="350" cy="18" r="4" strokeWidth="2"></circle>
                      </svg>
                    </div>
                    <div className="flex justify-between text-label-sm font-label-sm text-outline mt-1.5 pt-1 border-t border-outline-variant/20">
                      <span>10:55 AM (65.8°C)</span>
                      <span>11:18 AM (Anomaly Trigger)</span>
                      <span className="text-error font-medium">11:20 AM Peak (84.2°C)</span>
                      <span>11:25 AM (Live)</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-outline-variant/20">
                    <div className="flex items-center gap-1.5 text-label-caps font-label-caps text-on-surface-variant font-bold mb-2">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                      RECOMMENDED CORRECTIVE ACTIONS
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-lg border border-primary/20 bg-surface-container-low flex items-center justify-between">
                        <div>
                          <p className="font-label-md font-semibold text-on-surface">Auto-adjust Coolant Valve</p>
                          <p className="text-label-sm font-label-sm text-outline">Increase flow to 35 L/m to counter gradient</p>
                        </div>
                        <button className="px-2.5 py-1.5 bg-primary text-on-primary rounded-lg text-label-sm font-label-sm font-semibold hover:bg-primary/90 transition-all shrink-0">
                          Apply Action
                        </button>
                      </div>

                      <div className="p-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest flex items-center justify-between">
                        <div>
                          <p className="font-label-md font-semibold text-on-surface">Secondary Fan Overdrive</p>
                          <p className="text-label-sm font-label-sm text-outline">Spins auxiliary fan bank B-2 up to 100%</p>
                        </div>
                        <button className="px-2.5 py-1.5 border border-outline-variant/50 text-on-surface rounded-lg text-label-sm font-label-sm font-medium hover:bg-surface-container-low transition-all shrink-0">
                          Execute
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-outline-variant/10 text-label-sm font-label-sm text-outline">
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 hover:text-on-surface" title="Copy diagnosis"><span className="material-symbols-outlined text-[16px]">content_copy</span> Copy</button>
                      <button className="flex items-center gap-1 hover:text-on-surface" title="Create incident report"><span className="material-symbols-outlined text-[16px]">assignment</span> Generate Incident Ticket</button>
                      <button className="flex items-center gap-1 hover:text-on-surface" title="Good response"><span className="material-symbols-outlined text-[16px]">thumb_up</span></button>
                      <button className="flex items-center gap-1 hover:text-on-surface" title="Needs improvement"><span className="material-symbols-outlined text-[16px]">thumb_down</span></button>
                    </div>
                    <span>11:24 AM • Verified by Model Confidence: 98.4%</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 pl-1">
                  <span className="text-label-caps font-label-caps text-outline tracking-wider">SUGGESTED ACTIONS:</span>
                  <button className="px-3 py-1 rounded-full bg-surface-container-lowest border border-outline-variant/40 hover:border-primary text-label-sm font-label-sm text-on-surface hover:text-primary transition-all flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px] text-primary">sensors</span>
                    Check sensor status
                  </button>
                  <button className="px-3 py-1 rounded-full bg-surface-container-lowest border border-outline-variant/40 hover:border-primary text-label-sm font-label-sm text-on-surface hover:text-primary transition-all flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px] text-primary">cloud_queue</span>
                    Summarize weather trends
                  </button>
                  <button className="px-3 py-1 rounded-full bg-surface-container-lowest border border-outline-variant/40 hover:border-primary text-label-sm font-label-sm text-on-surface hover:text-primary transition-all flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px] text-primary">cyclone</span>
                    Simulate pump cycle
                  </button>
                  <button className="px-3 py-1 rounded-full bg-surface-container-lowest border border-outline-variant/40 hover:border-primary text-label-sm font-label-sm text-on-surface hover:text-primary transition-all flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px] text-primary">lock_reset</span>
                    Reset Thermal Interlock
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 max-w-4xl ml-auto">
              <div className="flex flex-col items-end">
                <div className="bg-primary text-on-primary rounded-2xl rounded-tr-xs px-4 py-3 shadow-sm max-w-xl">
                  <p className="font-body-md text-body-md">Simulate pump cycle with coolant flow at 35 L/m. How fast will core temperature normalize to 65°C?</p>
                </div>
                <div className="flex items-center gap-1 text-label-sm font-label-sm text-outline mt-1 pr-1">
                  <span>11:26 AM</span>
                  <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-label-sm font-bold shrink-0">
                AD
              </div>
            </div>

            <div className="flex gap-3 max-w-5xl">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl rounded-tl-xs p-5 shadow-sm space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-primary tracking-wider">PREDICTIVE SIMULATION RESULT</span>
                  <span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-tertiary font-semibold">
                    <span className="material-symbols-outlined text-[16px]">verified</span> Safe Trajectory
                  </span>
                </div>
                <p className="text-on-surface font-body-md text-body-md">
                  Running dynamic thermodynamic simulation using digital twin profile <span className="font-semibold text-primary">DT-TankB-Hydro</span>. At <strong>35 L/m</strong>, temperature is projected to drop below nominal threshold (65.0°C) within <strong className="text-primary">6 minutes 40 seconds</strong>.
                </p>

                <div className="grid grid-cols-3 gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 text-center">
                  <div>
                    <p className="text-label-caps font-label-caps text-outline">ESTIMATED DROP TIME</p>
                    <p className="text-headline-md font-headline-md font-bold text-on-surface mt-0.5">6m 40s</p>
                  </div>
                  <div className="border-x border-outline-variant/30">
                    <p className="text-label-caps font-label-caps text-outline">PUMP POWER DRAW</p>
                    <p className="text-headline-md font-headline-md font-bold text-on-surface mt-0.5">2.4 kW <span className="text-label-sm font-normal text-outline">(+0.3)</span></p>
                  </div>
                  <div>
                    <p className="text-label-caps font-label-caps text-outline">SYSTEM STABILITY</p>
                    <p className="text-headline-md font-headline-md font-bold text-tertiary mt-0.5">Optimal</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-label-md font-label-md font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    Commit Simulation to PLC Controller
                  </button>
                  <button className="px-3.5 py-1.5 rounded-lg border border-outline-variant/50 text-on-surface text-label-md font-label-md font-medium hover:bg-surface-container-low">
                    Adjust Parameters
                  </button>
                </div>
              </div>
            </div>
<<<<<<< HEAD

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
                    {chatMessage.sensorMetrics.length > 0 && (
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
                            {chatMessage.sensorReadings.length === 0 && (
                              <tr className="border-t border-outline-variant/30">
                                <td
                                  className="px-3 py-3 text-on-surface-variant"
                                  colSpan={chatMessage.sensorMetrics.length + 1}
                                >
                                  No sensor readings found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {chatMessage.showDiseaseDetections && (
                      <section className="overflow-hidden rounded-xl border border-outline-variant/40">
                        <h3 className="bg-surface-container-low px-3 py-2 text-label-sm font-label-sm font-semibold text-on-surface">
                          Disease detection history ({chatMessage.diseaseDetections.length})
                        </h3>
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
=======
>>>>>>> origin/main
          </div>

          {/* Chat Input Footer */}
          <footer className="p-4 bg-surface-container-lowest border-t border-outline-variant/30 shrink-0">
            <div className="max-w-5xl mx-auto space-y-2">
<<<<<<< HEAD
              <form className="relative bg-surface-container-low border border-outline-variant/40 rounded-xl p-2 flex items-center gap-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm" onSubmit={handleSubmit}>
=======
              <div className="relative bg-surface-container-low border border-outline-variant/40 rounded-xl p-2 flex items-center gap-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
>>>>>>> origin/main
                <button className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors shrink-0" title="Attach telemetry dump, sensor log, or CSV">
                  <span className="material-symbols-outlined text-[20px]">attach_file</span>
                </button>

<<<<<<< HEAD
                <input
                  className="w-full bg-transparent border-0 focus:ring-0 text-body-md font-body-md text-on-surface placeholder:text-outline/70 focus:outline-none"
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Ask about your crop, sensor readings, or disease detections..."
                  type="text"
                  value={message}
                />
=======
                <input className="w-full bg-transparent border-0 focus:ring-0 text-body-md font-body-md text-on-surface placeholder:text-outline/70 focus:outline-none" placeholder="Ask AeroSense AI diagnostic questions, run sensor tests, or trigger automated commands..." type="text" />
>>>>>>> origin/main

                <button className="p-2 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors shrink-0" title="Voice Telemetry Input">
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </button>

<<<<<<< HEAD
                <button className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-primary/90 transition-all shrink-0 shadow-sm active:scale-95 disabled:opacity-50" disabled={isSending || !message.trim()} title="Send message" type="submit">
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </form>
=======
                <button className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-primary/90 transition-all shrink-0 shadow-sm active:scale-95" title="Send message">
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </div>
>>>>>>> origin/main

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