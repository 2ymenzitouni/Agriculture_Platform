import LogoutButton from '../components/LogoutButton';

export default function IoT_Simulator() {
  return (
    <div className="w-full">
      

<aside className="fixed top-0 left-0 h-full w-[68px] z-40 bg-surface-container-lowest dark:bg-inverse-surface border-r border-outline-variant/30 dark:border-outline/20 shadow-sm flex flex-col justify-between items-center py-5">

<div className="flex flex-col items-center gap-1">
<div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm" title="AeroSense IoT - Telemetry v2.4">
<span className="material-symbols-outlined text-xl" data-icon="sensors">sensors</span>
</div>
</div>


<nav className="flex flex-col gap-3">

<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95" href="#" title="Dashboard">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
</a>

<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95" href="#" title="Media Analysis">
<span className="material-symbols-outlined" data-icon="perm_media">perm_media</span>
</a>
<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95" href="#" title="File Ingestion">
<span className="material-symbols-outlined" data-icon="upload_file">upload_file</span>
</a><button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95" title="Plant Registry &amp; Crop Systems"><span className="material-symbols-outlined" data-icon="potted_plant">potted_plant</span></button>

<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95" href="#" title="AI Assistant">
<span className="material-symbols-outlined" data-icon="smart_toy">smart_toy</span>
</a>

<a className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface-container dark:bg-primary/20 text-primary dark:text-inverse-primary transition-all duration-200 active:scale-95 shadow-sm" href="#" title="Telemetry Simulator">
<span className="material-symbols-outlined" data-icon="tune" >tune</span>
</a>

<a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95" href="#" title="Devices">
<span className="material-symbols-outlined" data-icon="sensors">sensors</span>
</a>
</nav>

<div className="flex flex-col gap-3">
<button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-all duration-200 active:scale-95" title="Settings">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
</button>
<LogoutButton className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-error hover:bg-surface-container-low transition-all duration-200 active:scale-95" title="Logout" aria-label="Logout">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
</LogoutButton>
</div>
</aside>

<div className="ml-[68px] w-[calc(100%-68px)] flex flex-col min-h-screen">

<header className="sticky top-0 z-30 bg-surface-container-lowest/90 dark:bg-inverse-surface/90 backdrop-blur-md border-b border-outline-variant/30 dark:border-outline/20 px-6 py-3.5 flex justify-between items-center w-full"><div className="flex items-center gap-4">
  <div className="flex flex-col leading-tight"><span className="text-headline-md font-headline-md font-bold text-on-surface dark:text-inverse-on-surface">AeroSense</span><span className="text-label-caps font-label-caps text-outline uppercase tracking-wider font-bold">Telemetry</span></div>
</div>
<div className="flex-1 flex justify-center px-4">
  <div className="relative w-full max-w-md hidden sm:flex items-center">
    <span className="material-symbols-outlined absolute left-3 text-outline" data-icon="search">search</span>
    <input className="w-full pl-9 pr-4 py-1.5 text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface placeholder:text-outline" placeholder="Search parameters, nodes, buses..." type="text" />
  </div>
</div>
<div className="flex items-center gap-3">
  <button className="relative p-2 text-outline hover:text-on-surface transition-colors rounded-lg hover:bg-surface-container-low" title="Notifications">
    <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
  </button>
  <button className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface text-body-md font-body-md hover:bg-surface-container-low transition-all" id="btn-export-payload">
    <span className="material-symbols-outlined text-sm" data-icon="download">download</span>
    <span className="">Export Data</span>
  </button>
  <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-container flex items-center justify-center font-bold text-label-md border border-outline-variant/30" title="Administrator profile">
    AD
  </div>
</div></header>

<main className="p-6 md:p-8 flex-1 space-y-6">

<section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 card-shadow p-6 transition-all">
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
<div>
<div className="flex items-center gap-2 mb-1">
<span className="inline-block px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-caps text-label-caps uppercase">Virtual Bridge Bus #14</span>
<span className="flex items-center gap-1 font-label-sm text-label-sm text-tertiary">
<span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
                Socket Live
              </span>
</div>
<h1 className="text-headline-lg font-headline-lg text-on-surface">IoT System Input &amp; Parameter Simulation</h1>
<p className="text-body-md font-body-md text-on-surface-variant">Adjust 7 environmental and hydroponic parameters, simulate sensor noise, and push synchronized packets to connected telemetry streams.</p>
</div>

<div className="flex items-center gap-3 flex-row">

<label className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 cursor-pointer select-none">
<input className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary focus:ring-offset-0" id="toggle-autogen" type="checkbox" />
<span className="text-body-md font-body-md text-on-surface font-medium flex items-center gap-1.5">
<span className="material-symbols-outlined text-base text-primary" data-icon="autorenew">autorenew</span>
                Auto Stream (2s)
              </span>
</label>

<button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-body-md font-body-md font-semibold hover:bg-surface-container-low active:scale-95 transition-all shadow-sm" id="btn-shuffle-all">
<span className="material-symbols-outlined text-primary text-lg" data-icon="shuffle">shuffle</span>
<span className="">Shuffle Parameters</span>
</button>


</div>
</div>
</section>

<div className="grid grid-cols-12 gap-6">

<div className="col-span-12 xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 card-shadow p-5 flex flex-col justify-between transition-all">
<div>
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-error-container/40 text-error flex items-center justify-center">
<span className="material-symbols-outlined text-lg" data-icon="thermostat">thermostat</span>
</div>
<div>
<h2 className="text-headline-md font-headline-md text-on-surface">Temperature</h2>
<span className="text-label-sm font-label-sm text-outline">Ambient Atmosphere</span>
</div>
</div>
<button className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-low transition-colors"  title="Randomize Temperature">
<span className="material-symbols-outlined text-base" data-icon="cached">cached</span>
</button>
</div>

<div className="flex items-baseline justify-between my-2">
<span className="text-display-metric font-display-metric text-on-surface" id="temp-display">24.8<span className="text-headline-md font-headline-md text-outline ml-1">°C</span></span>
<div className="flex items-center gap-1.5">
<label className="text-label-caps font-label-caps text-outline">MANUAL</label>
<input className="w-20 px-2 py-1 text-right text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface" id="temp-input" max="45" min="10" step="0.1" type="number" value="24.8" />
</div>
</div>

<div className="mt-4 space-y-1.5">
<div className="flex justify-between text-label-sm font-label-sm text-outline">
<span className="">10.0 °C</span>
<span className="text-tertiary font-medium">Nominal: 22 - 26 °C</span>
<span className="">45.0 °C</span>
</div>
<input className="w-full h-2 bg-surface-container rounded-lg cursor-pointer" id="temp-slider" max="45.0" min="10.0" step="0.1" type="range" value="24.8" />
</div>
</div>

<div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-label-sm font-label-sm">
<span className="text-outline">Sensor: DHT22 #A01</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-medium">Calibrated ±0.2°</span>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 card-shadow p-5 flex flex-col justify-between transition-all">
<div>
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-secondary-fixed/50 text-secondary flex items-center justify-center">
<span className="material-symbols-outlined text-lg" data-icon="water_drop">water_drop</span>
</div>
<div>
<h2 className="text-headline-md font-headline-md text-on-surface">Humidity</h2>
<span className="text-label-sm font-label-sm text-outline">Atmospheric Moisture</span>
</div>
</div>
<button className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-low transition-colors"  title="Randomize Humidity">
<span className="material-symbols-outlined text-base" data-icon="cached">cached</span>
</button>
</div>

<div className="flex items-baseline justify-between my-2">
<span className="text-display-metric font-display-metric text-on-surface" id="humid-display">68<span className="text-headline-md font-headline-md text-outline ml-1">% RH</span></span>
<div className="flex items-center gap-1.5">
<label className="text-label-caps font-label-caps text-outline">MANUAL</label>
<input className="w-20 px-2 py-1 text-right text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface" id="humid-input" max="100" min="10" step="1" type="number" value="68" />
</div>
</div>

<div className="mt-4 space-y-1.5">
<div className="flex justify-between text-label-sm font-label-sm text-outline">
<span className="">Dry (20%)</span>
<span className="text-secondary font-medium">Optimal: 60-75%</span>
<span className="">Saturated (100%)</span>
</div>
<input className="w-full h-2 bg-surface-container rounded-lg cursor-pointer" id="humid-slider" max="100" min="10" step="1" type="range" value="68" />
</div>
</div>
<div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-label-sm font-label-sm">
<span className="text-outline">Dew Point: 18.2 °C</span>
<span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-container font-medium">Stable</span>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 card-shadow p-5 flex flex-col justify-between transition-all">
<div>
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-lg" data-icon="device_thermostat">device_thermostat</span>
</div>
<div>
<h2 className="text-headline-md font-headline-md text-on-surface">Water Temperature</h2>
<span className="text-label-sm font-label-sm text-outline">Hydroponic Reservoir</span>
</div>
</div>
<button className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-low transition-colors"  title="Randomize Water Temp">
<span className="material-symbols-outlined text-base" data-icon="cached">cached</span>
</button>
</div>
<div className="flex items-baseline justify-between my-2">
<span className="text-display-metric font-display-metric text-on-surface" id="watertemp-display">21.4<span className="text-headline-md font-headline-md text-outline ml-1">°C</span></span>
<div className="flex items-center gap-1.5">
<label className="text-label-caps font-label-caps text-outline">MANUAL</label>
<input className="w-20 px-2 py-1 text-right text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface" id="watertemp-input" max="35" min="10" step="0.1" type="number" value="21.4" />
</div>
</div>
<div className="mt-4 space-y-1.5">
<div className="flex justify-between text-label-sm font-label-sm text-outline">
<span className="">10.0 °C</span>
<span className="text-tertiary font-medium">Target: 19.0 - 22.0 °C</span>
<span className="">35.0 °C</span>
</div>
<input className="w-full h-2 bg-surface-container rounded-lg cursor-pointer" id="watertemp-slider" max="35.0" min="10.0" step="0.1" type="range" value="21.4" />
</div>
</div>
<div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-label-sm font-label-sm">
<span className="text-outline">Probe: DS18B20 Submersible</span>
<span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-medium">Cooler Idle</span>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 card-shadow p-5 flex flex-col justify-between transition-all">
<div>
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-surface-variant text-secondary flex items-center justify-center">
<span className="material-symbols-outlined text-lg" data-icon="waves">waves</span>
</div>
<div>
<h2 className="text-headline-md font-headline-md text-on-surface">Water Level</h2>
<span className="text-label-sm font-label-sm text-outline">Reservoir Capacity &amp; Depth</span>
</div>
</div>
<button className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-low transition-colors"  title="Randomize Water Level">
<span className="material-symbols-outlined text-base" data-icon="cached">cached</span>
</button>
</div>
<div className="flex items-baseline justify-between my-2">
<div>
<span className="text-display-metric font-display-metric text-on-surface" id="waterlevel-display">84.5<span className="text-headline-md font-headline-md text-outline ml-1">cm</span></span>
<span className="text-label-md font-label-md text-secondary ml-2 font-semibold" id="waterlevel-pct">(85%)</span>
</div>
<div className="flex items-center gap-1.5">
<label className="text-label-caps font-label-caps text-outline">MANUAL</label>
<input className="w-20 px-2 py-1 text-right text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface" id="waterlevel-input" max="100" min="0" step="0.5" type="number" value="84.5" />
</div>
</div>

<div className="mt-4 space-y-1.5">
<div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden flex">
<div className="bg-secondary h-full rounded-full transition-all duration-300" id="tank-progress-bar" ></div>
</div>
<div className="flex justify-between text-label-sm font-label-sm text-outline">
<span className="">0 cm (Empty)</span>
<span className="">Threshold Alarm: &lt; 25 cm</span>
<span className="">100 cm (Max)</span>
</div>
<input className="w-full h-2 bg-surface-container rounded-lg cursor-pointer" id="waterlevel-slider" max="100.0" min="0.0" step="0.5" type="range" value="84.5" />
</div>
</div>
<div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-label-sm font-label-sm">
<span className="text-outline">Ultrasonic HC-SR04</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-on-secondary-container font-medium">Nominal Volume</span>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 card-shadow p-5 flex flex-col justify-between transition-all">
<div>
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-surface-container text-tertiary flex items-center justify-center">
<span className="material-symbols-outlined text-lg" data-icon="science">science</span>
</div>
<div>
<h2 className="text-headline-md font-headline-md text-on-surface">pH Acidity / Alkalinity</h2>
<span className="text-label-sm font-label-sm text-outline">Solution Chemistry</span>
</div>
</div>
<button className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-low transition-colors"  title="Randomize pH">
<span className="material-symbols-outlined text-base" data-icon="cached">cached</span>
</button>
</div>
<div className="flex items-baseline justify-between my-2">
<div className="flex items-baseline gap-2">
<span className="text-display-metric font-display-metric text-on-surface" id="ph-display">6.80</span>
<span className="text-label-md font-label-md px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-semibold" id="ph-badge">Slightly Acidic</span>
</div>
<div className="flex items-center gap-1.5">
<label className="text-label-caps font-label-caps text-outline">MANUAL</label>
<input className="w-20 px-2 py-1 text-right text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface" id="ph-input" max="10.0" min="4.0" step="0.05" type="number" value="6.80" />
</div>
</div>

<div className="mt-4 space-y-1.5">
<div className="w-full h-2 rounded-full overflow-hidden flex bg-surface-container">
<div className="h-full w-1/3 bg-error opacity-80" title="Acidic (4.0-6.0)"></div>
<div className="h-full w-1/3 bg-tertiary-fixed opacity-90" title="Ideal (6.0-7.2)"></div>
<div className="h-full w-1/3 bg-secondary-container opacity-80" title="Alkaline (7.2-9.0)"></div>
</div>
<div className="flex justify-between text-label-sm font-label-sm text-outline">
<span className="">Acidic (4.0)</span>
<span className="text-tertiary font-bold">Ideal 5.8 - 6.5</span>
<span className="">Alkaline (9.0)</span>
</div>
<input className="w-full h-2 bg-surface-container rounded-lg cursor-pointer" id="ph-slider" max="9.0" min="4.0" step="0.05" type="range" value="6.80" />
</div>
</div>
<div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-label-sm font-label-sm">
<span className="text-outline">Electrode BNC: Glass Bulb</span>
<span className="text-outline-variant font-mono text-label-sm">Offset: +0.03mV</span>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 card-shadow p-5 flex flex-col justify-between transition-all">
<div>
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-tertiary-fixed/40 text-tertiary flex items-center justify-center">
<span className="material-symbols-outlined text-lg" data-icon="electric_bolt">electric_bolt</span>
</div>
<div>
<h2 className="text-headline-md font-headline-md text-on-surface">EC (Conductivity)</h2>
<span className="text-label-sm font-label-sm text-outline">Nutrient Salinity Level</span>
</div>
</div>
<button className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-low transition-colors"  title="Randomize EC">
<span className="material-symbols-outlined text-base" data-icon="cached">cached</span>
</button>
</div>
<div className="flex items-baseline justify-between my-2">
<span className="text-display-metric font-display-metric text-on-surface" id="ec-display">1.65<span className="text-headline-md font-headline-md text-outline ml-1">mS/cm</span></span>
<div className="flex items-center gap-1.5">
<label className="text-label-caps font-label-caps text-outline">MANUAL</label>
<input className="w-20 px-2 py-1 text-right text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface" id="ec-input" max="3.5" min="0.2" step="0.05" type="number" value="1.65" />
</div>
</div>
<div className="mt-4 space-y-1.5">
<div className="flex justify-between text-label-sm font-label-sm text-outline">
<span className="">0.2 mS</span>
<span className="text-tertiary font-medium">Optimal: 1.4 - 2.2 mS/cm</span>
<span className="">3.5 mS</span>
</div>
<input className="w-full h-2 bg-surface-container rounded-lg cursor-pointer" id="ec-slider" max="3.5" min="0.2" step="0.05" type="range" value="1.65" />
</div>
</div>
<div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-label-sm font-label-sm">
<span className="text-outline">TDS Approx: ~825 ppm</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container-low text-tertiary font-medium">Vegetative State</span>
</div>
</div>

<div className="md:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 card-shadow p-5 flex flex-col justify-between transition-all">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
<div>
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-lg" data-icon="light_mode">light_mode</span>
</div>
<div>
<h2 className="text-headline-md font-headline-md text-on-surface">Light Irradiance</h2>
<span className="text-label-sm font-label-sm text-outline">Solar Flux &amp; Lumens</span>
</div>
</div>
<button className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-low transition-colors"  title="Randomize Light">
<span className="material-symbols-outlined text-base" data-icon="cached">cached</span>
</button>
</div>
<div className="flex items-baseline justify-between my-2">
<span className="text-display-metric font-display-metric text-on-surface" id="lux-display">12,400<span className="text-headline-md font-headline-md text-outline ml-1">Lux</span></span>
<div className="flex items-center gap-1.5">
<label className="text-label-caps font-label-caps text-outline">MANUAL</label>
<input className="w-24 px-2 py-1 text-right text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface" id="lux-input" max="40000" min="0" step="100" type="number" value="12400" />
</div>
</div>
<div className="mt-4 space-y-1.5">
<div className="flex justify-between text-label-sm font-label-sm text-outline">
<span className="">0 Lux (Dark)</span>
<span className="text-primary font-medium">85% Canopy Saturation</span>
<span className="">40,000 Lux</span>
</div>
<input className="w-full h-2 bg-surface-container rounded-lg cursor-pointer" id="lux-slider" max="40000" min="0" step="100" type="range" value="12400" />
</div>
</div>

<div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex flex-col justify-between">
<div className="flex items-center justify-between text-label-md font-label-md text-on-surface mb-2">
<span className="font-semibold">Photoperiod Activity</span>
<span className="text-primary font-mono" id="par-reading">PAR: 310 µmol/m²/s</span>
</div>

<div className="grid grid-cols-10 gap-1 my-2">
<div className="h-6 rounded bg-primary"></div>
<div className="h-6 rounded bg-primary"></div>
<div className="h-6 rounded bg-primary"></div>
<div className="h-6 rounded bg-primary"></div>
<div className="h-6 rounded bg-primary"></div>
<div className="h-6 rounded bg-primary"></div>
<div className="h-6 rounded bg-primary"></div>
<div className="h-6 rounded bg-primary"></div>
<div className="h-6 rounded bg-surface-variant"></div>
<div className="h-6 rounded bg-surface-variant"></div>
</div>
<div className="flex justify-between text-label-sm font-label-sm text-outline mt-1">
<span className="">BH1750 Ambient Sensor</span>
<span className="">Spectrum: Full LED Array</span>
</div>
</div>
</div>
</div>
</div>

<div className="col-span-12 xl:col-span-4 flex flex-col gap-5">

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 card-shadow p-5 flex flex-col flex-1">
<div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-xl" data-icon="data_object">data_object</span>
<div>
<h3 className="text-headline-md font-headline-md text-on-surface">Live Payload (JSON)</h3>
<span className="text-label-sm font-label-sm text-outline">Simulated MQTT / Webhook packet</span>
</div>
</div>
<button className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors" id="copy-json-btn" title="Copy to Clipboard">
<span className="material-symbols-outlined text-lg" data-icon="content_copy">content_copy</span>
</button>
</div>

<div className="my-3 flex-1 bg-inverse-surface rounded-xl p-4 overflow-x-auto border border-outline/30 text-surface-variant">
<pre className="text-xs leading-relaxed"><code className="text-emerald-300 font-mono" id="json-preview">&#123;<br />  "deviceId": "AEROSENSE-NODE-04",<br />  "firmware": "v2.4.1",<br />  "timestamp": "2026-10-10T17:35:08.253Z",<br />  "metrics": &#123;<br />    "temperature_c": 24.8,<br />    "humidity_pct": 68,<br />    "water_temperature_c": 21.4,<br />    "water_level_cm": 84.5,<br />    "ph_val": 6.8,<br />    "ec_ms_cm": 1.65,<br />    "light_lux": 12400<br />  &#125;,<br />  "status": "SIMULATED_NOMINAL",<br />  "rssi": -58<br />&#125;</code></pre>
</div>

<div className="space-y-2 text-label-sm font-label-sm pt-2">
<div className="flex justify-between items-center text-on-surface-variant">
<span className="">Broker Endpoint:</span>
<span className="font-mono text-on-surface font-semibold">mqtt://aerosense.local:1883</span>
</div>
<div className="flex justify-between items-center text-on-surface-variant">
<span className="">Topic:</span>
<span className="font-mono text-primary font-semibold">/telemetry/node_04/inputs</span>
</div>
<div className="flex justify-between items-center text-on-surface-variant">
<span className="">Packet Size:</span>
<span className="font-mono text-on-surface" id="payload-size">348 bytes</span>
</div>
<div className="flex justify-between items-center text-on-surface-variant">
<span className="">Last Dispatch:</span>
<span className="font-mono text-tertiary font-semibold" id="last-dispatch-time">Just now</span>
</div>
</div>

<div className="mt-4 pt-3 border-t border-outline-variant/20">
<button className="w-full py-2.5 px-4 rounded-lg bg-surface-container text-primary font-bold text-body-md font-body-md hover:bg-surface-container-high transition-all flex items-center justify-center gap-2" >
<span className="material-symbols-outlined text-lg" data-icon="publish">publish</span>
<span className="">Send Packet Now</span>
</button>
</div>
</div>


</div>
</div>
</main>
</div>





    </div>
  );
}
