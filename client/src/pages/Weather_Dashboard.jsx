import LogoutButton from '../components/LogoutButton';

export default function Weather_Dashboard() {
  return (
    <div className="w-full">
      



<aside className="fixed top-0 left-0 h-screen w-[68px] z-40 bg-surface-container-lowest dark:bg-inverse-surface border-r border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none flex flex-col justify-between items-center py-5">

<div className="flex flex-col items-center gap-1 w-full">
<div className="w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center text-primary transition-all duration-200 hover:scale-105 shadow-sm">
<span className="material-symbols-outlined text-primary text-[28px]">cloud</span>
</div>
</div>


<nav className="flex flex-col items-center gap-3.5 my-auto w-full">
<button className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface-container dark:bg-primary/20 text-primary dark:text-inverse-primary transition-colors transition-all duration-200 active:scale-95 group" title="Dashboard">
<span className="material-symbols-outlined text-[24px]">dashboard</span>
</button>

<button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors transition-all duration-200 active:scale-95" title="Media Analysis">
<span className="material-symbols-outlined text-[24px]">perm_media</span>
</button><button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors duration-200 active:scale-95" title="File Ingestion"><span className="material-symbols-outlined text-[24px]">upload_file</span></button><button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors transition-all duration-200 active:scale-95" title="Plant Registry &amp; Crop Systems">
<span className="material-symbols-outlined text-[24px]">potted_plant</span>
</button>

<button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors transition-all duration-200 active:scale-95" title="AI Assistant">
<span className="material-symbols-outlined text-[24px]">smart_toy</span>
</button>

<button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors transition-all duration-200 active:scale-95" title="Telemetry Simulator">
<span className="material-symbols-outlined text-[24px]">tune</span>
</button>

<button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors transition-all duration-200 active:scale-95" title="Devices">
<span className="material-symbols-outlined text-[24px]">sensors</span>
</button>
</nav>

<div className="flex flex-col items-center gap-2 pt-2 border-t border-outline-variant/30 w-full">
<button className="flex items-center justify-center w-10 h-10 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95" title="Settings">
<span className="material-symbols-outlined text-[22px]">settings</span>
</button>
<LogoutButton className="flex items-center justify-center w-10 h-10 rounded-xl text-outline dark:text-outline-variant hover:text-error hover:bg-error-container/40 transition-all duration-200 active:scale-95" title="Logout" aria-label="Logout">
<span className="material-symbols-outlined text-[22px]">power_settings_new</span>
</LogoutButton>
</div>
</aside>



<header className="sticky top-0 right-0 z-30 ml-[68px] w-[calc(100%-68px)] bg-surface-container-lowest/90 dark:bg-inverse-surface/90 backdrop-blur-md border-b border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none flex justify-between items-center px-6 py-3">
<div className="flex items-center gap-2.5 flex-shrink-0"><div className="flex flex-col leading-none"><span className="text-headline-md font-headline-md font-bold text-on-surface dark:text-inverse-on-surface leading-tight">AeroSense</span><span className="text-xs text-on-surface-variant tracking-normal leading-tight font-bold">Telemetry</span></div></div>


<div className="flex-1 flex justify-center px-6">
  <div className="relative w-full max-w-md hidden sm:block">
    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
    <input className="w-full bg-surface-container-low/60 border border-outline-variant/40 rounded-lg pl-8 pr-3 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="Search sensors, station..." type="text" />
  </div>
</div>


<div className="flex items-center gap-5 flex-shrink-0">
  
  <div className="flex items-center gap-3">
    <button className="p-2 text-outline hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors relative" title="Notifications">
      <span className="material-symbols-outlined text-[20px]">notifications</span>
      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest"></span>
    </button>
    
    <button className="xl:flex items-center gap-1 bg-surface-container-lowest border border-outline-variant/60 text-on-surface-variant text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-surface-container-low transition-all flex">
      <span className="material-symbols-outlined text-[16px]">file_download</span>
      Export Data
    </button>
    
    <div className="flex items-center pl-2 border-l border-outline-variant/40">
      <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-xs text-primary border border-primary/20" title="Administrator profile photo">
        AD
      </div>
    </div>
  </div>
</div></header>



<main className="ml-[68px] flex-1 p-4 md:p-6 lg:p-7 max-w-[1700px] w-[calc(100%-68px)]">

<div className="grid grid-cols-12 gap-4 lg:gap-5">




<div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl border border-[#E2E8F0] card-shadow card-hover p-5 flex items-center justify-between transition-all duration-200">
<div className="flex items-center gap-4">

<div className="w-16 h-16 rounded-xl bg-surface-container-low flex items-center justify-center relative overflow-hidden flex-shrink-0">
<img className="w-full h-full object-cover" data-alt="A clean modern vector style illustration of a data analyst inspecting weather dashboard analytics on an oversized monitor. Minimal light-mode aesthetic with bright azure accents, clean whites, and slate blue strokes." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5eCWVcsQON8ae2cuysCZ39NFKKgN_Uhj9lc6N-Gy7KonXJHitZla7KLqVHbvWc5YRk8mWq5cNVCywaJAH_oTGeaGR2Z0ZB_JIxXvKv1f1d-rrVgh6PTWo7JhtM1FaAdNjI0IPDEwYsgLHsY_PvcCnx0n55egNlZLLEZkMsAm9BvlLny4bWStsgxPMw7HtnlkjrZXY40q0XvHfxusFPPTtUU6F4OXBgkIQfqsr4mHc48C2JdLFWnh-gw" />
</div>
<div>
<h1 className="text-headline-lg font-headline-lg text-on-surface leading-tight">Dashboard</h1>
<p className="text-xs text-outline font-medium mt-0.5">Powerd By Openweathermap</p>
</div>
</div>
<div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-low text-primary">
<span className="material-symbols-outlined text-[18px]">verified</span>
</div>
</div>

<div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl border border-[#E2E8F0] card-shadow card-hover p-4 grid grid-cols-2 divide-x divide-outline-variant/30 transition-all duration-200">

<div className="pr-3 flex items-center gap-3">
<div className="w-12 h-14 rounded-lg bg-surface-container-low flex items-center justify-center overflow-hidden flex-shrink-0">
<img className="w-full h-full object-cover" data-alt="A soft stylized digital vector graphic of a girl standing under a vibrant blue umbrella in light drizzle, in a crisp minimalist flat art style with soft azure highlights and serene slate backdrop." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmS59s7KYMLXSCj6k0QQzZq7vuIsq1Tdh3hqs8OyKadL5t5vO-IPufJJN1ZqjllHJzgCZMdOiY-WF84FpRxAYIsKXDAxGefh3UhJdu8dUyfUaZ6uCk20aUl8uuFWjcXjj3G30fvqldSXgGJVB3kkf7Mq0zyNmurdgtZvlOFT_RvkzJeNP53NjxcKMPPcGpHh3zX2d6Dr_pBwaj8hr7nvjFHyrOoRrmzWvowN16Mt6f_xhECYt1NYxvLg" />
</div>
<div className="min-w-0">
<span className="text-label-caps font-label-caps text-outline block uppercase tracking-wider">TODAY WEATHER</span>
<div className="text-headline-md font-headline-md font-bold text-on-surface tracking-tight mt-0.5 truncate">CLOUDS</div>
<span className="text-[10px] text-outline font-medium block truncate">CLOUDS, BROKEN CLOUDS</span>
</div>
</div>

<div className="pl-3 flex items-center justify-between">
<div className="min-w-0">
<span className="text-label-caps font-label-caps text-outline block uppercase tracking-wider">WEATHER FEEL LIKE</span>
<div className="text-headline-lg font-headline-lg font-bold text-on-surface mt-0.5">26 C</div>
<span className="text-[10px] text-outline font-medium block">IN CELSIUS</span>
</div>
<div className="w-12 h-14 rounded-lg bg-surface-container-low flex items-center justify-center overflow-hidden flex-shrink-0">
<img className="w-full h-full object-cover" data-alt="Modern vector illustration of a happy vacation traveler holding luggage in front of tropical palm tree silhouettes under bright sunny skies, high-key clean light-mode vector styling with vibrant cerulean tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUZ_VBcu7vYWLZW9kYIdrZ_HH4tTCDa2uuZLNSlYRS8kMfTP7TKP7Ht5mv91fuh2h_MTETCSO7ZiEhWTZymuqWx0dGRuI9aaFx0BFqiB7maav9qw_qH2QB7idkbkAZV5CaUKpOeKtQXEpNtY0m-ihsxYdkbeBrWGv2RI6oZbCE0KYeXwMX8C4LAci8RyNeSMCZh0N2t3E8matkvGSyxiTblr_jiTpRPDKNvjnTjp7qVLClr7as62gKTg" />
</div>
</div>
</div>

<div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl border border-[#E2E8F0] card-shadow card-hover p-4 flex flex-col justify-between transition-all duration-200">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
<span className="text-[11px] font-semibold text-outline uppercase tracking-wider">SYSTEM TIME</span>
</div>

<div className="w-16 h-10 rounded-lg overflow-hidden bg-surface-container-low flex items-center justify-center">
<img className="w-full h-full object-cover" data-alt="Digital art illustration of a cosmic wall clock with day and night split background showing sun and crescent moon, rendered in pristine geometric vector palette with cobalt blue and soft white." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8V7AXT98XiawgjVnA3Vrzfy55La9rnMp3ne-hUf_n3IGME9ircJkjuEy2-lVX_dvUD2pppS-VsTSkqRNT5ZaXdPWELEGRDhhwY1ALaZDYhz0LZoxJYJ3LK8mYtZuHyZpYrZ3wnHZPnLW5KEzdOXQnUUnTFwia_RrsGRcqO0byIITFlwtSG9Dn8nygfH4V-EpKf3yAog_cUmSNHfm4FL_Km42IyLMEVnggy_69XzGUoM6v31zhQswK2g" />
</div>
</div>

<div className="text-center py-1">
<div className="digital-lcd text-[34px] lg:text-[38px] font-bold text-on-surface leading-none tracking-widest select-none">11:28:23 <span className="text-headline-md font-headline-md text-outline">PM</span></div>
<div className="text-label-md font-label-md font-bold text-outline tracking-widest mt-1 uppercase">
            06 MAY 2022
          </div>
</div>
</div>




<div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl border border-[#E2E8F0] card-shadow card-hover p-5 flex flex-col justify-between transition-all duration-200">
<div>
<span className="text-label-caps font-label-caps text-outline block uppercase tracking-wider">TEMPERATURE</span>
<div className="flex items-center justify-between mt-2">
<div>
<div className="text-[36px] font-bold font-display-metric text-on-surface leading-none">25 C</div>
<span className="text-xs text-outline font-medium mt-1 inline-block">Ambient Sensor #01</span>
</div>
<div className="w-20 h-16 rounded-xl bg-surface-container-low overflow-hidden flex items-center justify-center">
<img className="w-full h-full object-cover" data-alt="Flat vector art showing a weather presenter pointing toward a digital forecast display panel with cloud and temperature cards, colored in light blue, deep navy, and crisp white." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8SrM_UdDyLKHCIOYWvc3yO4Cuea-Low1gH5RXfxaioAqEK10pZpWpqLncppF3A3rbnPYua2vKW2jAzaB0tPobPEqp46uckRvfrCzTBa9w2tY_tfajRVwS_euTz7hJfcqIutEd1XRHJUFoKAG4cIwyRxi3GgW8Lfw9cARi_cYq77U1mifRkqB46U6UNUSgRzLz1XLS1TFvpHHxsLgZmEb88b-8HxA4XxAQJOs7ZUXrmOBl6cM8aR3ISQ" />
</div>
</div>
</div>

<div className="mt-4 pt-2">
<div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden flex items-center">
<div className="bg-emerald-500 h-full rounded-full transition-all duration-500" ></div>
</div>
<div className="flex justify-between items-center text-[11px] font-semibold text-outline mt-1.5">
<span className="">Current Scale</span>
<span className="text-emerald-600 font-bold">44%</span>
</div>
</div>
</div>

<div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl border border-[#E2E8F0] card-shadow card-hover p-5 flex flex-col justify-around transition-all duration-200">

<div>
<div className="flex justify-between items-center mb-1.5">
<span className="text-xs font-bold text-on-surface tracking-wide">MAX TEMPERATURE : 25 C</span>
<span className="text-label-caps font-label-caps text-emerald-600 font-bold">44%</span>
</div>
<div className="w-full bg-[#E2E8F0] h-3 rounded-full overflow-hidden flex items-center">
<div className="bg-[#10B981] h-full rounded-full transition-all duration-500" ></div>
</div>
</div>
<div className="h-[1px] bg-outline-variant/30 my-2"></div>

<div>
<div className="flex justify-between items-center mb-1.5">
<span className="text-xs font-bold text-on-surface tracking-wide">MIN TEMPERATURE : 25 C</span>
<span className="text-label-caps font-label-caps text-primary font-bold">44%</span>
</div>
<div className="w-full bg-[#E2E8F0] h-3 rounded-full overflow-hidden flex items-center">
<div className="bg-[#2563EB] h-full rounded-full transition-all duration-500" ></div>
</div>
</div>
</div>

<div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl border border-[#E2E8F0] card-shadow card-hover p-5 flex flex-col justify-between transition-all duration-200">
<div className="flex items-start justify-between">
<div>
<span className="text-label-caps font-label-caps text-outline block uppercase tracking-wider">BASE LOCATION</span>
<div className="text-headline-md font-headline-md font-bold text-on-surface mt-1 tracking-tight flex items-center gap-1">
<span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
              MATALE, SRI LANKA
            </div>
<span className="text-[11px] text-outline font-medium mt-1 block">Geo Coordinates: 7.4675° N, 80.6234° E</span>
</div>

<div className="w-20 h-16 rounded-xl bg-surface-container-low overflow-hidden flex items-center justify-center flex-shrink-0">
<img className="w-full h-full object-cover" data-alt="Digital vector illustration of a technician seated at a desk studying a GPS map interface on a large holographic display screen, in crisp Scandinavian minimalist style with soft cyan and slate blue palette." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDggsceDlYIT9ZJ71Vw3Dg9N6vFEuJRJUFmNohreyA5iPrXaGTxwTHYNLZGOiEufHvj0vdJSgITJ1GuAgAONKN1safYVDF1Wba7P-prRqvbAeX68KzINNXobiCxI8JTi-o20_BfQeC2iHmq2LKR137ms-O3hRKWzpPAKhGvBKCu1_zmfgdJZ6vmTI3WzMIHpDPRzd6QGfahEAlYcNNyeatuZu-LPNa03cyYhGPcLSpHjPmYc9sOq0oECg" />
</div>
</div>
<div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-outline">
<span className="flex items-center gap-1 font-medium">
<span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
            Last Update : 03/05/2022 22:12:59
          </span>
<span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 rounded">Synced</span>
</div>
</div>




<div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl border border-[#E2E8F0] card-shadow card-hover p-5 flex items-center justify-between transition-all duration-200">
<div>
<span className="text-label-caps font-label-caps text-outline block uppercase tracking-wider">WIND SPEED</span>
<div className="text-display-metric font-display-metric text-on-surface leading-tight mt-1">0.79</div>
<span className="text-xs text-outline font-medium block mt-1">IN km/h</span>
<span className="text-[10px] text-emerald-600 font-semibold mt-2 inline-flex items-center gap-0.5">
<span className="material-symbols-outlined text-[12px]">north_east</span> Calm Breeze
          </span>
</div>

<div className="relative w-28 h-28 flex items-center justify-center">
<svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">

<circle cx="60" cy="60" fill="none" r="48" stroke="#F1F5F9" stroke-dasharray="2 6" stroke-linecap="round" stroke-width="8"></circle>

<path d="M 26 94 A 48 48 0 1 1 94 94" fill="none" stroke="#E2E8F0" stroke-linecap="round" stroke-width="4"></path>
</svg>

<div className="absolute inset-0 flex flex-col items-center justify-center">

<div className="w-12 h-1 bg-red-500 rounded-full origin-right transform -rotate-[135deg] translate-x-[-12px]"></div>
<div className="w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-sm mt-[-9px]"></div>
<span className="text-xs font-bold text-on-surface mt-2">0%</span>
</div>
</div>
</div>

<div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl border border-[#E2E8F0] card-shadow card-hover p-5 flex items-center justify-between transition-all duration-200">
<div>
<span className="text-label-caps font-label-caps text-outline block uppercase tracking-wider">HUMIDITY</span>
<div className="text-display-metric font-display-metric text-on-surface leading-tight mt-1">95%</div>
<span className="text-xs text-outline font-medium block mt-1">Atmospheric water Percentage</span>
<span className="text-[10px] text-primary font-semibold mt-2 inline-flex items-center gap-0.5">
<span className="material-symbols-outlined text-[12px]">water_drop</span> High Moisture
          </span>
</div>

<div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
<svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">

<circle cx="50" cy="50" fill="none" r="40" stroke="#F1F5F9" stroke-width="7"></circle>

<circle cx="50" cy="50" fill="none" r="40" stroke="#0284C7" stroke-dasharray="251.2" stroke-dashoffset="173.3" stroke-linecap="round" stroke-width="7"></circle>
</svg>

<div className="absolute flex flex-col items-center justify-center text-center">
<span className="text-sm font-bold text-primary">31%</span>
<span className="text-[9px] text-outline font-medium uppercase tracking-tight">Cap</span>
</div>
</div>
</div>

<div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl border border-[#E2E8F0] card-shadow card-hover p-5 flex items-center justify-between transition-all duration-200">
<div>
<span className="text-label-caps font-label-caps text-outline block uppercase tracking-wider">AIR PRESSURE</span>
<div className="text-display-metric font-display-metric text-on-surface leading-tight mt-1">1011</div>
<span className="text-xs text-outline font-medium block mt-1">millibars</span>
<span className="text-[10px] text-tertiary-container font-semibold mt-2 inline-flex items-center gap-0.5">
<span className="material-symbols-outlined text-[12px]">compress</span> Standard Atmospheric
          </span>
</div>

<div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
<svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">

<circle cx="50" cy="50" fill="none" r="40" stroke="#F1F5F9" stroke-width="7"></circle>

<circle cx="50" cy="50" fill="none" r="40" stroke="#004AC6" stroke-dasharray="251.2" stroke-dashoffset="173.3" stroke-linecap="round" stroke-width="7"></circle>
</svg>

<div className="absolute flex flex-col items-center justify-center text-center">
<span className="text-sm font-bold text-primary">31%</span>
<span className="text-[9px] text-outline font-medium uppercase tracking-tight">Baro</span>
</div>
</div>
</div>
</div>
</main>



<div className="fixed bottom-6 right-6 z-50 flex items-center group">

<div className="hidden md:flex items-center gap-2 bg-surface-container-lowest border border-[#E2E8F0] text-on-surface px-3.5 py-2 rounded-full shadow-lg mr-3 opacity-90 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform translate-x-2 group-hover:translate-x-0">
<span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
<span className="text-xs font-semibold text-on-surface">Chat with Assistant</span>
</div>

<button aria-label="Chat with Assistant" className="w-14 h-14 rounded-full bg-primary hover:bg-primary-container text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/20">
<span className="material-symbols-outlined text-[28px]" data-weight="fill">chat</span>

<span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
</button>
</div>





    </div>
  );
}
