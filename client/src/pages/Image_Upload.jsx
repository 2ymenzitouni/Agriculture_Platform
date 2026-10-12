import React from 'react';

export default function Image_Upload() {
  return (
    <div className="w-full">
      



<aside aria-label="Main Navigation" className="fixed top-0 left-0 h-screen w-[68px] z-40 bg-surface-container-lowest dark:bg-inverse-surface border-r border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none fixed top-0 left-0 h-full w-[68px] flex flex-col justify-between items-center py-5">

<div className="flex flex-col items-center gap-1">
<div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-sm" title="AeroSense IoT">
<span className="material-symbols-outlined text-on-primary" >sensors</span>
</div>
<span className="font-label-caps text-label-caps text-primary font-bold tracking-tight text-[9px] uppercase mt-1">v2.4</span>
</div>

<nav className="flex flex-col items-center gap-3">

<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors transition-all duration-200 active:scale-95 group relative" href="#" title="Dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span className="sr-only">Dashboard</span>
</a>

<a aria-current="page" className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface-container dark:bg-primary/20 text-primary dark:text-inverse-primary transition-colors transition-all duration-200 active:scale-95 group relative ring-1 ring-primary/20" href="#" title="Media Analysis">
<span className="material-symbols-outlined" >perm_media</span>
<span className="sr-only">Media Analysis</span>
</a>

<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors transition-all duration-200 active:scale-95 group relative" href="#" title="File Ingestion"><span className="material-symbols-outlined">upload_file</span><span className="sr-only">File Ingestion</span></a><a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors transition-all duration-200 active:scale-95 group relative" href="#" title="Plant Registry &amp; Crop Systems"><span className="material-symbols-outlined">potted_plant</span><span className="sr-only">Plant Registry &amp; Crop Systems</span></a><a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors transition-all duration-200 active:scale-95 group relative" href="#" title="AI Assistant">
<span className="material-symbols-outlined">smart_toy</span>
<span className="sr-only">AI Assistant</span>
</a>

<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors transition-all duration-200 active:scale-95 group relative" href="#" title="Telemetry Simulator">
<span className="material-symbols-outlined">tune</span>
<span className="sr-only">Telemetry Simulator</span>
</a>

<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors transition-all duration-200 active:scale-95 group relative" href="#" title="Devices">
<span className="material-symbols-outlined">sensors</span>
<span className="sr-only">Devices</span>
</a>
</nav>

<div className="flex flex-col items-center gap-2 pt-2 border-t border-outline-variant/30 w-full px-2">
<button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors transition-all duration-200 active:scale-95" title="Settings" type="button">
<span className="material-symbols-outlined">settings</span>
<span className="sr-only">Settings</span>
</button>
<button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-error hover:bg-error-container/40 transition-colors transition-all duration-200 active:scale-95" title="Logout" type="button">
<span className="material-symbols-outlined">logout</span>
<span className="sr-only">Logout</span>
</button>
</div>
</aside>



<header className="sticky top-0 right-0 z-30 ml-[68px] w-[calc(100%-68px)] bg-surface-container-lowest/90 dark:bg-inverse-surface/90 backdrop-blur-md border-b border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none"><div className="flex items-center justify-between px-6 py-3.5 w-full gap-4"><div className="flex items-center gap-2 flex-shrink-0"><span className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface tracking-tight"><span className="block leading-none">AeroSense</span><span className="block text-xs text-on-surface-variant tracking-normal leading-tight mt-0.5 font-bold">Telemetry</span></span></div><div className="flex-1 flex justify-center"><div className="relative w-full max-w-md"><span className="material-symbols-outlined absolute left-3 top-2.5 text-outline pointer-events-none text-base">search</span><input className="w-full bg-surface-container-low text-on-surface placeholder:text-outline pl-9 pr-3 py-1.5 rounded-lg border border-outline-variant/40 text-body-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Search captures, nodes..." type="text" /></div></div><div className="flex items-center gap-3 flex-shrink-0"><button className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors relative" title="Notifications" type="button"><span className="material-symbols-outlined">notifications</span><span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span></button><button className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors shadow-xs" type="button"><span className="material-symbols-outlined text-sm">download</span>Export Data</button><div className="flex items-center pl-1"><div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs ring-2 ring-primary/20">AD</div></div></div></div></header>



<main className="ml-[68px] flex-1 flex flex-col xl:flex-row min-h-[calc(100vh-62px)] bg-surface">

<section className="flex-1 p-6 lg:p-8 flex flex-col gap-6 max-w-[1540px]">

<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
<div>
<div className="flex items-center gap-3">
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Image Upload &amp; Environmental Analysis</h1>
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              Live Pipeline Active
            </span>
</div>
<p className="text-on-surface-variant font-body-md text-body-md mt-1">
            Feed multi-spectral drone imagery, IoT field captures, and ground soil frames into the AeroSense neural inference engine.
          </p>
</div>


</div>



<div className="bg-surface-container-lowest rounded-xl border-2 border-dashed border-outline-variant/60 hover:border-primary transition-all p-5 card-ambient-shadow group relative overflow-hidden">
  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="flex items-center gap-4 text-left">
      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-105 transition-transform ring-1 ring-primary/20">
        <span className="material-symbols-outlined text-2xl" >cloud_upload</span>
      </div>
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="font-headline-md text-headline-md text-on-surface text-base font-bold">Drag and drop environmental captures here</h2>
          <span className="px-2 py-0.5 rounded font-label-caps text-[10px] bg-secondary-fixed text-on-secondary-fixed font-bold uppercase">Multi-Spectral Ready</span>
        </div>
        <p className="text-on-surface-variant font-body-md text-xs mt-0.5">
          Supported: <span className="font-semibold text-on-surface">TIFF, PNG, RAW</span> • Up to 50 MB per capture • Geotagged coordinate ingestion active
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2.5 flex-shrink-0 w-full sm:w-auto justify-end">
      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container transition-all shadow-sm active:scale-95">
        <span className="material-symbols-outlined text-sm">folder_open</span>
        <span className="">Browse Files</span>
        <input accept="image/*,.tiff,.raw" className="hidden" multiple="" type="file" />
      </label>
      <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-on-surface font-label-md text-xs font-semibold hover:bg-surface-container-low transition-colors active:scale-95" type="button">
        <span className="material-symbols-outlined text-secondary text-sm">videocam</span>
        <span className="">Direct Trigger</span>
      </button>
    </div>
  </div>
</div><div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 card-ambient-shadow flex flex-col gap-5">
  
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
    <div className="flex flex-wrap items-center gap-2.5">
      <h2 className="font-headline-md text-headline-md text-on-surface">Plant Detection Results &amp; Annotations</h2>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
        Inference Complete - 3 Annotations Found
      </span>
    </div>
    
    <div className="flex items-center gap-2 flex-wrap">
      <span className="px-2.5 py-1 rounded-lg text-xs font-label-md bg-surface-container-low text-on-surface-variant border border-outline-variant/30 flex items-center gap-1">
        <span className="material-symbols-outlined text-xs text-primary">verified</span> Confidence: &gt;85%
      </span>
      <button type="button" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-label-md bg-surface-container text-primary font-bold hover:bg-surface-container-high transition-colors">
        <span className="material-symbols-outlined text-xs">visibility</span> Show Labels
      </button>
      <button type="button" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-label-md bg-surface-container-low text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container transition-colors">
        <span className="material-symbols-outlined text-xs">layers</span> Heatmap Overlay
      </button>
    </div>
  </div>

  
  <div className="relative rounded-xl overflow-hidden bg-surface-dim border border-outline-variant/40 group max-h-[460px] flex items-center justify-center">
    <img className="w-full h-[440px] object-cover block" data-alt="Macro close-up inspection of plant canopy leaf with leaf spot disease and chlorosis pattern" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZrXjD_LDeOMatVgfxkHNI34HHPc3HHLfiJ_nFSOM6rNH6NFZI0PjsIYsXpYMcKb1vdJWf5JuJVhSlV8r6r3R2LAHBwilwDwUb0kWDDqItruSkd2j_jZxqwBbgoUNuIUCjDRrg0yFEKasTg1u0EER9Ce9ww9DaLpCeb1SLk3Fz5Yt8sSOMhvwj7RTv6pCT0MCwXVbIXJNFLaZE1f4l5o32_9PC2E3XdfPu3zpXThTDRmMAvwO_k-4lxg" />

    
    <div className="absolute top-[28%] left-[22%] w-[26%] h-[34%] border-2 border-error rounded bg-error/10 pointer-events-auto transition-transform hover:scale-[1.02]">
      <div className="absolute -top-6 left-0 bg-error text-on-error px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-tight flex items-center gap-1 shadow-sm whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
        Cercospora Leaf Spot (96.4%)
      </div>
      <span className="absolute bottom-1 right-1 text-[9px] font-mono text-white/90 bg-black/60 px-1 rounded pointer-events-none">[x:220, y:310]</span>
    </div>

    
    <div className="absolute top-[18%] left-[56%] w-[24%] h-[28%] border-2 border-primary-container rounded bg-primary-container/10 pointer-events-auto transition-transform hover:scale-[1.02]">
      <div className="absolute -top-6 left-0 bg-primary-container text-on-primary px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-tight flex items-center gap-1 shadow-sm whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
        Chlorosis Stage 1 (91.2%)
      </div>
      <span className="absolute bottom-1 right-1 text-[9px] font-mono text-white/90 bg-black/60 px-1 rounded pointer-events-none">[x:560, y:180]</span>
    </div>

    
    <div className="absolute bottom-[16%] left-[48%] w-[22%] h-[26%] border-2 border-secondary rounded bg-secondary/10 pointer-events-auto transition-transform hover:scale-[1.02]">
      <div className="absolute -top-6 left-0 bg-secondary text-on-secondary px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-tight flex items-center gap-1 shadow-sm whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
        Stomata Constriction (88.5%)
      </div>
      <span className="absolute bottom-1 right-1 text-[9px] font-mono text-white/90 bg-black/60 px-1 rounded pointer-events-none">[x:480, y:520]</span>
    </div>
  </div>

  
  <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
      
      <div className="flex flex-col gap-1.5 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-on-surface">
            <span className="w-2.5 h-2.5 rounded-full bg-error"></span> Cercospora Spot
          </span>
          <span className="font-mono font-bold text-error">96.4%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
          <div className="h-full bg-error rounded-full" ></div>
        </div>
      </div>
      
      <div className="flex flex-col gap-1.5 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-on-surface">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span> Chlorosis Stage 1
          </span>
          <span className="font-mono font-bold text-primary">91.2%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
          <div className="h-full bg-primary-container rounded-full" ></div>
        </div>
      </div>
      
      <div className="flex flex-col gap-1.5 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-on-surface">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Stomata Constriction
          </span>
          <span className="font-mono font-bold text-secondary">88.5%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
          <div className="h-full bg-secondary rounded-full" ></div>
        </div>
      </div>
    </div>

    
    
  </div>
</div>


</section>

<aside aria-label="Metadata Inspection Panel" className="w-full xl:w-[380px] bg-surface-container-lowest border-t xl:border-t-0 xl:border-l border-outline-variant/40 p-6 flex flex-col justify-between gap-6 card-ambient-shadow">
<div className="flex flex-col gap-6">

<div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">analytics</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Telemetry Metadata</h2>
</div>
<span className="px-2 py-0.5 rounded font-label-caps text-label-caps bg-surface-container text-primary font-bold">FRAME #084</span>
</div>

<div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center gap-3">
<div className="w-12 h-12 rounded-lg bg-surface-dim overflow-hidden flex-shrink-0">
<img className="w-full h-full object-cover" data-alt="Macro close-up crop of plant leaf showing chlorophyll veins and fungal chlorosis spots in high dynamic range natural light with sharp edges and saturated natural green tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZrXjD_LDeOMatVgfxkHNI34HHPc3HHLfiJ_nFSOM6rNH6NFZI0PjsIYsXpYMcKb1vdJWf5JuJVhSlV8r6r3R2LAHBwilwDwUb0kWDDqItruSkd2j_jZxqwBbgoUNuIUCjDRrg0yFEKasTg1u0EER9Ce9ww9DaLpCeb1SLk3Fz5Yt8sSOMhvwj7RTv6pCT0MCwXVbIXJNFLaZE1f4l5o32_9PC2E3XdfPu3zpXThTDRmMAvwO_k-4lxg" />
</div>
<div className="min-w-0 flex-1">
<div className="font-label-md text-label-md font-bold text-on-surface truncate">Canopy Leaf Phenotype #084.tiff</div>
<div className="text-[11px] text-outline">Uploaded via IoT Edge Gateway</div>
</div>
<span className="material-symbols-outlined text-tertiary">check_circle</span>
</div>

<div>
<h3 className="font-label-caps text-label-caps text-outline uppercase tracking-wider mb-3">Hardware &amp; EXIF Telemetry</h3>
<dl className="space-y-2.5">

<div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-surface border border-outline-variant/20">
<dt className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
<span className="material-symbols-outlined text-sm text-outline">description</span>
                File Size
              </dt>
<dd className="font-mono text-xs font-semibold text-on-surface">18.42 MB</dd>
</div>

<div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-surface border border-outline-variant/20">
<dt className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
<span className="material-symbols-outlined text-sm text-outline">aspect_ratio</span>
                Resolution
              </dt>
<dd className="font-mono text-xs font-semibold text-on-surface">4096 × 3072 px</dd>
</div>



<div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-surface border border-outline-variant/20">
<dt className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
<span className="material-symbols-outlined text-sm text-outline">location_on</span>
                GPS Coordinates
              </dt>
<dd className="font-mono text-xs font-semibold text-on-surface text-right">37.7749° N, 122.4194° W</dd>
</div>




</dl>
</div>



<div>
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider block mb-2">Detected Classes</span>
<div className="flex flex-wrap gap-1.5">
<span className="px-2 py-1 rounded bg-error-container text-on-error-container text-xs font-semibold">Cercospora Leaf Spot</span>
<span className="px-2 py-1 rounded bg-surface-container text-primary text-xs font-semibold">Chlorosis Stage 1</span>
<span className="px-2 py-1 rounded bg-surface-container-highest text-on-surface-variant text-xs font-semibold">Stomata Constriction</span>
</div><button className="w-full mt-3 py-2.5 px-4 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-bold hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-sm" type="button"><span className="material-symbols-outlined text-base">psychology</span>Run Model Detection</button>
</div>
</div>

<div className="pt-4 border-t border-outline-variant/30 flex flex-col gap-2.5">


</div>
</aside>
</main>





    </div>
  );
}
