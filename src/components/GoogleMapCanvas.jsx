import { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsApi } from '../utils/googleMapsLoader';
import './GoogleMapCanvas.css';

const DEFAULT_COORDS = { lat: 1.3752, lng: 103.7294 };

const KNOWN_LOCATIONS = [
  { match: '50 sungei tengah', coords: { lat: 1.3752, lng: 103.7294 } },
  { match: '59 sungei tengah', coords: { lat: 1.3758, lng: 103.7298 } },
  { match: '61 sungei tengah', coords: { lat: 1.3760, lng: 103.7301 } },
  { match: 'pasir ris drive 1', coords: { lat: 1.3788, lng: 103.9395 } },
  { match: 'lim chu kang lane 1', coords: { lat: 1.4342, lng: 103.7118 } },
  { match: 'bishan community hub', coords: { lat: 1.3514, lng: 103.8482 } },
  { match: 'ang mo kio ave 10', coords: { lat: 1.3679, lng: 103.8548 } },
];

const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#1e1530' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1e1530' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#b7a8cb' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#e3c8f2' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#b7a8cb' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#21263d' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#33244c' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#261a3b' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#4d2b6c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#130e22' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#796c91' }] },
];

function resolveKnownCoords(address) {
  const normalized = (address || '').toLowerCase();
  const matched = KNOWN_LOCATIONS.find((item) => normalized.includes(item.match));
  return matched ? matched.coords : null;
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildLiveEmbedUrl(address, zoom) {
  const normalized = (address || '').toLowerCase();
  if (normalized.includes('50 sungei tengah')) {
    return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.66!2d103.7294!3d1.3752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da11df1d09dee5%3A0x1216bc9c47dc7028!2s50%20Sungei%20Tengah%20Rd%2C%20Singapore%20699012!5e0!3m2!1sen!2ssg!4v1700000000000';
  }
  return `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${encodeURIComponent(address)}!6i${zoom}`;
}

export default function GoogleMapCanvas({
  address = '50 Sungei Tengah Road, Singapore 699012',
  title = 'Pet Heaven Sanctuary',
  coordinates,
  zoom = 15,
  className = '',
}) {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
  const requestKey = `${apiKey}::${address}::${title}::${coordinates?.lat ?? ''}::${coordinates?.lng ?? ''}::${zoom}`;
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loadResult, setLoadResult] = useState({ key: '', state: 'loading' });

  const status = !apiKey
    ? 'embed-fallback'
    : loadResult.key === requestKey
      ? loadResult.state
      : 'loading';

  useEffect(() => {
    if (!apiKey) {
      return undefined;
    }

    let isCancelled = false;

    loadGoogleMapsApi(apiKey)
      .then((maps) => {
        if (isCancelled || !containerRef.current) return;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const initialCoords = coordinates || resolveKnownCoords(address) || DEFAULT_COORDS;

        const map = new maps.Map(containerRef.current, {
          center: initialCoords,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: isDark ? DARK_MAP_STYLES : undefined,
        });

        mapInstanceRef.current = map;

        const marker = new maps.Marker({
          position: initialCoords,
          map,
          title,
          animation: maps.Animation.DROP,
        });

        const externalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        const infoWindow = new maps.InfoWindow({
          content: `
            <div class="gmap-infowindow">
              <div class="gmap-infowindow-title">${escapeHtml(title)}</div>
              <div class="gmap-infowindow-addr">${escapeHtml(address)}</div>
              <a class="gmap-infowindow-link" href="${escapeHtml(externalUrl)}" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open({ anchor: marker, map });
        });

        if (!coordinates && !resolveKnownCoords(address) && maps.Geocoder) {
          const geocoder = new maps.Geocoder();
          geocoder.geocode({ address }, (results, geocodeStatus) => {
            if (isCancelled) return;
            if (geocodeStatus === 'OK' && results?.[0]?.geometry?.location) {
              const loc = results[0].geometry.location;
              map.setCenter(loc);
              marker.setPosition(loc);
            }
          });
        }

        setLoadResult({ key: requestKey, state: 'ready' });
      })
      .catch(() => {
        if (isCancelled) return;
        setLoadResult({ key: requestKey, state: 'embed-fallback' });
      });

    return () => {
      isCancelled = true;
      mapInstanceRef.current = null;
    };
  }, [apiKey, requestKey, address, title, coordinates, zoom]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!mapInstanceRef.current) return;
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      mapInstanceRef.current.setOptions({
        styles: isDark ? DARK_MAP_STYLES : null,
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const liveEmbedUrl = buildLiveEmbedUrl(address, zoom);

  return (
    <div className={`gmap-canvas-host ${className}`.trim()} data-map-api={status === 'ready' ? 'google-maps-js' : 'google-maps-live'}>
      {status === 'embed-fallback' ? (
        <iframe
          title={`${title} Location Map`}
          src={liveEmbedUrl}
          className="gmap-live-iframe"
          allow="fullscreen"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div ref={containerRef} className="gmap-mount-target" />
      )}
    </div>
  );
}
