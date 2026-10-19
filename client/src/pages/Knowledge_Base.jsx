import { useCallback, useEffect, useRef, useState } from 'react';
import LogoutButton from '../components/LogoutButton';
import API from '../services/app';

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const SUPPORTED_EXTENSIONS = new Set(['pdf', 'json', 'csv', 'txt', 'md', 'xml']);

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  return typeof detail === 'string' ? detail : fallback;
};

const formatFileSize = (size) => {
  if (size == null) return '--';
  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  return `${(size / (1024 ** unitIndex)).toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

export default function Knowledge_Base() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingDocumentId, setDeletingDocumentId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const fileInputRef = useRef(null);

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await API.get('/documents/mine');
      setDocuments(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to load your documents.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    API.get('/documents/mine')
      .then(({ data }) => {
        if (isMounted) setDocuments(data);
      })
      .catch((requestError) => {
        if (isMounted) setError(getErrorMessage(requestError, 'Unable to load your documents.'));
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpload = async (file) => {
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !SUPPORTED_EXTENSIONS.has(extension)) {
      setError('Choose a PDF, JSON, CSV, TXT, Markdown, or XML file.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('The selected file exceeds the 100 MB upload limit.');
      return;
    }

    setError('');
    setNotice('');
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await API.post('/documents/upload-ai', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setNotice(`${file.name} was processed and added to your knowledge base.`);
      await loadDocuments();
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Document upload failed. Please try again.'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event) => {
    handleUpload(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleUpload(event.dataTransfer.files?.[0]);
  };

  const handleDelete = async (document) => {
    if (!window.confirm(`Delete "${document.filename}" from your knowledge base?`)) return;
    setError('');
    setDeletingDocumentId(document.id);
    try {
      await API.delete(`/documents/${document.id}`);
      setDocuments((currentDocuments) => currentDocuments.filter((item) => item.id !== document.id));
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to delete this document.'));
    } finally {
      setDeletingDocumentId(null);
    }
  };

  return (
    <div className="w-full">
      

<aside className="fixed top-0 left-0 h-screen w-[68px] z-40 bg-surface-container-lowest dark:bg-inverse-surface border-r border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none flex flex-col justify-between items-center py-5">

<div className="invisible flex flex-col items-center gap-1">
<div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
<span className="material-symbols-outlined text-[24px]">sensors</span>
</div>
<span className="text-[9px] font-bold text-primary tracking-tighter uppercase mt-0.5">AeroSense</span>
</div>

<nav className="flex flex-col items-center gap-3">
<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95 group relative" href="#" title="Dashboard">
<span className="material-symbols-outlined text-[22px]">dashboard</span>
<span className="absolute left-[72px] bg-inverse-surface text-inverse-on-surface text-[11px] font-medium px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Dashboard</span>
</a>

<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95 group relative" href="#" title="Media Analysis">
<span className="material-symbols-outlined text-[22px]">perm_media</span>
<span className="absolute left-[72px] bg-inverse-surface text-inverse-on-surface text-[11px] font-medium px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Media Analysis</span>
</a>

<a className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface-container dark:bg-primary/20 text-primary dark:text-inverse-primary transition-all duration-200 active:scale-95 group relative ring-1 ring-primary/20 shadow-sm" href="#" title="File Ingestion">
<span className="material-symbols-outlined text-[22px]" >upload_file</span>
<span className="absolute left-[72px] bg-inverse-surface text-inverse-on-surface text-[11px] font-medium px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">File Ingestion</span>
</a><a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95 group relative" href="#" title="Plant Registry &amp; Crop Systems"><span className="material-symbols-outlined text-[22px]">potted_plant</span><span className="absolute left-[72px] bg-inverse-surface text-inverse-on-surface text-[11px] font-medium px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Plant Registry &amp; Crop Systems</span></a>

<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95 group relative" href="#" title="AI Assistant">
<span className="material-symbols-outlined text-[22px]">smart_toy</span>
<span className="absolute left-[72px] bg-inverse-surface text-inverse-on-surface text-[11px] font-medium px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">AI Assistant</span>
</a>

<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95 group relative" href="#" title="Telemetry Simulator">
<span className="material-symbols-outlined text-[22px]">tune</span>
<span className="absolute left-[72px] bg-inverse-surface text-inverse-on-surface text-[11px] font-medium px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Telemetry Simulator</span>
</a>

<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95 group relative" href="#" title="Devices">
<span className="material-symbols-outlined text-[22px]">sensors</span>
<span className="absolute left-[72px] bg-inverse-surface text-inverse-on-surface text-[11px] font-medium px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Devices</span>
</a></nav>

<div className="flex flex-col items-center gap-3">
<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95 group relative" href="#" title="Settings">
<span className="material-symbols-outlined text-[20px]">settings</span>
<span className="absolute left-[72px] bg-inverse-surface text-inverse-on-surface text-[11px] font-medium px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Settings</span>
</a>
<LogoutButton className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-error hover:bg-error-container/20 transition-all duration-200 active:scale-95 group relative" title="Logout" aria-label="Logout">
<span className="material-symbols-outlined text-[20px]">logout</span>
<span className="absolute left-[72px] bg-inverse-surface text-inverse-on-surface text-[11px] font-medium px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Logout</span>
</LogoutButton>
</div>
</aside>

<div className="flex-1 flex flex-col min-h-screen pl-[68px]">

{/* <header className="sticky top-0 z-30 w-full bg-surface-container-lowest/90 dark:bg-inverse-surface/90 backdrop-blur-md border-b border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none flex justify-between items-center px-6 py-3.5">

<div className="flex items-center gap-6 flex-1 max-w-2xl">
<div className="flex items-center gap-2">
<div className="flex flex-col leading-tight"><span className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">AeroSense</span><span className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">Telemetry</span></div>

</div>

<div className="relative w-full max-w-md hidden md:block">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
<input className="w-full bg-surface-container-low/70 border border-outline-variant/40 rounded-xl pl-9 pr-4 py-1.5 text-body-md font-body-md text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" placeholder="Search vector chunks, documents, embeddings, or metadata tags..." type="text" />
<span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-outline bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/30">⌘K</span>
</div>
</div>

<div className="hidden xl:flex items-center gap-6">
<a className="font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface font-medium transition-colors" href="#">Live Feeds</a>
<a className="font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface font-medium transition-colors" href="#">Sensors</a>
<a className="font-label-caps text-label-caps text-primary dark:text-inverse-primary font-bold border-b-2 border-primary dark:border-inverse-primary pb-1" href="#">Analytics</a>
<a className="font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface font-medium transition-colors" href="#">Diagnostics</a>
</div>

<div className="flex items-center gap-3">


<button className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-all duration-150 active:scale-95 relative" title="Notifications">
<span className="material-symbols-outlined text-[20px]">notifications</span>
<span className="w-2 h-2 rounded-full bg-primary absolute top-1.5 right-1.5 ring-2 ring-surface-container-lowest"></span>
</button>

<button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface text-label-md font-label-md transition-all duration-150 active:scale-95 shadow-sm">
<span className="material-symbols-outlined text-[16px]">file_download</span>
<span className="">Export Data</span>
</button>



<div className="flex items-center gap-2 pl-2 border-l border-outline-variant/30 ml-1">
<div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs ring-2 ring-primary/20 cursor-pointer">
            AD
          </div>
</div>
</div>
</header> */}

<main className="p-6 lg:p-8 space-y-6 flex-1 max-w-[1680px] w-full mx-auto">

<section className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_4px_12px_0_rgba(37,99,235,0.03)]">
<div className="space-y-1.5 max-w-4xl">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[24px]">database</span>
<span className="text-label-caps font-label-caps text-primary tracking-wider uppercase">Vector Pipeline &amp; RAG Knowledge Base</span>
</div>
<h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
            Knowledge Base &amp; Embeddings
          </h1>
<p className="font-body-md text-body-md text-on-surface-variant max-w-3xl leading-relaxed">
            Ingest unstructured IoT manuals, sensor logs, telemetry specs, and inspection reports into high-dimensional vector embeddings for AI RAG assistant query retrieval.
          </p>
</div>

<div className="flex flex-wrap items-center gap-3 bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant/20 self-start xl:self-center">

<div className="flex items-center gap-2 pl-1">
<span className="relative flex h-2.5 w-2.5">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary-container"></span>
</span>
<div className="text-right">
<div className="text-[10px] text-outline uppercase font-semibold">Status</div>
<span className="font-label-md text-label-md font-bold text-tertiary">
  {isLoading ? 'Syncing...' : error ? 'Sync Error' : 'Vector DB Synced'}
</span>
</div>
</div>
</div>
</section>

<section className="grid grid-cols-1 sm:grid-cols-2 gap-4">

<div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30 shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_4px_12px_0_rgba(37,99,235,0.03)] flex items-center justify-between">
<div className="space-y-1">
<div className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Total Documents Indexed</div>
<div className="text-display-metric font-display-metric text-on-surface font-extrabold tracking-tight">{documents.length.toLocaleString()}</div>
<div className="flex items-center gap-1 text-[12px] text-tertiary font-medium">
<span className="material-symbols-outlined text-[14px]">trending_up</span>
<span className="">Documents in your knowledge base</span>
</div>
</div>
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[24px]">description</span>
</div>
</div>





<div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30 shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_4px_12px_0_rgba(37,99,235,0.03)] flex items-center justify-between">
<div className="space-y-1">
<div className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Average Query Latency</div>
<div className="text-display-metric font-display-metric text-on-surface font-extrabold tracking-tight">--</div>
<div className="flex items-center gap-1 text-[12px] text-tertiary font-medium">
<span className="material-symbols-outlined text-[14px]">bolt</span>
<span className="">Query metrics unavailable</span>
</div>
</div>
<div className="w-12 h-12 rounded-xl bg-tertiary-container/10 flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined text-[24px]">speed</span>
</div>
</div>
</section>

<section className="grid grid-cols-1 gap-6">

<div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_4px_12px_0_rgba(37,99,235,0.03)] flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">upload_file</span>
<h2 className="font-headline-md text-headline-md text-on-surface font-bold">Document &amp; Telemetry Ingestion</h2>
</div>
<span className="text-label-sm font-label-sm bg-surface-container-low text-primary px-2.5 py-1 rounded-full font-semibold border border-surface-variant">Batch Limit: 100MB</span>
</div>

<div
  className="border-2 border-dashed border-primary/30 hover:border-primary bg-surface-container-low/40 hover:bg-surface-container-low/80 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer group"
  onClick={() => fileInputRef.current?.click()}
  onDragOver={(event) => event.preventDefault()}
  onDrop={handleDrop}
  role="button"
  tabIndex={0}
  onKeyDown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInputRef.current?.click();
    }
  }}
>
<input
  ref={fileInputRef}
  accept=".pdf,.json,.csv,.txt,.md,.xml"
  className="hidden"
  onChange={handleFileChange}
  onClick={(event) => event.stopPropagation()}
  type="file"
/>
<div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:scale-105 transition-transform mb-3 shadow-sm ring-4 ring-primary/5">
<span className="material-symbols-outlined text-[32px]">{isUploading ? 'sync' : 'cloud_upload'}</span>
</div>
<h3 className="font-headline-md text-[16px] text-on-surface font-semibold mb-1">
                {isUploading ? 'Processing document...' : <>Drag and drop your engineering files here, or <span className="text-primary hover:underline">browse files</span></>}
</h3>
<p className="font-body-md text-[13px] text-on-surface-variant max-w-md mb-4">
                Structured sensor CSVs, flight manuals (PDF), JSON packet traces, technical incident logs (TXT/Markdown), and firmware specs (XML).
              </p>

<div className="flex flex-wrap items-center justify-center gap-2">
<span className="px-2.5 py-1 bg-surface-container-lowest rounded-md text-[11px] font-bold text-on-surface border border-outline-variant/30">.PDF</span>
<span className="px-2.5 py-1 bg-surface-container-lowest rounded-md text-[11px] font-bold text-on-surface border border-outline-variant/30">.JSON</span>
<span className="px-2.5 py-1 bg-surface-container-lowest rounded-md text-[11px] font-bold text-on-surface border border-outline-variant/30">.CSV</span>
<span className="px-2.5 py-1 bg-surface-container-lowest rounded-md text-[11px] font-bold text-on-surface border border-outline-variant/30">.TXT</span>
<span className="px-2.5 py-1 bg-surface-container-lowest rounded-md text-[11px] font-bold text-on-surface border border-outline-variant/30">.MD</span>
<span className="px-2.5 py-1 bg-surface-container-lowest rounded-md text-[11px] font-bold text-on-surface border border-outline-variant/30">.XML</span>
</div>
{error && <p className="mt-3 text-sm text-error" role="alert">{error}</p>}
{notice && <p className="mt-3 text-sm text-tertiary" role="status">{notice}</p>}
</div>
</div>

<div className="flex items-center justify-between pt-4 mt-4 border-t border-outline-variant/20 text-body-md text-on-surface-variant text-[12px]">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-tertiary">verified</span>
<span className="">Automatic Optical Character Recognition (OCR) enabled for schematics</span>
</div>
<button className="text-primary font-semibold hover:underline flex items-center gap-1">
<span className="">View Ingestion Rules</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>


</section>

<section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_4px_12px_0_rgba(37,99,235,0.03)] overflow-hidden">

<div className="p-6 border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[22px]">queue</span>
<h2 className="font-headline-md text-headline-md text-on-surface font-bold">Active Processing &amp; Ingestion Queue</h2>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Real-time status of document parsing, chunk generation, and vector index persistence.</p>
</div>
<div className="flex items-center gap-3">
<button onClick={loadDocuments} disabled={isLoading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-low text-label-md font-label-md text-on-surface transition-all disabled:opacity-50">
<span className="material-symbols-outlined text-[16px]">refresh</span>
<span className="">{isLoading ? 'Syncing...' : 'Sync Status'}</span>
</button>
<button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-label-md font-label-md transition-all disabled:opacity-50">
<span className="material-symbols-outlined text-[16px]">play_circle</span>
<span className="">{isUploading ? 'Processing...' : 'Upload Document'}</span>
</button>
</div>
</div>

<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low/50 border-b border-outline-variant/30 text-label-caps font-label-caps text-outline uppercase">
<th className="py-3 px-6">File Name</th>
<th className="py-3 px-4">Size</th>
<th className="py-3 px-4">Detected Chunks</th>
<th className="py-3 px-4">Vector Dims</th>
<th className="py-3 px-4">Embedding Time</th>
<th className="py-3 px-4">Status</th>
<th className="py-3 px-6 text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/20 text-body-md font-body-md text-on-surface">
{isLoading ? (
  <tr><td className="px-6 py-8 text-center text-on-surface-variant" colSpan="7">Loading documents...</td></tr>
) : documents.length === 0 ? (
  <tr><td className="px-6 py-8 text-center text-on-surface-variant" colSpan="7">No documents uploaded yet.</td></tr>
) : documents.map((document) => (
  <tr className="hover:bg-surface-container-low/30 transition-colors" key={document.id}>
    <td className="py-4 px-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-surface-container text-primary flex items-center justify-center font-bold">
          <span className="material-symbols-outlined text-[20px]">{document.file_type === 'csv' ? 'analytics' : document.file_type === 'json' ? 'code' : 'description'}</span>
        </div>
        <div>
          <div className="font-bold text-on-surface">{document.filename}</div>
          <div className="text-[11px] text-outline">Uploaded {new Date(document.created_at).toLocaleString()}</div>
        </div>
      </div>
    </td>
    <td className="py-4 px-4 font-mono text-[13px]">{formatFileSize(document.file_size)}</td>
    <td className="py-4 px-4 font-mono text-[13px] font-semibold text-secondary">{document.chunk_count ?? '--'} chunks</td>
    <td className="py-4 px-4 font-mono text-[13px]">768 dims</td>
    <td className="py-4 px-4 font-mono text-[13px] text-outline">--</td>
    <td className="py-4 px-4">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-tertiary-fixed/40 text-tertiary border border-tertiary/20">
        <span className="material-symbols-outlined text-[13px]">check_circle</span>
        <span>Vectorized &amp; Indexed</span>
      </span>
    </td>
    <td className="py-4 px-6 text-right space-x-1">
      <button
        className="p-1.5 hover:bg-error-container/30 rounded text-outline hover:text-error disabled:opacity-50"
        disabled={deletingDocumentId === document.id}
        onClick={() => handleDelete(document)}
        title="Delete"
      >
        <span className="material-symbols-outlined text-[18px]">{deletingDocumentId === document.id ? 'hourglass_top' : 'delete'}</span>
      </button>
    </td>
  </tr>
))}
</tbody>
</table>
</div>

<div className="p-4 bg-surface-container-low/30 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-label-md font-label-md text-on-surface-variant">
<div className="text-[12px]">
            Showing <span className="font-bold text-on-surface">{documents.length}</span> documents in your knowledge base
          </div>
          <span className="text-[12px]">{isLoading ? 'Syncing with backend...' : 'All documents loaded'}</span>
</div>
</section>


</main>
</div>



    </div>
  );
}
