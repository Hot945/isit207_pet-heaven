let googleMapsPromise = null;
let loadedApiKey = null;

export function loadGoogleMapsApi(apiKey) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps can only be loaded in a browser environment.'));
  }

  const trimmedKey = (apiKey || '').trim();
  if (!trimmedKey) {
    return Promise.reject(new Error('MISSING_API_KEY'));
  }

  if (window.google?.maps?.Map) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise && loadedApiKey === trimmedKey) {
    return googleMapsPromise;
  }

  loadedApiKey = trimmedKey;
  googleMapsPromise = new Promise((resolve, reject) => {
    const callbackName = '__petHeavenInitGoogleMaps';
    const previousAuthFailure = window.gm_authFailure;

    const cleanup = () => {
      delete window[callbackName];
    };

    window.gm_authFailure = () => {
      googleMapsPromise = null;
      if (typeof previousAuthFailure === 'function') {
        previousAuthFailure();
      }
      reject(new Error('GOOGLE_MAPS_AUTH_FAILURE'));
    };

    window[callbackName] = () => {
      cleanup();
      if (window.google?.maps?.Map) {
        resolve(window.google.maps);
      } else {
        googleMapsPromise = null;
        reject(new Error('GOOGLE_MAPS_UNAVAILABLE'));
      }
    };

    const existingScript = document.querySelector('script[data-pet-heaven-gmaps="true"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.dataset.petHeavenGmaps = 'true';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(trimmedKey)}&v=weekly&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      cleanup();
      googleMapsPromise = null;
      reject(new Error('GOOGLE_MAPS_SCRIPT_LOAD_ERROR'));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
