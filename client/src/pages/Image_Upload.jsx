import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import API from '../services/app';

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  return typeof detail === 'string' ? detail : fallback;
};

const getImageUrl = (imagePath) => (
  new URL(imagePath, new URL(API.defaults.baseURL, window.location.origin)).toString()
);

export default function Image_Upload() {
  const [plants, setPlants] = useState([]);
  const [plantId, setPlantId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [detection, setDetection] = useState(null);
  const [loadingPlants, setLoadingPlants] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    API.get('/plants/mine')
      .then(({ data }) => {
        if (isMounted) {
          setPlants(data);
          setPlantId(data[0]?.id ?? '');
        }
      })
      .catch((requestError) => {
        if (isMounted) setError(getErrorMessage(requestError, 'Unable to load your plants.'));
      })
      .finally(() => {
        if (isMounted) setLoadingPlants(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileChange = (event) => {
    const [file] = event.target.files ?? [];
    setError('');
    setDetection(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      setSelectedFile(null);
      setError('Choose a JPG, PNG, or WEBP image.');
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleDetection = async () => {
    if (!plantId) {
      setError('Add a plant before running detection.');
      return;
    }
    if (!selectedFile) {
      setError('Choose an image before running detection.');
      return;
    }

    setError('');
    setDetecting(true);

    const formData = new FormData();
    formData.append('plant_id', plantId);
    formData.append('file', selectedFile);

    try {
      const { data } = await API.post('/diseases/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDetection(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Image detection failed. Please try again.'));
    } finally {
      setDetecting(false);
    }
  };

  const selectedPlant = plants.find((plant) => plant.id === plantId);

  return (
    <div className="w-full">
      <aside aria-label="Main Navigation" className="fixed left-0 top-0 z-40 flex h-screen w-[68px] flex-col items-center justify-between border-r border-outline-variant/30 bg-surface-container-lowest py-5 dark:bg-inverse-surface">
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-on-primary shadow-sm" title="AeroSense IoT">
            <span className="material-symbols-outlined">sensors</span>
          </div>
          <span className="mt-1 text-[9px] font-bold uppercase tracking-tight text-primary">v2.4</span>
        </div>
        <nav aria-label="Main Navigation" className="flex flex-col items-center gap-3">
          <Link className="flex h-11 w-11 items-center justify-center rounded-xl text-outline transition-colors hover:bg-surface-container-low hover:text-on-surface" to="/" title="Dashboard">
            <span className="material-symbols-outlined">dashboard</span>
          </Link>
          <Link aria-current="page" className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container text-primary ring-1 ring-primary/20" to="/image-analysis" title="Media Analysis">
            <span className="material-symbols-outlined">perm_media</span>
          </Link>
          <Link className="flex h-11 w-11 items-center justify-center rounded-xl text-outline transition-colors hover:bg-surface-container-low hover:text-on-surface" to="/knowledge-base" title="File Ingestion">
            <span className="material-symbols-outlined">upload_file</span>
          </Link>
          <Link className="flex h-11 w-11 items-center justify-center rounded-xl text-outline transition-colors hover:bg-surface-container-low hover:text-on-surface" to="/plants" title="Plant Registry">
            <span className="material-symbols-outlined">potted_plant</span>
          </Link>
          <Link className="flex h-11 w-11 items-center justify-center rounded-xl text-outline transition-colors hover:bg-surface-container-low hover:text-on-surface" to="/ai-chat" title="AI Assistant">
            <span className="material-symbols-outlined">smart_toy</span>
          </Link>
          <Link className="flex h-11 w-11 items-center justify-center rounded-xl text-outline transition-colors hover:bg-surface-container-low hover:text-on-surface" to="/iot-simulator" title="Telemetry Simulator">
            <span className="material-symbols-outlined">tune</span>
          </Link>
        </nav>
        <div className="flex w-full flex-col items-center gap-2 border-t border-outline-variant/30 px-2 pt-2">
          <LogoutButton className="flex h-11 w-11 items-center justify-center rounded-xl text-outline transition-colors hover:bg-error-container/40 hover:text-error" title="Logout" aria-label="Logout">
            <span className="material-symbols-outlined">logout</span>
          </LogoutButton>
        </div>
      </aside>

      <header className="sticky top-0 z-30 ml-[68px] flex w-[calc(100%-68px)] items-center justify-between border-b border-outline-variant/30 bg-surface-container-lowest/90 px-6 py-3.5 shadow-sm backdrop-blur-md dark:bg-inverse-surface/90">
        <div className="flex flex-col font-bold leading-tight tracking-tight text-on-surface dark:text-inverse-on-surface">
          <span>AeroSense</span>
          <span className="text-xs text-on-surface-variant">Telemetry</span>
        </div>
        <div className="hidden flex-1 justify-center px-6 md:flex">
          <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-semibold text-on-tertiary-fixed">
            {detecting ? 'Model inference running' : 'Disease detection'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">analytics</span>
          Vision Analysis
        </div>
      </header>

      <main className="ml-[68px] flex min-h-[calc(100vh-62px)] flex-col bg-surface xl:flex-row">
        <section className="flex max-w-[1540px] flex-1 flex-col gap-6 p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-outline-variant/30 pb-4 md:flex-row md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-on-surface">Image Upload &amp; Environmental Analysis</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed px-2.5 py-1 text-xs font-semibold text-on-tertiary-fixed">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tertiary"></span>
                  {detecting ? 'Inference in progress' : 'Pipeline Ready'}
                </span>
              </div>
              <p className="mt-1 text-sm text-on-surface-variant">
                Upload a plant image, run the model, and review the saved detection with its annotated bounding boxes.
              </p>
            </div>
          </div>

          {error && <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

          {!loadingPlants && plants.length === 0 && (
            <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 text-sm text-on-surface-variant">
              Register a plant before running detection. <Link className="font-semibold text-primary underline" to="/plants">Open Plant Registry</Link>
            </div>
          )}

          <div className="group relative overflow-hidden rounded-xl border-2 border-dashed border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm transition-colors hover:border-primary">
            <div className="pointer-events-none absolute inset-0 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div className="relative z-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-surface-container text-primary ring-1 ring-primary/20">
                  <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                </div>
                <div>
                  <h2 className="font-bold text-on-surface">Upload a plant image for detection</h2>
                  <p className="mt-1 text-xs text-on-surface-variant">Supported formats: JPG, PNG, WEBP.</p>
                  {selectedFile && <p className="mt-1 max-w-md truncate text-xs font-semibold text-primary">{selectedFile.name}</p>}
                </div>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary shadow-sm transition-colors hover:bg-primary-container">
                <span className="material-symbols-outlined text-sm">folder_open</span>
                Browse Files
                <input
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={detecting}
                  onChange={handleFileChange}
                  type="file"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-sm lg:p-6">
            <div className="flex flex-col justify-between gap-3 border-b border-outline-variant/30 pb-3 md:flex-row md:items-center">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-bold text-on-surface">Plant Detection Results &amp; Annotations</h2>
                {detection && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary-fixed px-2.5 py-1 text-xs font-semibold text-on-tertiary-fixed">
                    <span className="h-1.5 w-1.5 rounded-full bg-tertiary"></span>
                    Detection saved
                  </span>
                )}
              </div>
              {detection && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-outline-variant/30 bg-surface-container-low px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
                  <span className="material-symbols-outlined text-xs text-primary">verified</span>
                  Confidence: {(Number(detection.confidence) * 100).toFixed(2)}%
                </span>
              )}
            </div>

            <div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-dim">
              {detection?.image_path ? (
                <img
                  alt={`Annotated model result: ${detection.crop} - ${detection.disease}`}
                  className="block max-h-[460px] w-full object-contain"
                  src={getImageUrl(detection.image_path)}
                />
              ) : (
                <div className="p-8 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-outline">image_search</span>
                  <p className="mt-2 text-sm">{detecting ? 'Analyzing image and saving result...' : 'Your annotated detection image will appear here.'}</p>
                </div>
              )}
            </div>
            {detection && (
              <div className="grid gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 text-sm sm:grid-cols-3" aria-live="polite">
                <div>
                  <span className="block text-xs text-outline">Crop</span>
                  <span className="font-semibold text-on-surface">{detection.crop}</span>
                </div>
                <div>
                  <span className="block text-xs text-outline">Detected disease</span>
                  <span className="font-semibold text-on-surface">{detection.disease}</span>
                </div>
                <div>
                  <span className="block text-xs text-outline">Detection time</span>
                  <span className="font-semibold text-on-surface">{new Date(detection.detected_at).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside aria-label="Detection Metadata Panel" className="flex w-full flex-col justify-between gap-6 border-t border-outline-variant/40 bg-surface-container-lowest p-6 xl:w-[380px] xl:border-l xl:border-t-0">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                <h2 className="font-bold text-on-surface">Telemetry Metadata</h2>
              </div>
              <span className="rounded bg-surface-container px-2 py-0.5 text-[10px] font-bold text-primary">
                {detection ? 'SAVED' : 'READY'}
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-outline-variant/40 bg-surface-container-low p-3.5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-dim">
                {selectedFile ? (
                  <span className="material-symbols-outlined text-primary">image</span>
                ) : (
                  <span className="material-symbols-outlined text-outline">image</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-on-surface">{selectedFile?.name ?? 'No image selected'}</div>
                <div className="text-[11px] text-outline">
                  {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Choose an image to begin'}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-outline" htmlFor="detection-plant">Select Plant</label>
              <select
                className="w-full rounded-lg border border-outline-variant/60 bg-surface px-3 py-2.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                disabled={loadingPlants || plants.length === 0 || detecting}
                id="detection-plant"
                onChange={(event) => setPlantId(event.target.value)}
                value={plantId}
              >
                {loadingPlants && <option value="">Loading your plants...</option>}
                {!loadingPlants && plants.length === 0 && <option value="">No plants registered</option>}
                {!loadingPlants && plants.map((plant) => (
                  <option key={plant.id} value={plant.id}>{plant.name} — {plant.crop}</option>
                ))}
              </select>
              {selectedPlant && <p className="mt-2 break-all text-[11px] text-outline">Plant ID: {selectedPlant.id}</p>}
            </div>

            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-outline">Detection Result</h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between rounded-lg border border-outline-variant/20 bg-surface px-3 py-2">
                  <span className="text-sm text-on-surface-variant">Crop</span>
                  <span className="text-sm font-semibold text-on-surface">{detection?.crop ?? selectedPlant?.crop ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-outline-variant/20 bg-surface px-3 py-2">
                  <span className="text-sm text-on-surface-variant">Disease</span>
                  <span className="max-w-[60%] truncate text-right text-sm font-semibold text-on-surface">{detection?.disease ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-outline-variant/20 bg-surface px-3 py-2">
                  <span className="text-sm text-on-surface-variant">Confidence</span>
                  <span className="text-sm font-semibold text-on-surface">
                    {detection ? `${(Number(detection.confidence) * 100).toFixed(2)}%` : '—'}
                  </span>
                </div>
              </div>
            </div>

            {plants.length === 0 && !loadingPlants && (
              <Link className="text-sm font-semibold text-primary underline" to="/plants">Register a plant before detection</Link>
            )}
          </div>

          <div className="border-t border-outline-variant/30 pt-4">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-4 py-2.5 text-sm font-bold text-on-primary shadow-sm transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={detecting || loadingPlants || plants.length === 0 || !selectedFile}
              onClick={handleDetection}
              type="button"
            >
              <span className="material-symbols-outlined text-base">psychology</span>
              {detecting ? 'Running Detection...' : 'Run Model Detection'}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
