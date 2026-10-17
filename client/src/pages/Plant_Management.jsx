import LogoutButton from '../components/LogoutButton';

export default function Plant_Management() {
  return (
    <div className="w-full">
      

<aside className="fixed top-0 left-0 h-screen w-[68px] z-40 bg-surface-container-lowest border-r border-outline-variant/30 shadow-sm flex flex-col justify-between items-center py-5">

<div className="flex flex-col items-center gap-1 group cursor-pointer" title="AeroSense IoT - Telemetry v2.4">
<div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-headline-md font-bold shadow-md shadow-primary/20 transition-all duration-200 active:scale-95">
<span className="material-symbols-outlined text-[22px]">eco</span>
</div>
<span className="font-label-caps text-[9px] uppercase tracking-wider text-primary font-bold">Aero</span>
</div>

<nav aria-label="System Navigation" className="flex flex-col items-center gap-2.5 w-full px-2">
<button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors duration-200 active:scale-95" title="Dashboard" type="button">
<span className="material-symbols-outlined">dashboard</span>
</button>
<button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors duration-200 active:scale-95" title="Media Analysis" type="button">
<span className="material-symbols-outlined">perm_media</span>
</button><button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors duration-200 active:scale-95 relative" title="File Ingestion" type="button"><span className="material-symbols-outlined">upload_file</span></button>

<button aria-current="page" className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface-container text-primary transition-colors duration-200 active:scale-95 relative" title="Plant Registry &amp; Crop Systems" type="button">
<span className="material-symbols-outlined font-bold" >potted_plant</span>
<span className="absolute right-1 top-1.5 w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-surface-container-lowest"></span>
</button>
<button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors duration-200 active:scale-95" title="AI Assistant" type="button">
<span className="material-symbols-outlined">smart_toy</span>
</button>
<button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors duration-200 active:scale-95" title="Telemetry Simulator" type="button">
<span className="material-symbols-outlined">tune</span>
</button>
<button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors duration-200 active:scale-95" title="Devices" type="button">
<span className="material-symbols-outlined">sensors</span>
</button>
</nav>

<div className="flex flex-col items-center gap-2 w-full px-2">
<button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors duration-200 active:scale-95" title="Settings" type="button">
<span className="material-symbols-outlined">settings</span>
</button>
<LogoutButton className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-error hover:bg-error-container/20 transition-colors duration-200 active:scale-95" title="Logout" aria-label="Logout">
<span className="material-symbols-outlined">logout</span>
</LogoutButton>
</div>
</aside>

<div className="ml-[68px] flex-1 flex flex-col min-h-screen">

<header className="sticky top-0 z-30 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 px-8 py-3.5 flex items-center justify-between shadow-sm">

<div className="flex items-center gap-3">
<div className="flex flex-col">
<span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface leading-none">AeroSense</span>
<span className="font-label-caps text-label-caps text-primary tracking-widest leading-tight uppercase font-bold">Telemetry</span>
</div>
<div className="h-6 w-px bg-outline-variant/40 ml-2 hidden sm:block"></div>
<span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-md text-label-md">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
          Bio-Grid Online
        </span>
</div>

<div className="flex-1 max-w-lg mx-6">
<div className="relative flex items-center w-full">
<span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px]">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-surface text-on-surface placeholder:text-outline text-body-md rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all duration-150" placeholder="Search plants, batches, crops, sensors..." type="search" />
<div className="absolute right-3 flex items-center gap-1">
<kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-label-caps bg-surface-container text-on-surface-variant rounded border border-outline-variant/40">⌘K</kbd>
</div>
</div>
</div>

<div className="flex items-center gap-3.5">
<button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors relative" title="Notifications" type="button">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest"></span>
</button>

<button className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container-low text-on-surface font-label-md text-label-md rounded-lg transition-all duration-150 active:scale-95 shadow-sm" type="button">
<span className="material-symbols-outlined text-[16px] text-outline">download</span>
          Export Data
        </button>

<div className="flex items-center gap-2 pl-2 border-l border-outline-variant/40 cursor-pointer">
<div className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-headline-md text-label-md flex items-center justify-center font-bold ring-2 ring-primary/20">
            AD
          </div>
<div className="hidden xl:flex flex-col text-left">
<span className="font-label-md text-label-md text-on-surface leading-tight font-bold">Admin Lead</span>
<span className="font-label-sm text-label-sm text-outline leading-tight">Zone A-4 Controller</span>
</div>
</div>
</div>
</header>

<main className="flex-1 p-8 max-w-[1600px] w-full mx-auto space-y-8">

<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
<div>
<div className="flex items-center gap-2 text-outline font-label-md text-label-md mb-1.5">
<span className="">AeroSense IoT</span>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="">Agriculture Grid</span>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="text-primary font-semibold">Plant Registry</span>
</div>
<h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Plant Registry &amp; Monitoring</h1>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Register new botanical batches, set tracking telemetry, and configure autonomous sensor associations.</p>
</div>
<div className="flex items-center gap-3">
<div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3.5 py-2 shadow-sm">
<span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
<span className="font-label-md text-label-md text-on-surface font-medium">9 Active Batches</span>
<span className="text-outline text-label-sm">•</span>
<span className="font-label-md text-label-md text-outline">4 Sensor Pods Linked</span>
</div>
</div>
</div>

<div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

<div className="xl:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant/40 custom-shadow-card p-6 sm:p-8 space-y-7">
<div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined">add_chart</span>
</div>
<div>
<h2 className="font-headline-md text-headline-md font-bold text-on-surface">Add New Plant or Batch</h2>
<p className="font-label-md text-label-md text-outline">Complete core parameters for automated hydroponic cycle calibration.</p>
</div>
</div>
<span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
              Telemetry Profile: Hydro-V3
            </span>
</div>
<form className="space-y-6" id="plant-registry-form">

<div className="space-y-2">
<div className="flex justify-between items-center">
<label className="font-label-md text-label-md font-semibold text-on-surface" htmlFor="plant-name">Plant / Batch Identifier</label>
<span className="font-label-sm text-label-sm text-outline">Required</span>
</div>
<div className="relative">
<span className="material-symbols-outlined absolute left-3.5 top-3 text-outline text-[18px]">tag</span>
<input className="w-full pl-10 pr-4 py-2.5 bg-surface text-on-surface text-body-md font-medium rounded-lg border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none" id="plant-name" placeholder="e.g. Hydro Tower Beta - Batch #14" required="" type="text" value="Hydro Tower Beta - Batch #14" />
</div>
<p className="font-label-sm text-label-sm text-outline">Assign a distinct ID or rack slot tag for telemetry data correlation.</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-5">

<div className="space-y-2">
<label className="font-label-md text-label-md font-semibold text-on-surface">Crop Type</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3.5 top-3 text-outline text-[18px]">psychiatry</span>
<select className="w-full pl-10 pr-10 py-2.5 bg-surface text-on-surface text-body-md font-medium rounded-lg border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none appearance-none" id="crop-type">
<option selected="" value="Tomato">Tomato (Solanum lycopersicum)</option>
<option value="Lettuce">Lettuce (Lactuca sativa)</option>
<option value="Strawberry">Strawberry (Fragaria × ananassa)</option>
<option value="Basil">Basil (Ocimum basilicum)</option>
<option value="Bell Pepper">Bell Pepper (Capsicum annuum)</option>
<option value="Microgreens">Microgreens (Brassica mix)</option>
</select>
<span className="material-symbols-outlined absolute right-3.5 top-3 pointer-events-none text-outline text-[18px]">expand_more</span>
</div>

<div className="flex items-center gap-1.5 flex-wrap pt-1">
<span className="font-label-sm text-[11px] text-outline">Quick Pick:</span>
<button className="px-2 py-0.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] border border-outline-variant/30" type="button">Basil</button>
<button className="px-2 py-0.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] border border-outline-variant/30" type="button">Lettuce</button>
<button className="px-2 py-0.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] border border-outline-variant/30" type="button">Pepper</button>
</div>
</div>

<div className="space-y-2">
<label className="font-label-md text-label-md font-semibold text-on-surface" htmlFor="cultivar-input">Variety / Cultivar</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3.5 top-3 text-outline text-[18px]">local_florist</span>
<input className="w-full pl-10 pr-4 py-2.5 bg-surface text-on-surface text-body-md font-medium rounded-lg border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none" id="cultivar-input" placeholder="e.g. Cherokee Purple, Romaine Cos" type="text" value="San Marzano Heirloom" />
</div>
<div className="flex items-center gap-1.5 flex-wrap pt-1">
<span className="font-label-sm text-[11px] text-outline">Preset:</span>
<span className="font-label-sm text-[11px] text-primary cursor-pointer hover:underline">Heirloom Plum</span>
<span className="text-outline text-label-sm">•</span>
<span className="font-label-sm text-[11px] text-primary cursor-pointer hover:underline">Romaine Cos</span>
</div>
</div>
</div>

<div className="space-y-3">
<div className="flex items-center justify-between">
<label className="font-label-md text-label-md font-semibold text-on-surface">Growth Stage Selector</label>
<span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[15px]">autorenew</span> Auto-sets photoperiod &amp; EC limits
                </span>
</div>
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">

<label className="cursor-pointer">
<input className="peer sr-only" name="growth-stage" type="radio" value="Germination" />
<div className="p-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest peer-checked:border-primary peer-checked:bg-primary-fixed/25 peer-checked:shadow-sm text-center flex flex-col items-center gap-1.5 transition-all hover:bg-surface-container-low">
<span className="material-symbols-outlined text-outline peer-checked:text-primary">grain</span>
<span className="font-label-md text-label-md font-semibold text-on-surface">Germination</span>
<span className="font-label-sm text-[10px] text-outline">Days 1-5</span>
</div>
</label>

<label className="cursor-pointer">
<input className="peer sr-only" name="growth-stage" type="radio" value="Seedling" />
<div className="p-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest peer-checked:border-primary peer-checked:bg-primary-fixed/25 peer-checked:shadow-sm text-center flex flex-col items-center gap-1.5 transition-all hover:bg-surface-container-low">
<span className="material-symbols-outlined text-outline peer-checked:text-primary">spoke</span>
<span className="font-label-md text-label-md font-semibold text-on-surface">Seedling</span>
<span className="font-label-sm text-[10px] text-outline">Days 6-14</span>
</div>
</label>

<label className="cursor-pointer">
<input checked="" className="peer sr-only" name="growth-stage" type="radio" value="Vegetative" />
<div className="p-3 rounded-xl border border-primary bg-primary-fixed/25 peer-checked:border-primary peer-checked:bg-primary-fixed/25 peer-checked:shadow-sm text-center flex flex-col items-center gap-1.5 transition-all">
<span className="material-symbols-outlined text-primary font-bold">grass</span>
<span className="font-label-md text-label-md font-bold text-primary">Vegetative</span>
<span className="font-label-sm text-[10px] text-primary/80 font-medium">Days 15-35</span>
</div>
</label>

<label className="cursor-pointer">
<input className="peer sr-only" name="growth-stage" type="radio" value="Flowering" />
<div className="p-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest peer-checked:border-primary peer-checked:bg-primary-fixed/25 peer-checked:shadow-sm text-center flex flex-col items-center gap-1.5 transition-all hover:bg-surface-container-low">
<span className="material-symbols-outlined text-outline peer-checked:text-primary">filter_vintage</span>
<span className="font-label-md text-label-md font-semibold text-on-surface">Flowering</span>
<span className="font-label-sm text-[10px] text-outline">Days 36-50</span>
</div>
</label>

<label className="cursor-pointer">
<input className="peer sr-only" name="growth-stage" type="radio" value="Fruiting" />
<div className="p-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest peer-checked:border-primary peer-checked:bg-primary-fixed/25 peer-checked:shadow-sm text-center flex flex-col items-center gap-1.5 transition-all hover:bg-surface-container-low">
<span className="material-symbols-outlined text-outline peer-checked:text-primary">nutrition</span>
<span className="font-label-md text-label-md font-semibold text-on-surface">Fruiting</span>
<span className="font-label-sm text-[10px] text-outline">Days 51-70</span>
</div>
</label>

<label className="cursor-pointer">
<input className="peer sr-only" name="growth-stage" type="radio" value="Harvest Ready" />
<div className="p-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest peer-checked:border-primary peer-checked:bg-primary-fixed/25 peer-checked:shadow-sm text-center flex flex-col items-center gap-1.5 transition-all hover:bg-surface-container-low">
<span className="material-symbols-outlined text-outline peer-checked:text-primary">inventory_2</span>
<span className="font-label-md text-label-md font-semibold text-on-surface">Harvest</span>
<span className="font-label-sm text-[10px] text-outline">Ready</span>
</div>
</label>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
<div className="space-y-2">
<label className="font-label-md text-label-md font-semibold text-on-surface">Planted At Date</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3.5 top-3 text-outline text-[18px]">calendar_today</span>
<input className="w-full pl-10 pr-4 py-2.5 bg-surface text-on-surface text-body-md font-medium rounded-lg border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none" id="planting-date" type="date" value="2025-05-12" />
</div>

<div className="flex items-center gap-2 pt-1">
<span className="font-label-sm text-[11px] text-outline">Quick Pick:</span>
<button className="px-2 py-0.5 rounded-md bg-surface-container text-primary font-label-sm text-label-sm font-semibold hover:bg-primary-fixed transition-colors" type="button">Today</button>
<button className="px-2 py-0.5 rounded-md bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container transition-colors" type="button">Yesterday</button>
<button className="px-2 py-0.5 rounded-md bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container transition-colors" type="button">1 Week Ago</button>
</div>
</div>

<div className="space-y-2">
<label className="font-label-md text-label-md font-semibold text-on-surface">Assigned Sensor Zone / Station</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3.5 top-3 text-outline text-[18px]">hub</span>
<select className="w-full pl-10 pr-10 py-2.5 bg-surface text-on-surface text-body-md font-medium rounded-lg border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none appearance-none">
<option value="Tower-Beta-04">Zone Beta • Hydro Tower 04 (Telemetry Online)</option>
<option value="Alpha-Rack-01">Zone Alpha • NFT Aeroponic Channel 01</option>
<option value="Gamma-Bed-08">Zone Gamma • Sub-irrigation Bench 08</option>
<option value="Research-Chamber">Phyto-Chamber Lab A (Controlled Atmosphere)</option>
</select>
<span className="material-symbols-outlined absolute right-3.5 top-3 pointer-events-none text-outline text-[18px]">expand_more</span>
</div>
<div className="flex items-center gap-2 pt-1">
<span className="inline-flex items-center gap-1 text-[11px] font-label-sm text-tertiary font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> 3 Associated Probes Reporting
                  </span>
</div>
</div>
</div>



<div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-outline-variant/30">
<button className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md font-medium transition-all duration-150 active:scale-95 text-center" type="button">
                Cancel
              </button>
<div className="flex items-center gap-3 w-full sm:w-auto">
<button className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-outline-variant/70 text-on-surface hover:bg-surface-container-low font-label-md text-label-md font-semibold transition-all duration-150 active:scale-95 text-center" type="button">
                  Save as Draft
                </button>
<button className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md font-bold shadow-md shadow-primary/20 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2" type="submit">
<span className="material-symbols-outlined text-[18px]">verified</span>
                  Save &amp; Register Plant
                </button>
</div>
</div>
</form>
</div>

<div className="xl:col-span-4 space-y-6">

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 custom-shadow-card p-6 space-y-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">event</span>
<h3 className="font-headline-md text-[16px] font-bold text-on-surface">Crop Planting Calendar</h3>
</div>
<span className="font-label-md text-label-md font-bold text-primary">May 2025</span>
</div>

<div className="border border-outline-variant/30 rounded-xl p-3 bg-surface">
<div className="grid grid-cols-7 text-center font-label-caps text-[10px] text-outline pb-2 font-bold uppercase">
<span className="">Mo</span><span className="">Tu</span><span className="">We</span><span className="">Th</span><span className="">Fr</span><span className="">Sa</span><span className="">Su</span>
</div>
<div className="grid grid-cols-7 text-center text-[12px] font-label-md gap-y-1">
<span className="text-outline/40 py-1.5">28</span>
<span className="text-outline/40 py-1.5">29</span>
<span className="text-outline/40 py-1.5">30</span>
<span className="py-1.5 text-on-surface-variant">1</span>
<span className="py-1.5 text-on-surface-variant">2</span>
<span className="py-1.5 text-on-surface-variant">3</span>
<span className="py-1.5 text-on-surface-variant">4</span>
<span className="py-1.5 text-on-surface-variant">5</span>
<span className="py-1.5 text-on-surface-variant">6</span>
<span className="py-1.5 text-on-surface-variant">7</span>
<span className="py-1.5 text-on-surface-variant">8</span>
<span className="py-1.5 text-on-surface-variant">9</span>
<span className="py-1.5 text-on-surface-variant">10</span>
<span className="py-1.5 text-on-surface-variant">11</span>

<span className="py-1.5 rounded-lg bg-primary text-on-primary font-bold shadow-sm shadow-primary/30">12</span>
<span className="py-1.5 text-on-surface font-semibold">13</span>
<span className="py-1.5 text-on-surface font-semibold">14</span>
<span className="py-1.5 text-on-surface-variant">15</span>
<span className="py-1.5 text-on-surface-variant">16</span>
<span className="py-1.5 text-on-surface-variant">17</span>
<span className="py-1.5 text-on-surface-variant">18</span>
<span className="py-1.5 text-on-surface-variant">19</span>
<span className="py-1.5 text-on-surface-variant">20</span>
<span className="py-1.5 text-on-surface-variant">21</span>
<span className="py-1.5 text-on-surface-variant">22</span>
<span className="py-1.5 text-on-surface-variant">23</span>
<span className="py-1.5 text-on-surface-variant">24</span>
<span className="py-1.5 text-on-surface-variant">25</span>
<span className="py-1.5 text-on-surface-variant">26</span>
<span className="py-1.5 text-on-surface-variant">27</span>
<span className="py-1.5 text-on-surface-variant">28</span>
<span className="py-1.5 text-on-surface-variant">29</span>
<span className="py-1.5 text-on-surface-variant">30</span>
<span className="py-1.5 text-on-surface-variant">31</span>
<span className="text-outline/40 py-1.5">1</span>
</div>
</div>
<div className="space-y-2 pt-1 text-label-md font-label-md">
<div className="flex items-center justify-between text-on-surface">
<span className="text-outline">Estimated Germination:</span>
<span className="font-semibold">May 17, 2025</span>
</div>
<div className="flex items-center justify-between text-on-surface">
<span className="text-outline">Target First Harvest:</span>
<span className="font-bold text-primary">July 22, 2025 (71 Days)</span>
</div>
</div>
</div>


</div>
</div>

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 custom-shadow-card p-6 sm:p-8 space-y-6">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div>
<h2 className="font-headline-md text-headline-md font-bold text-on-surface">Recent Planted Crops &amp; Active Batches</h2>
<p className="font-label-md text-label-md text-outline">Real-time status of all active growth cycles currently tethered to AeroSense sensors.</p>
</div>

<div className="flex items-center gap-2">
<span className="font-label-md text-label-md text-outline hidden md:inline">Filter by:</span>
<button className="px-3 py-1.5 rounded-lg bg-surface-container text-primary font-label-md text-label-md font-semibold" type="button">All Crops</button>
<button className="px-3 py-1.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant font-label-md text-label-md" type="button">Hydroponic</button>
<button className="px-3 py-1.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant font-label-md text-label-md" type="button">Aeroponic</button>
</div>
</div>

<div className="overflow-x-auto -mx-6 sm:mx-0">
<table className="w-full text-left border-collapse min-w-[760px]">
<thead>
<tr className="border-b border-outline-variant/30 text-outline font-label-caps text-label-caps uppercase">
<th className="py-3 px-4 font-bold">Plant / Batch Name</th>
<th className="py-3 px-4 font-bold">Crop &amp; Cultivar</th>
<th className="py-3 px-4 font-bold">Growth Stage</th>
<th className="py-3 px-4 font-bold">Planted At</th>
<th className="py-3 px-4 font-bold">Assigned Sensor Zone</th>
<th className="py-3 px-4 font-bold">Telemetry Status</th>
<th className="py-3 px-4 font-bold text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/20 font-body-md text-body-md">

<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-3.5 px-4">
<div className="flex items-center gap-2.5">
<div className="w-8 h-8 rounded-lg bg-secondary-fixed/50 text-secondary flex items-center justify-center font-bold">
<span className="material-symbols-outlined text-[18px]">spa</span>
</div>
<div>
<div className="font-bold text-on-surface text-[14px]">Hydro Tower Alpha - #09</div>
<div className="text-[11px] text-outline font-label-sm">UUID: PLT-9482-AT</div>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<span className="font-semibold text-on-surface">Butterhead Lettuce</span>
<div className="text-[11px] text-outline">Rex Rijk Zwaan</div>
</td>
<td className="py-3.5 px-4">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Vegetative (Day 22)
                  </span>
</td>
<td className="py-3.5 px-4 text-on-surface-variant font-medium">Apr 20, 2025</td>
<td className="py-3.5 px-4">
<span className="text-on-surface font-medium">Zone Alpha</span>
<span className="text-outline text-label-sm block">Pod #02</span>
</td>
<td className="py-3.5 px-4">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-tertiary/10 text-tertiary font-label-md text-label-md font-semibold">
<span className="material-symbols-outlined text-[15px]">check_circle</span>
                    Nominal
                  </span>
</td>
<td className="py-3.5 px-4 text-right">
<button className="p-1.5 text-outline hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="Inspect Telemetry" type="button">
<span className="material-symbols-outlined text-[18px]">show_chart</span>
</button>
<button className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors" title="Options" type="button">
<span className="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-3.5 px-4">
<div className="flex items-center gap-2.5">
<div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center font-bold">
<span className="material-symbols-outlined text-[18px]">psychiatry</span>
</div>
<div>
<div className="font-bold text-on-surface text-[14px]">Aeroponic Bench C - #04</div>
<div className="text-[11px] text-outline font-label-sm">UUID: PLT-8821-BC</div>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<span className="font-semibold text-on-surface">Sweet Genovese Basil</span>
<div className="text-[11px] text-outline">Aroma 2 Cultivar</div>
</td>
<td className="py-3.5 px-4">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Flowering
                  </span>
</td>
<td className="py-3.5 px-4 text-on-surface-variant font-medium">Apr 08, 2025</td>
<td className="py-3.5 px-4">
<span className="text-on-surface font-medium">Zone Gamma</span>
<span className="text-outline text-label-sm block">Pod #07</span>
</td>
<td className="py-3.5 px-4">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary-container/20 text-on-secondary-container font-label-md text-label-md font-semibold">
<span className="material-symbols-outlined text-[15px]">water_drop</span>
                    Irrigation Needed
                  </span>
</td>
<td className="py-3.5 px-4 text-right">
<button className="p-1.5 text-outline hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="Inspect Telemetry" type="button">
<span className="material-symbols-outlined text-[18px]">show_chart</span>
</button>
<button className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors" title="Options" type="button">
<span className="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-3.5 px-4">
<div className="flex items-center gap-2.5">
<div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center font-bold">
<span className="material-symbols-outlined text-[18px]">eco</span>
</div>
<div>
<div className="font-bold text-on-surface text-[14px]">Vertical Rack Delta - #02</div>
<div className="text-[11px] text-outline font-label-sm">UUID: PLT-3129-VD</div>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<span className="font-semibold text-on-surface">Albion Strawberries</span>
<div className="text-[11px] text-outline">Ever-bearing clone</div>
</td>
<td className="py-3.5 px-4">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                    Fruiting (Brix 8.2)
                  </span>
</td>
<td className="py-3.5 px-4 text-on-surface-variant font-medium">Mar 14, 2025</td>
<td className="py-3.5 px-4">
<span className="text-on-surface font-medium">Zone Delta</span>
<span className="text-outline text-label-sm block">Pod #12</span>
</td>
<td className="py-3.5 px-4">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-tertiary/10 text-tertiary font-label-md text-label-md font-semibold">
<span className="material-symbols-outlined text-[15px]">check_circle</span>
                    Nominal
                  </span>
</td>
<td className="py-3.5 px-4 text-right">
<button className="p-1.5 text-outline hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="Inspect Telemetry" type="button">
<span className="material-symbols-outlined text-[18px]">show_chart</span>
</button>
<button className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors" title="Options" type="button">
<span className="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="flex items-center justify-between pt-2 border-t border-outline-variant/30 text-label-md font-label-md text-outline">
<span className="">Showing 3 of 9 registered botanical batches</span>
<a className="text-primary hover:underline font-semibold flex items-center gap-1" href="#">
            View All Batches in Telemetry Grid
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
</div>
</main>
</div>




    </div>
  );
}
