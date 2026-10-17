import { useEffect, useState, useRef } from 'react';
import LogoutButton from '../components/LogoutButton';
import API from '../services/app';

const toDateInputValue = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
};

const createPlantIdentifier = () => crypto.randomUUID();

const createEmptyPlantForm = () => ({
  name: createPlantIdentifier(),
  crop: 'Tomato',
  variety: '',
  growth_stage: 'Vegetative',
  planted_at: toDateInputValue(new Date()),
});

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  return typeof detail === 'string' ? detail : fallback;
};

export default function Plant_Management() {
  const [plants, setPlants] = useState([]);
  const [plantForm, setPlantForm] = useState(createEmptyPlantForm);
  const [editingPlantId, setEditingPlantId] = useState(null);
  const [loadingPlants, setLoadingPlants] = useState(true);
  const [plantsError, setPlantsError] = useState('');
  const [savingPlant, setSavingPlant] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    API.get('/plants/mine')
      .then(({ data }) => {
        if (isMounted) setPlants(data);
      })
      .catch((requestError) => {
        if (isMounted) {
          setPlantsError(getErrorMessage(requestError, 'Unable to load your plants.'));
        }
      })
      .finally(() => {
        if (isMounted) setLoadingPlants(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSavingPlant(true);

    try {
      const payload = {
        ...plantForm,
        name: plantForm.name.trim(),
        variety: plantForm.variety.trim() || null,
        growth_stage: plantForm.growth_stage || null,
        planted_at: plantForm.planted_at || null,
      };

      if (editingPlantId) {
        const { data: updatedPlant } = await API.put(`/plants/${editingPlantId}`, payload);
        setPlants((currentPlants) =>
          currentPlants.map((p) => (p.id === editingPlantId ? updatedPlant : p))
        );
        setSuccess(`${updatedPlant.name} was updated successfully.`);
      } else {
        const { data: plant } = await API.post('/plants/', payload);
        setPlants((currentPlants) => [plant, ...currentPlants]);
        setSuccess(`${plant.name} was registered successfully.`);
      }

      setPlantForm(createEmptyPlantForm());
      setEditingPlantId(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to save this plant.'));
    } finally {
      setSavingPlant(false);
    }
  };

  const handleEditClick = (plant) => {
    setEditingPlantId(plant.id);
    setPlantForm({
      name: plant.name || '',
      crop: plant.crop || 'Tomato',
      variety: plant.variety || '',
      growth_stage: plant.growth_stage || 'Vegetative',
      planted_at: plant.planted_at ? plant.planted_at.slice(0, 10) : toDateInputValue(new Date()),
    });
    setError('');
    setSuccess('');
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteClick = async (plantId, plantName) => {
    if (!window.confirm(`Are you sure you want to delete "${plantName}"?`)) return;

    try {
      await API.delete(`/plants/${plantId}`);
      setPlants((currentPlants) => currentPlants.filter((p) => p.id !== plantId));
      setSuccess(`Plant "${plantName}" was deleted successfully.`);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to delete this plant.'));
    }
  };

  const handleCancel = () => {
    setPlantForm(createEmptyPlantForm());
    setEditingPlantId(null);
    setError('');
    setSuccess('');
  };

  const setPlantedAtDaysAgo = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    setPlantForm((currentForm) => ({
      ...currentForm,
      planted_at: toDateInputValue(date),
    }));
  };

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
          </button>
          <button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors duration-200 active:scale-95 relative" title="File Ingestion" type="button"><span className="material-symbols-outlined">upload_file</span></button>

          <button aria-current="page" className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface-container text-primary transition-colors duration-200 active:scale-95 relative" title="Plant Registry & Crop Systems" type="button">
            <span className="material-symbols-outlined font-bold">potted_plant</span>
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

        <main className="flex-1 p-8 max-w-[1600px] w-full mx-auto space-y-8" ref={formRef}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-outline font-label-md text-label-md mb-1.5">
                <span>AeroSense IoT</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span>Agriculture Grid</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-primary font-semibold">Plant Registry</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Plant Registry & Monitoring</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Register new botanical batches, set tracking telemetry, and configure autonomous sensor associations.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3.5 py-2 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                <span className="font-label-md text-label-md text-on-surface font-medium">{plants.length} Active Batches</span>
                <span className="text-outline text-label-sm">•</span>
                <span className="font-label-md text-label-md text-outline">Your plant registry</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            <div className="xl:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant/40 custom-shadow-card p-6 sm:p-8 space-y-7">
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">{editingPlantId ? 'edit_note' : 'add_chart'}</span>
                  </div>
                  <div>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                      {editingPlantId ? 'Edit Plant or Batch' : 'Add New Plant or Batch'}
                    </h2>
                    <p className="font-label-md text-label-md text-outline">
                      {editingPlantId ? 'Modify the crop details and update your registry.' : 'Enter the crop details, growth stage, and planting date for your registry.'}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                  {editingPlantId ? 'Editing mode' : 'Saved to your account'}
                </span>
              </div>

              {error && <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
              {success && <p className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-700" role="status">{success}</p>}

              <form className="space-y-6" id="plant-registry-form" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-label-md text-label-md font-semibold text-on-surface" htmlFor="plant-name">Plant / Batch Identifier</label>
                    <span className="font-label-sm text-label-sm text-outline">Required</span>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-outline text-[18px]">tag</span>
                    <input className="w-full pl-10 pr-4 py-2.5 bg-surface text-on-surface text-body-md font-medium rounded-lg border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none" id="plant-name" required type="text" value={plantForm.name} onChange={(event) => setPlantForm({ ...plantForm, name: event.target.value })} />
                  </div>
                  {!editingPlantId && (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-label-sm text-label-sm text-outline">A UUID is generated automatically; you can also edit it.</p>
                      <button
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-primary hover:bg-surface-container-low"
                        onClick={() => setPlantForm((currentForm) => ({ ...currentForm, name: createPlantIdentifier() }))}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        Generate UUID
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md font-semibold text-on-surface">Crop Type</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-3 text-outline text-[18px]">psychiatry</span>
                      <select className="w-full pl-10 pr-10 py-2.5 bg-surface text-on-surface text-body-md font-medium rounded-lg border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none appearance-none" id="crop-type" value={plantForm.crop} onChange={(event) => setPlantForm({ ...plantForm, crop: event.target.value })}>
                        <option value="Tomato">Tomato (Solanum lycopersicum)</option>
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
                      <button className="px-2 py-0.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] border border-outline-variant/30" onClick={() => setPlantForm({ ...plantForm, crop: 'Basil' })} type="button">Basil</button>
                      <button className="px-2 py-0.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] border border-outline-variant/30" onClick={() => setPlantForm({ ...plantForm, crop: 'Lettuce' })} type="button">Lettuce</button>
                      <button className="px-2 py-0.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-[11px] border border-outline-variant/30" onClick={() => setPlantForm({ ...plantForm, crop: 'Bell Pepper' })} type="button">Pepper</button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-md text-label-md font-semibold text-on-surface" htmlFor="cultivar-input">Variety / Cultivar</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-3 text-outline text-[18px]">local_florist</span>
                      <input className="w-full pl-10 pr-4 py-2.5 bg-surface text-on-surface text-body-md font-medium rounded-lg border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none" id="cultivar-input" placeholder="e.g. Cherokee Purple, Romaine Cos" type="text" value={plantForm.variety} onChange={(event) => setPlantForm({ ...plantForm, variety: event.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md font-semibold text-on-surface">Growth Stage Selector</label>
                    <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">autorenew</span> Auto-sets photoperiod & EC limits
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    <label className="cursor-pointer">
                      <input checked={plantForm.growth_stage === 'Germination'} className="peer sr-only" name="growth-stage" onChange={(event) => setPlantForm({ ...plantForm, growth_stage: event.target.value })} type="radio" value="Germination" />
                      <div className="p-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest peer-checked:border-primary peer-checked:bg-primary-fixed/25 peer-checked:shadow-sm text-center flex flex-col items-center gap-1.5 transition-all hover:bg-surface-container-low">
                        <span className="material-symbols-outlined text-outline peer-checked:text-primary">grain</span>
                        <span className="font-label-md text-label-md font-semibold text-on-surface">Germination</span>
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input checked={plantForm.growth_stage === 'Seedling'} className="peer sr-only" name="growth-stage" onChange={(event) => setPlantForm({ ...plantForm, growth_stage: event.target.value })} type="radio" value="Seedling" />
                      <div className="p-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest peer-checked:border-primary peer-checked:bg-primary-fixed/25 peer-checked:shadow-sm text-center flex flex-col items-center gap-1.5 transition-all hover:bg-surface-container-low">
                        <span className="material-symbols-outlined text-outline peer-checked:text-primary">spoke</span>
                        <span className="font-label-md text-label-md font-semibold text-on-surface">Seedling</span>
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input checked={plantForm.growth_stage === 'Vegetative'} className="peer sr-only" name="growth-stage" onChange={(event) => setPlantForm({ ...plantForm, growth_stage: event.target.value })} type="radio" value="Vegetative" />
                      <div className="p-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest peer-checked:border-primary peer-checked:bg-primary-fixed/25 peer-checked:shadow-sm text-center flex flex-col items-center gap-1.5 transition-all hover:bg-surface-container-low">
                        <span className="material-symbols-outlined text-outline peer-checked:text-primary">grass</span>
                        <span className="font-label-md text-label-md font-semibold text-on-surface">Vegetative</span>
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input checked={plantForm.growth_stage === 'Flowering'} className="peer sr-only" name="growth-stage" onChange={(event) => setPlantForm({ ...plantForm, growth_stage: event.target.value })} type="radio" value="Flowering" />
                      <div className="p-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest peer-checked:border-primary peer-checked:bg-primary-fixed/25 peer-checked:shadow-sm text-center flex flex-col items-center gap-1.5 transition-all hover:bg-surface-container-low">
                        <span className="material-symbols-outlined text-outline peer-checked:text-primary">filter_vintage</span>
                        <span className="font-label-md text-label-md font-semibold text-on-surface">Flowering</span>
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input checked={plantForm.growth_stage === 'Fruiting'} className="peer sr-only" name="growth-stage" onChange={(event) => setPlantForm({ ...plantForm, growth_stage: event.target.value })} type="radio" value="Fruiting" />
                      <div className="p-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest peer-checked:border-primary peer-checked:bg-primary-fixed/25 peer-checked:shadow-sm text-center flex flex-col items-center gap-1.5 transition-all hover:bg-surface-container-low">
                        <span className="material-symbols-outlined text-outline peer-checked:text-primary">nutrition</span>
                        <span className="font-label-md text-label-md font-semibold text-on-surface">Fruiting</span>
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input checked={plantForm.growth_stage === 'Harvest Ready'} className="peer sr-only" name="growth-stage" onChange={(event) => setPlantForm({ ...plantForm, growth_stage: event.target.value })} type="radio" value="Harvest Ready" />
                      <div className="p-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest peer-checked:border-primary peer-checked:bg-primary-fixed/25 peer-checked:shadow-sm text-center flex flex-col items-center gap-1.5 transition-all hover:bg-surface-container-low">
                        <span className="material-symbols-outlined text-outline peer-checked:text-primary">inventory_2</span>
                        <span className="font-label-md text-label-md font-semibold text-on-surface">Harvest</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 pt-1">
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md font-semibold text-on-surface">Planted At Date</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-3 text-outline text-[18px]">calendar_today</span>
                      <input className="w-full pl-10 pr-4 py-2.5 bg-surface text-on-surface text-body-md font-medium rounded-lg border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none" id="planting-date" type="date" value={plantForm.planted_at} onChange={(event) => setPlantForm({ ...plantForm, planted_at: event.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-outline-variant/30">
                  <button className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md font-medium transition-all duration-150 active:scale-95 text-center" onClick={handleCancel} type="button">
                    {editingPlantId ? 'Cancel Edit' : 'Cancel'}
                  </button>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md font-bold shadow-md shadow-primary/20 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60" disabled={savingPlant} type="submit">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      {savingPlant ? 'Saving Plant...' : editingPlantId ? 'Update Plant' : 'Save & Register Plant'}
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
                    <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
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
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 custom-shadow-card p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Recent Planted Crops & Active Batches</h2>
                <p className="font-label-md text-label-md text-outline">Plants saved to your account, with the newest registrations shown first.</p>
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-outline font-label-caps text-label-caps uppercase">
                    <th className="py-3 px-4 font-bold">Plant / Batch Name</th>
                    <th className="py-3 px-4 font-bold">Crop & Cultivar</th>
                    <th className="py-3 px-4 font-bold">Growth Stage</th>
                    <th className="py-3 px-4 font-bold">Planted At</th>
                    <th className="py-3 px-4 font-bold">User ID</th>
                    <th className="py-3 px-4 font-bold">Created At</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-body-md text-body-md">
                  {loadingPlants ? (
                    <tr><td className="py-6 px-4 text-center text-outline" colSpan={7}>Loading your plants...</td></tr>
                  ) : plantsError ? (
                    <tr><td className="py-6 px-4 text-center text-red-700" colSpan={7}>{plantsError}</td></tr>
                  ) : plants.length === 0 ? (
                    <tr><td className="py-6 px-4 text-center text-outline" colSpan={7}>No plants registered yet. Add one using the form above.</td></tr>
                  ) : plants.map((plant) => (
                    <tr className="hover:bg-surface-container-low/50 transition-colors" key={plant.id}>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-on-surface text-[14px]">{plant.name}</div>
                        <div className="text-[11px] text-outline font-label-sm">ID: {plant.id}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-on-surface">{plant.crop}</span>
                        {plant.variety && <div className="text-[11px] text-outline">{plant.variety}</div>}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant font-medium">
                        {plant.growth_stage || 'Not specified'}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant font-medium">
                        {plant.planted_at ? new Date(`${plant.planted_at}T00:00:00`).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant font-mono text-xs">
                        {plant.user_id}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant font-medium">
                        {plant.created_at ? new Date(plant.created_at).toLocaleString() : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleEditClick(plant)}
                            className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors"
                            title="Edit Plant"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(plant.id, plant.name)}
                            className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors"
                            title="Delete Plant"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30 text-label-md font-label-md text-outline">
              <span>Showing {plants.length} registered {plants.length === 1 ? 'plant' : 'plants'}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}