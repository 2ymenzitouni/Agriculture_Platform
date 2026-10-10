import React from 'react';

export default function Knowledge_Base() {
  return (
    <div className="w-full">
      

<aside className="fixed top-0 left-0 h-screen w-[68px] z-40 bg-surface-container-lowest dark:bg-inverse-surface border-r border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none flex flex-col justify-between items-center py-5">

<div className="flex flex-col items-center gap-1">
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
<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-error hover:bg-error-container/20 transition-all duration-200 active:scale-95 group relative" href="#" title="Logout">
<span className="material-symbols-outlined text-[20px]">logout</span>
<span className="absolute left-[72px] bg-inverse-surface text-inverse-on-surface text-[11px] font-medium px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Logout</span>
</a>
</div>
</aside>

<div className="flex-1 flex flex-col min-h-screen pl-[68px]">

<header className="sticky top-0 z-30 w-full bg-surface-container-lowest/90 dark:bg-inverse-surface/90 backdrop-blur-md border-b border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none flex justify-between items-center px-6 py-3.5">

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
</header>

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
<span className="font-label-md text-label-md font-bold text-tertiary">Vector DB Synced</span>
</div>
</div>
</div>
</section>

<section className="grid grid-cols-1 sm:grid-cols-2 gap-4">

<div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30 shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_4px_12px_0_rgba(37,99,235,0.03)] flex items-center justify-between">
<div className="space-y-1">
<div className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Total Documents Indexed</div>
<div className="text-display-metric font-display-metric text-on-surface font-extrabold tracking-tight">1,428</div>
<div className="flex items-center gap-1 text-[12px] text-tertiary font-medium">
<span className="material-symbols-outlined text-[14px]">trending_up</span>
<span className="">+34 files ingested today</span>
</div>
</div>
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[24px]">description</span>
</div>
</div>





<div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30 shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_4px_12px_0_rgba(37,99,235,0.03)] flex items-center justify-between">
<div className="space-y-1">
<div className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Average Query Latency</div>
<div className="text-display-metric font-display-metric text-on-surface font-extrabold tracking-tight">18 ms</div>
<div className="flex items-center gap-1 text-[12px] text-tertiary font-medium">
<span className="material-symbols-outlined text-[14px]">bolt</span>
<span className="">HNSW Cosine Top-K = 5</span>
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

<div className="border-2 border-dashed border-primary/30 hover:border-primary bg-surface-container-low/40 hover:bg-surface-container-low/80 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer group">
<div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:scale-105 transition-transform mb-3 shadow-sm ring-4 ring-primary/5">
<span className="material-symbols-outlined text-[32px]">cloud_upload</span>
</div>
<h3 className="font-headline-md text-[16px] text-on-surface font-semibold mb-1">
                Drag and drop your engineering files here, or <span className="text-primary hover:underline">browse files</span>
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
<button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-low text-label-md font-label-md text-on-surface transition-all">
<span className="material-symbols-outlined text-[16px]">refresh</span>
<span className="">Sync Status</span>
</button>
<button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-label-md font-label-md transition-all">
<span className="material-symbols-outlined text-[16px]">play_circle</span>
<span className="">Process All Pending (3)</span>
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

