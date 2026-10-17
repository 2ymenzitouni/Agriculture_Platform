import { useEffect, useState, useRef } from 'react';
import LogoutButton from '../components/LogoutButton';
import API from '../services/app';

// Helper functions for random generation
const getRandomTemp = () => +(Math.random() * (35 - 15) + 15).toFixed(1);
const getRandomHumidity = () => Math.floor(Math.random() * (90 - 30) + 30);
const getRandomWaterTemp = () => +(Math.random() * (28 - 18) + 18).toFixed(1);
const getRandomWaterLevel = () => +(Math.random() * (100 - 20) + 20).toFixed(1);
const getRandomPh = () => +(Math.random() * (8.0 - 5.5) + 5.5).toFixed(2);
const getRandomEc = () => +(Math.random() * (2.8 - 0.8) + 0.8).toFixed(2);
const getRandomLux = () => Math.floor(Math.random() * (35000 - 1000) + 1000);

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  return typeof detail === 'string' ? detail : fallback;
};

export default function IoT_Simulator() {
  const [plants, setPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [loadingPlants, setLoadingPlants] = useState(true);
  const [plantsError, setPlantsError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [readings, setReadings] = useState([]);
  const [loadedReadingsPlantId, setLoadedReadingsPlantId] = useState('');
  const [readingsError, setReadingsError] = useState('');
  const [readingActionError, setReadingActionError] = useState('');
  const [savingReading, setSavingReading] = useState(false);
  const [lastDispatchAt, setLastDispatchAt] = useState('');

  // Sensor state initialized randomly on every page reload
  const [temperature, setTemperature] = useState(getRandomTemp);
  const [humidity, setHumidity] = useState(getRandomHumidity);
  const [waterTemp, setWaterTemp] = useState(getRandomWaterTemp);
  const [waterLevel, setWaterLevel] = useState(getRandomWaterLevel);
  const [ph, setPh] = useState(getRandomPh);
  const [ec, setEc] = useState(getRandomEc);
  const [lux, setLux] = useState(getRandomLux);

  const topSelectorRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    API.get('/plants/mine')
      .then(({ data }) => {
        if (isMounted) {
          setPlants(data);
          setSelectedPlantId((currentId) => currentId || data[0]?.id || '');
        }
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

  useEffect(() => {
    if (!selectedPlantId) return undefined;

    let isMounted = true;

    API.get(`/sensors/sensor-readings/plant/${selectedPlantId}`)
      .then(({ data }) => {
        if (isMounted) {
          setReadings(data);
          setReadingsError('');
          setLoadedReadingsPlantId(selectedPlantId);
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setReadingsError(getErrorMessage(requestError, 'Unable to load sensor readings.'));
          setReadings([]);
          setLoadedReadingsPlantId(selectedPlantId);
        }
      })

    return () => {
      isMounted = false;
    };
  }, [selectedPlantId]);

  const loadingReadings = Boolean(selectedPlantId)
    && loadedReadingsPlantId !== selectedPlantId;

  const handleEditClick = (plant) => {
    setSelectedPlantId(plant.id);
    setActionSuccess(`Selected "${plant.name}" as target plant.`);
    topSelectorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteClick = async (plantId, plantName) => {
    if (!window.confirm(`Are you sure you want to delete "${plantName}"?`)) return;

    try {
      await API.delete(`/plants/${plantId}`);
      setPlants((currentPlants) => currentPlants.filter((p) => p.id !== plantId));
      if (selectedPlantId === plantId) {
        setSelectedPlantId('');
      }
      setActionSuccess(`Plant "${plantName}" deleted successfully.`);
    } catch (requestError) {
      setPlantsError(getErrorMessage(requestError, 'Unable to delete this plant.'));
    }
  };

  const randomizeAll = () => {
    setTemperature(getRandomTemp());
    setHumidity(getRandomHumidity());
    setWaterTemp(getRandomWaterTemp());
    setWaterLevel(getRandomWaterLevel());
    setPh(getRandomPh());
    setEc(getRandomEc());
    setLux(getRandomLux());
  };

  const randomizeTemp = () => setTemperature(getRandomTemp());
  const randomizeHumidity = () => setHumidity(getRandomHumidity());
  const randomizeWaterTemp = () => setWaterTemp(getRandomWaterTemp());
  const randomizeWaterLevel = () => setWaterLevel(getRandomWaterLevel());
  const randomizePh = () => setPh(getRandomPh());
  const randomizeEc = () => setEc(getRandomEc());
  const randomizeLux = () => setLux(getRandomLux());

  const sendReading = async () => {
    if (!selectedPlantId) {
      setPlantsError('Select a registered plant before sending sensor data.');
      return;
    }

    setSavingReading(true);
    setReadingActionError('');
    setActionSuccess('');

    try {
      const { data: reading } = await API.post('/sensors/sensor-readings/', {
        plant_id: selectedPlantId,
        temperature,
        humidity,
        water_temperature: waterTemp,
        water_level: waterLevel,
        ph,
        tds: +(ec * 500).toFixed(2),
        light: lux,
      });
      setReadings((currentReadings) => [
        reading,
        ...currentReadings.filter((currentReading) => currentReading.id !== reading.id),
      ]);
      setLastDispatchAt(new Date(reading.recorded_at).toLocaleString());
      setActionSuccess('Sensor reading saved successfully.');
    } catch (requestError) {
      setReadingActionError(getErrorMessage(requestError, 'Unable to save sensor reading.'));
    } finally {
      setSavingReading(false);
    }
  };

  const payloadString = JSON.stringify({
    deviceId: "AEROSENSE-NODE-04",
    firmware: "v2.4.1",
    timestamp: new Date().toISOString(),
    plantId: selectedPlantId || null,
    metrics: {
      temperature_c: temperature,
      humidity_pct: humidity,
      water_temperature_c: waterTemp,
      water_level_cm: waterLevel,
      ph_val: ph,
      ec_ms_cm: ec,
      tds_ppm: +(ec * 500).toFixed(2),
      light_lux: lux
    },
    status: "SIMULATED_NOMINAL",
    rssi: -58
  }, null, 2);

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
          </a>
          <button className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95" title="Plant Registry &amp; Crop Systems">
            <span className="material-symbols-outlined" data-icon="potted_plant">potted_plant</span>
          </button>

          <a className="flex items-center justify-center w-11 h-11 rounded-xl text-outline dark:text-outline-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container transition-all duration-200 active:scale-95" href="#" title="AI Assistant">
            <span className="material-symbols-outlined" data-icon="smart_toy">smart_toy</span>
          </a>

          <a className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface-container dark:bg-primary/20 text-primary dark:text-inverse-primary transition-all duration-200 active:scale-95 shadow-sm" href="#" title="Telemetry Simulator">
            <span className="material-symbols-outlined" data-icon="tune">tune</span>
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
        <header className="sticky top-0 z-30 bg-surface-container-lowest/90 dark:bg-inverse-surface/90 backdrop-blur-md border-b border-outline-variant/30 dark:border-outline/20 px-6 py-3.5 flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <div className="flex flex-col leading-tight">
              <span className="text-headline-md font-headline-md font-bold text-on-surface dark:text-inverse-on-surface">AeroSense</span>
              <span className="text-label-caps font-label-caps text-outline uppercase tracking-wider font-bold">Telemetry</span>
            </div>
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
              <span>Export Data</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-container flex items-center justify-center font-bold text-label-md border border-outline-variant/30" title="Administrator profile">
              AD
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1 space-y-6">
          {/* Target Plant Selector Bar */}
          <section ref={topSelectorRef} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 card-shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-lg" data-icon="potted_plant">potted_plant</span>
              </div>
              <div>
                <h3 className="text-headline-md font-headline-md text-on-surface text-sm font-bold">Target Plant Association</h3>
                <p className="text-label-sm font-label-sm text-outline">Select the registered plant batch for telemetry stream injection</p>
              </div>
            </div>
            <div className="w-full sm:w-72">
              <select
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary"
                value={selectedPlantId}
                onChange={(e) => setSelectedPlantId(e.target.value)}
                disabled={loadingPlants}
              >
                {loadingPlants ? (
                  <option value="">Loading plants...</option>
                ) : plants.length === 0 ? (
                  <option value="">No plants available</option>
                ) : (
                  plants.map((plant) => (
                    <option key={plant.id} value={plant.id}>
                      {plant.name} ({plant.crop})
                    </option>
                  ))
                )}
              </select>
            </div>
          </section>

          {actionSuccess && (
            <div className="p-3 bg-green-50 border border-green-300 text-green-700 rounded-lg text-xs flex justify-between items-center">
              <span>{actionSuccess}</span>
              <button onClick={() => setActionSuccess('')} className="text-green-700 hover:text-green-900 font-bold">✕</button>
            </div>
          )}
          {readingActionError && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-700" role="alert">
              {readingActionError}
            </div>
          )}

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

                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-body-md font-body-md font-semibold hover:bg-surface-container-low active:scale-95 transition-all shadow-sm" 
                  id="btn-shuffle-all"
                  onClick={randomizeAll}
                >
                  <span className="material-symbols-outlined text-primary text-lg" data-icon="shuffle">shuffle</span>
                  <span>Shuffle Parameters</span>
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Temperature */}
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
                    <button className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-low transition-colors" title="Randomize Temperature" onClick={randomizeTemp}>
                      <span className="material-symbols-outlined text-base" data-icon="cached">cached</span>
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between my-2">
                    <span className="text-display-metric font-display-metric text-on-surface" id="temp-display">{temperature}<span className="text-headline-md font-headline-md text-outline ml-1">°C</span></span>
                    <div className="flex items-center gap-1.5">
                      <label className="text-label-caps font-label-caps text-outline">MANUAL</label>
                      <input 
                        className="w-20 px-2 py-1 text-right text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface" 
                        max="45" min="10" step="0.1" type="number" 
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-label-sm font-label-sm text-outline">
                      <span>10.0 °C</span>
                      <span className="text-tertiary font-medium">Nominal: 22 - 26 °C</span>
                      <span>45.0 °C</span>
                    </div>
                    <input 
                      className="w-full h-2 bg-surface-container rounded-lg cursor-pointer" 
                      max="45.0" min="10.0" step="0.1" type="range" 
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-label-sm font-label-sm">
                  <span className="text-outline">Sensor: DHT22 #A01</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-medium">Calibrated ±0.2°</span>
                </div>
              </div>

              {/* Humidity */}
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
                    <button className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-low transition-colors" title="Randomize Humidity" onClick={randomizeHumidity}>
                      <span className="material-symbols-outlined text-base" data-icon="cached">cached</span>
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between my-2">
                    <span className="text-display-metric font-display-metric text-on-surface" id="humid-display">{humidity}<span className="text-headline-md font-headline-md text-outline ml-1">% RH</span></span>
                    <div className="flex items-center gap-1.5">
                      <label className="text-label-caps font-label-caps text-outline">MANUAL</label>
                      <input 
                        className="w-20 px-2 py-1 text-right text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface" 
                        max="100" min="10" step="1" type="number" 
                        value={humidity}
                        onChange={(e) => setHumidity(parseInt(e.target.value, 10) || 0)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-label-sm font-label-sm text-outline">
                      <span>Dry (20%)</span>
                      <span className="text-secondary font-medium">Optimal: 60-75%</span>
                      <span>Saturated (100%)</span>
                    </div>
                    <input 
                      className="w-full h-2 bg-surface-container rounded-lg cursor-pointer" 
                      max="100" min="10" step="1" type="range" 
                      value={humidity}
                      onChange={(e) => setHumidity(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-label-sm font-label-sm">
                  <span className="text-outline">Dew Point: 18.2 °C</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-container font-medium">Stable</span>
                </div>
              </div>

              {/* Water Temperature */}
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
                    <button className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-low transition-colors" title="Randomize Water Temp" onClick={randomizeWaterTemp}>
                      <span className="material-symbols-outlined text-base" data-icon="cached">cached</span>
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between my-2">
                    <span className="text-display-metric font-display-metric text-on-surface" id="watertemp-display">{waterTemp}<span className="text-headline-md font-headline-md text-outline ml-1">°C</span></span>
                    <div className="flex items-center gap-1.5">
                      <label className="text-label-caps font-label-caps text-outline">MANUAL</label>
                      <input 
                        className="w-20 px-2 py-1 text-right text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface" 
                        max="35" min="10" step="0.1" type="number" 
                        value={waterTemp}
                        onChange={(e) => setWaterTemp(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-label-sm font-label-sm text-outline">
                      <span>10.0 °C</span>
                      <span className="text-tertiary font-medium">Target: 19.0 - 22.0 °C</span>
                      <span>35.0 °C</span>
                    </div>
                    <input 
                      className="w-full h-2 bg-surface-container rounded-lg cursor-pointer" 
                      max="35.0" min="10.0" step="0.1" type="range" 
                      value={waterTemp}
                      onChange={(e) => setWaterTemp(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-label-sm font-label-sm">
                  <span className="text-outline">Probe: DS18B20 Submersible</span>
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-medium">Cooler Idle</span>
                </div>
              </div>

              {/* Water Level */}
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
                    <button className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-low transition-colors" title="Randomize Water Level" onClick={randomizeWaterLevel}>
                      <span className="material-symbols-outlined text-base" data-icon="cached">cached</span>
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between my-2">
                    <div>
                      <span className="text-display-metric font-display-metric text-on-surface" id="waterlevel-display">{waterLevel}<span className="text-headline-md font-headline-md text-outline ml-1">cm</span></span>
                      <span className="text-label-md font-label-md text-secondary ml-2 font-semibold" id="waterlevel-pct">({Math.round(waterLevel)}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-label-caps font-label-caps text-outline">MANUAL</label>
                      <input 
                        className="w-20 px-2 py-1 text-right text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface" 
                        max="100" min="0" step="0.5" type="number" 
                        value={waterLevel}
                        onChange={(e) => setWaterLevel(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden flex">
                      <div className="bg-secondary h-full rounded-full transition-all duration-300" id="tank-progress-bar" style={{ width: `${waterLevel}%` }}></div>
                    </div>
                    <div className="flex justify-between text-label-sm font-label-sm text-outline">
                      <span>0 cm (Empty)</span>
                      <span>Threshold Alarm: &lt; 25 cm</span>
                      <span>100 cm (Max)</span>
                    </div>
                    <input 
                      className="w-full h-2 bg-surface-container rounded-lg cursor-pointer" 
                      max="100.0" min="0.0" step="0.5" type="range" 
                      value={waterLevel}
                      onChange={(e) => setWaterLevel(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-label-sm font-label-sm">
                  <span className="text-outline">Ultrasonic HC-SR04</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-secondary-container font-medium">Nominal Volume</span>
                </div>
              </div>

              {/* pH */}
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
                    <button className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-low transition-colors" title="Randomize pH" onClick={randomizePh}>
                      <span className="material-symbols-outlined text-base" data-icon="cached">cached</span>
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between my-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-display-metric font-display-metric text-on-surface" id="ph-display">{typeof ph === 'number' ? ph.toFixed(2) : ph}</span>
                      <span className="text-label-md font-label-md px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-semibold" id="ph-badge">
                        {ph < 6 ? 'Acidic' : ph > 7.2 ? 'Alkaline' : 'Optimal'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-label-caps font-label-caps text-outline">MANUAL</label>
                      <input 
                        className="w-20 px-2 py-1 text-right text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface" 
                        max="10.0" min="4.0" step="0.05" type="number" 
                        value={ph}
                        onChange={(e) => setPh(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <div className="w-full h-2 rounded-full overflow-hidden flex bg-surface-container">
                      <div className="h-full w-1/3 bg-error opacity-80" title="Acidic (4.0-6.0)"></div>
                      <div className="h-full w-1/3 bg-tertiary-fixed opacity-90" title="Ideal (6.0-7.2)"></div>
                      <div className="h-full w-1/3 bg-secondary-container opacity-80" title="Alkaline (7.2-9.0)"></div>
                    </div>
                    <div className="flex justify-between text-label-sm font-label-sm text-outline">
                      <span>Acidic (4.0)</span>
                      <span className="text-tertiary font-bold">Ideal 5.8 - 6.5</span>
                      <span>Alkaline (9.0)</span>
                    </div>
                    <input 
                      className="w-full h-2 bg-surface-container rounded-lg cursor-pointer" 
                      max="9.0" min="4.0" step="0.05" type="range" 
                      value={ph}
                      onChange={(e) => setPh(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-label-sm font-label-sm">
                  <span className="text-outline">Electrode BNC: Glass Bulb</span>
                  <span className="text-outline-variant font-mono text-label-sm">Offset: +0.03mV</span>
                </div>
              </div>

              {/* EC */}
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
                    <button className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-low transition-colors" title="Randomize EC" onClick={randomizeEc}>
                      <span className="material-symbols-outlined text-base" data-icon="cached">cached</span>
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between my-2">
                    <span className="text-display-metric font-display-metric text-on-surface" id="ec-display">{typeof ec === 'number' ? ec.toFixed(2) : ec}<span className="text-headline-md font-headline-md text-outline ml-1">mS/cm</span></span>
                    <div className="flex items-center gap-1.5">
                      <label className="text-label-caps font-label-caps text-outline">MANUAL</label>
                      <input 
                        className="w-20 px-2 py-1 text-right text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface" 
                        max="3.5" min="0.2" step="0.05" type="number" 
                        value={ec}
                        onChange={(e) => setEc(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-label-sm font-label-sm text-outline">
                      <span>0.2 mS</span>
                      <span className="text-tertiary font-medium">Optimal: 1.4 - 2.2 mS/cm</span>
                      <span>3.5 mS</span>
                    </div>
                    <input 
                      className="w-full h-2 bg-surface-container rounded-lg cursor-pointer" 
                      max="3.5" min="0.2" step="0.05" type="range" 
                      value={ec}
                      onChange={(e) => setEc(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-label-sm font-label-sm">
                  <span className="text-outline">TDS Approx: ~{Math.round(ec * 500)} ppm</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-tertiary font-medium">Vegetative State</span>
                </div>
              </div>

              {/* Light */}
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
                      <button className="p-1 rounded-md text-outline hover:text-primary hover:bg-surface-container-low transition-colors" title="Randomize Light" onClick={randomizeLux}>
                        <span className="material-symbols-outlined text-base" data-icon="cached">cached</span>
                      </button>
                    </div>
                    <div className="flex items-baseline justify-between my-2">
                      <span className="text-display-metric font-display-metric text-on-surface" id="lux-display">{lux.toLocaleString()}<span className="text-headline-md font-headline-md text-outline ml-1">Lux</span></span>
                      <div className="flex items-center gap-1.5">
                        <label className="text-label-caps font-label-caps text-outline">MANUAL</label>
                        <input 
                          className="w-24 px-2 py-1 text-right text-body-md font-body-md bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary text-on-surface" 
                          max="40000" min="0" step="100" type="number" 
                          value={lux}
                          onChange={(e) => setLux(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-label-sm font-label-sm text-outline">
                        <span>0 Lux (Dark)</span>
                        <span className="text-primary font-medium">85% Canopy Saturation</span>
                        <span>40,000 Lux</span>
                      </div>
                      <input 
                        className="w-full h-2 bg-surface-container rounded-lg cursor-pointer" 
                        max="40000" min="0" step="100" type="range" 
                        value={lux}
                        onChange={(e) => setLux(parseInt(e.target.value, 10) || 0)}
                      />
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-label-md font-label-md text-on-surface mb-2">
                      <span className="font-semibold">Photoperiod Activity</span>
                      <span className="text-primary font-mono" id="par-reading">PAR: {Math.round(lux * 0.025)} µmol/m²/s</span>
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
                      <span>BH1750 Ambient Sensor</span>
                      <span>Spectrum: Full LED Array</span>
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
                  <button 
                    className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors" 
                    id="copy-json-btn" 
                    title="Copy to Clipboard"
                    onClick={() => navigator.clipboard.writeText(payloadString)}
                  >
                    <span className="material-symbols-outlined text-lg" data-icon="content_copy">content_copy</span>
                  </button>
                </div>

                <div className="my-3 flex-1 bg-inverse-surface rounded-xl p-4 overflow-x-auto border border-outline/30 text-surface-variant">
                  <pre className="text-xs leading-relaxed"><code className="text-emerald-300 font-mono" id="json-preview">{payloadString}</code></pre>
                </div>

                <div className="space-y-2 text-label-sm font-label-sm pt-2">
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Broker Endpoint:</span>
                    <span className="font-mono text-on-surface font-semibold">mqtt://aerosense.local:1883</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Topic:</span>
                    <span className="font-mono text-primary font-semibold">/telemetry/node_04/inputs</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Packet Size:</span>
                    <span className="font-mono text-on-surface" id="payload-size">{payloadString.length} bytes</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Last Dispatch:</span>
                    <span className="font-mono text-tertiary font-semibold" id="last-dispatch-time">{lastDispatchAt || 'No dispatch yet'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-outline-variant/20">
                  <button
                    className="w-full py-2.5 px-4 rounded-lg bg-surface-container text-primary font-bold text-body-md font-body-md hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={savingReading || loadingPlants || !selectedPlantId}
                    onClick={sendReading}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg" data-icon="publish">publish</span>
                    <span>{savingReading ? 'Saving Reading...' : 'Send Packet Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Plant Details Table at the Bottom */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 card-shadow p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-headline-md font-headline-md font-bold text-on-surface">Registered Plants &amp; Batches</h2>
                <p className="text-label-md font-label-md text-outline">Manage active plant registry details and telemetry associations.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-surface-container text-primary font-label-sm text-xs font-semibold">
                  {plants.length} Registered {plants.length === 1 ? 'Plant' : 'Plants'}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-outline font-label-caps text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Plant / Batch Identifier</th>
                    <th className="py-3 px-4 font-bold">Crop &amp; Variety</th>
                    <th className="py-3 px-4 font-bold">Growth Stage</th>
                    <th className="py-3 px-4 font-bold">Planted Date</th>
                    <th className="py-3 px-4 font-bold">User ID</th>
                    <th className="py-3 px-4 font-bold">Created At</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-body-md text-sm">
                  {loadingPlants ? (
                    <tr>
                      <td colSpan={7} className="py-6 px-4 text-center text-outline">Loading registered plants...</td>
                    </tr>
                  ) : plantsError ? (
                    <tr>
                      <td colSpan={7} className="py-6 px-4 text-center text-red-700">{plantsError}</td>
                    </tr>
                  ) : plants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 px-4 text-center text-outline">No plants registered yet.</td>
                    </tr>
                  ) : (
                    plants.map((plant) => (
                      <tr key={plant.id} className={`hover:bg-surface-container-low/50 transition-colors ${selectedPlantId === plant.id ? 'bg-primary-container/10' : ''}`}>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-on-surface text-sm flex items-center gap-2">
                            {plant.name}
                            {selectedPlantId === plant.id && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary text-on-primary font-semibold uppercase">Target</span>
                            )}
                          </div>
                          <div className="text-[11px] text-outline font-mono">ID: {plant.id}</div>
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
                        <td className="py-3.5 px-4 text-on-surface-variant text-xs">
                          {plant.created_at ? new Date(plant.created_at).toLocaleString() : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleEditClick(plant)}
                              className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors"
                              title="Select / Edit Plant"
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 card-shadow p-6 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-headline-md font-headline-md font-bold text-on-surface">Saved Sensor Readings</h2>
                <p className="text-label-md font-label-md text-outline">
                  {plants.find((plant) => plant.id === selectedPlantId)?.name ?? 'Select a plant'} · newest readings first
                </p>
              </div>
              <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-primary">
                {readings.length} {readings.length === 1 ? 'Reading' : 'Readings'}
              </span>
            </div>

            {readingsError && (
              <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700" role="alert">
                {readingsError}
              </p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-xs uppercase tracking-wider text-outline">
                    <th className="px-3 py-3 font-bold">Recorded At</th>
                    <th className="px-3 py-3 font-bold">Temperature °C</th>
                    <th className="px-3 py-3 font-bold">Humidity %</th>
                    <th className="px-3 py-3 font-bold">Water Temp °C</th>
                    <th className="px-3 py-3 font-bold">Water Level</th>
                    <th className="px-3 py-3 font-bold">pH</th>
                    <th className="px-3 py-3 font-bold">TDS ppm</th>
                    <th className="px-3 py-3 font-bold">Light Lux</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 text-sm">
                  {loadingReadings ? (
                    <tr><td className="px-3 py-6 text-center text-outline" colSpan={8}>Loading sensor readings...</td></tr>
                  ) : readingsError ? (
                    <tr><td className="px-3 py-6 text-center text-outline" colSpan={8}>Unable to display readings.</td></tr>
                  ) : !selectedPlantId ? (
                    <tr><td className="px-3 py-6 text-center text-outline" colSpan={8}>Select a plant to view its sensor readings.</td></tr>
                  ) : readings.length === 0 ? (
                    <tr><td className="px-3 py-6 text-center text-outline" colSpan={8}>No sensor readings saved for this plant yet.</td></tr>
                  ) : readings.map((reading) => (
                    <tr className="hover:bg-surface-container-low/50" key={reading.id}>
                      <td className="whitespace-nowrap px-3 py-3 text-on-surface-variant">
                        {new Date(reading.recorded_at).toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-on-surface">{reading.temperature ?? '—'}</td>
                      <td className="px-3 py-3 text-on-surface">{reading.humidity ?? '—'}</td>
                      <td className="px-3 py-3 text-on-surface">{reading.water_temperature ?? '—'}</td>
                      <td className="px-3 py-3 text-on-surface">{reading.water_level ?? '—'}</td>
                      <td className="px-3 py-3 text-on-surface">{reading.ph ?? '—'}</td>
                      <td className="px-3 py-3 text-on-surface">{reading.tds ?? '—'}</td>
                      <td className="px-3 py-3 text-on-surface">{reading.light ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}