<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="py-4 px-6">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-lg bg-secondary-fixed/50 text-secondary flex items-center justify-center font-bold">
<span className="material-symbols-outlined text-[20px]">description</span>
</div>
<div>
<div className="font-bold text-on-surface hover:text-primary cursor-pointer">Turbine_Blade_Vibration_Manual_Rev3.pdf</div>
<div className="text-[11px] text-outline">Uploaded by Admin • SHA256: 7a9f...b012</div>
</div>
</div>
</td>
<td className="py-4 px-4 font-mono text-[13px]">14.2 MB</td>
<td className="py-4 px-4 font-mono text-[13px] font-semibold text-secondary">312 / 370</td>
<td className="py-4 px-4 font-mono text-[13px]">1536 dims</td>
<td className="py-4 px-4 font-mono text-[13px] text-outline">1.42s elapsed</td>
<td className="py-4 px-4">
<div className="flex flex-col gap-1.5 w-44">
<div className="flex items-center justify-between text-[11px] font-semibold text-secondary">
<span className="">Chunking &amp; Vectorizing</span>
<span className="">84%</span>
</div>
<div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div className="bg-secondary-container h-full rounded-full transition-all duration-300" ></div>
</div>
</div>
</td>
<td className="py-4 px-6 text-right space-x-1">
<button className="p-1.5 hover:bg-surface-container rounded text-outline hover:text-on-surface" title="Inspect Chunks">
<span className="material-symbols-outlined text-[18px]">find_in_page</span>
</button>
<button className="p-1.5 hover:bg-error-container/30 rounded text-outline hover:text-error" title="Cancel Ingestion">
<span className="material-symbols-outlined text-[18px]">cancel</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="py-4 px-6">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-lg bg-tertiary-fixed/40 text-tertiary flex items-center justify-center font-bold">
<span className="material-symbols-outlined text-[20px]">analytics</span>
</div>
<div>
<div className="font-bold text-on-surface hover:text-primary cursor-pointer">Flight_Sensor_Telemetry_Stream_2024Q3.csv</div>
<div className="text-[11px] text-outline">Uploaded by Telemetry Node #4 • SHA256: 41ec...f89a</div>
</div>
</div>
</td>
<td className="py-4 px-4 font-mono text-[13px]">48.7 MB</td>
<td className="py-4 px-4 font-mono text-[13px] font-semibold text-tertiary">1,840 chunks</td>
<td className="py-4 px-4 font-mono text-[13px]">1536 dims</td>
<td className="py-4 px-4 font-mono text-[13px] text-tertiary font-medium">4.88s</td>
<td className="py-4 px-4">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-tertiary-fixed/40 text-tertiary border border-tertiary/20">
<span className="material-symbols-outlined text-[13px]" >check_circle</span>
<span className="">Vectorized &amp; Indexed</span>
</span>
</td>
<td className="py-4 px-6 text-right space-x-1">
<button className="p-1.5 hover:bg-surface-container rounded text-outline hover:text-primary" title="Re-index">
<span className="material-symbols-outlined text-[18px]">refresh</span>
</button>
<button className="p-1.5 hover:bg-surface-container rounded text-outline hover:text-on-surface" title="Inspect Chunks">
<span className="material-symbols-outlined text-[18px]">find_in_page</span>
</button>
<button className="p-1.5 hover:bg-error-container/30 rounded text-outline hover:text-error" title="Delete">
<span className="material-symbols-outlined text-[18px]">delete</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="py-4 px-6">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-lg bg-surface-container text-primary flex items-center justify-center font-bold">
<span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
</div>
<div>
<div className="font-bold text-on-surface hover:text-primary cursor-pointer">AeroCore_Firmware_Protocol_v5.pdf</div>
<div className="text-[11px] text-outline">Uploaded by DevSecOps • SHA256: e871...11cb</div>
</div>
</div>
</td>
<td className="py-4 px-4 font-mono text-[13px]">8.1 MB</td>
<td className="py-4 px-4 font-mono text-[13px] text-outline">Extracting...</td>
<td className="py-4 px-4 font-mono text-[13px]">1536 dims</td>
<td className="py-4 px-4 font-mono text-[13px] text-outline">0.40s elapsed</td>
<td className="py-4 px-4">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-surface-container text-primary border border-surface-variant animate-pulse">
<span className="material-symbols-outlined text-[13px]">sync</span>
<span className="">Parsing PDF &amp; OCR</span>
</span>
</td>
<td className="py-4 px-6 text-right space-x-1">
<button className="p-1.5 text-outline/40 cursor-not-allowed" disabled="" title="Inspect Chunks">
<span className="material-symbols-outlined text-[18px]">find_in_page</span>
</button>
<button className="p-1.5 hover:bg-error-container/30 rounded text-outline hover:text-error" title="Cancel">
<span className="material-symbols-outlined text-[18px]">cancel</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="py-4 px-6">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-lg bg-error-container/40 text-error flex items-center justify-center font-bold">
<span className="material-symbols-outlined text-[20px]">code</span>
</div>
<div>
<div className="font-bold text-on-surface hover:text-primary cursor-pointer">Avionics_Telemetry_Schema_Raw.json</div>
<div className="text-[11px] text-error font-medium">Syntax error: Unterminated string at line 1402</div>
</div>
</div>
</td>
<td className="py-4 px-4 font-mono text-[13px]">3.4 MB</td>
<td className="py-4 px-4 font-mono text-[13px] text-outline">0 chunks</td>
<td className="py-4 px-4 font-mono text-[13px]">--</td>
<td className="py-4 px-4 font-mono text-[13px] text-outline">0.12s</td>
<td className="py-4 px-4">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-error-container text-on-error-container border border-error/20">
<span className="material-symbols-outlined text-[13px]">error</span>
<span className="">Failed / Retrying (1/3)</span>
</span>
</td>
<td className="py-4 px-6 text-right space-x-1">
<button className="p-1.5 hover:bg-surface-container rounded text-error hover:text-on-surface" title="Retry Ingestion">
<span className="material-symbols-outlined text-[18px]">replay</span>
</button>
<button className="p-1.5 hover:bg-error-container/30 rounded text-outline hover:text-error" title="Delete file">
<span className="material-symbols-outlined text-[18px]">delete</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>

<div className="p-4 bg-surface-container-low/30 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-label-md font-label-md text-on-surface-variant">
<div className="text-[12px]">
            Showing <span className="font-bold text-on-surface">4</span> of <span className="font-bold text-on-surface">24</span> active and historical batch ingestion jobs
          </div>
<div className="flex items-center gap-1">
<button className="px-2.5 py-1 rounded border border-outline-variant/30 hover:bg-surface-container-low text-[12px] disabled:opacity-50" disabled="">Previous</button>
<button className="px-2.5 py-1 rounded bg-primary text-on-primary font-bold text-[12px]">1</button>
<button className="px-2.5 py-1 rounded hover:bg-surface-container-low text-[12px]">2</button>
<button className="px-2.5 py-1 rounded hover:bg-surface-container-low text-[12px]">3</button>
<button className="px-2.5 py-1 rounded border border-outline-variant/30 hover:bg-surface-container-low text-[12px]">Next</button>
</div>
</div>
</section>


</main>
</div>



    </div>
  );
}
