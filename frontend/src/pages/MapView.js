import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../utils/api';
import { googleMapsDirectionsUrl } from '../utils/googleMaps';

const BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

const donorIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const bankIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'bank-marker',
});

export default function MapView() {
  const [mode, setMode] = useState('donors');
  const [bloodType, setBloodType] = useState('');
  const [donors, setDonors] = useState([]);
  const [banks, setBanks] = useState([]);
  const [city, setCity] = useState('All');
  const [center, setCenter] = useState([19.0760, 72.8777]);

  useEffect(() => {
    if (mode === 'bloodbanks' && banks.length === 0) {
      api.get('/bloodbanks').then(res => setBanks(res.data));
    }
  }, [mode, banks.length]);

  const handleDonorSearch = () => {
    if (!bloodType) return;
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setCenter([latitude, longitude]);
      const res = await api.get('/donors/search', {
        params: { bloodType, lat: latitude, lng: longitude, maxDistance: 15000 }
      });
      setDonors(res.data);
    }, () => alert('Location access is required.'));
  };

  const cities = ['All', ...Array.from(new Set(banks.map(b => b.city))).sort()];
  const visibleBanks = city === 'All' ? banks : banks.filter(b => b.city === city);

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="page-header">
        <h1>Map view</h1>
        <p>See nearby donors or blood banks plotted on the map, with one-tap Google Maps directions.</p>
      </div>

      <div className="search-bar" style={{ marginBottom: 'var(--space-3)' }}>
        <div className="field">
          <label htmlFor="mode">Show</label>
          <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="donors">Donors</option>
            <option value="bloodbanks">Blood banks</option>
          </select>
        </div>

        {mode === 'donors' ? (
          <>
            <div className="field">
              <label htmlFor="bloodType">Blood type</label>
              <select id="bloodType" value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
                <option value="">Select</option>
                {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleDonorSearch}>Search</button>
          </>
        ) : (
          <div className="field">
            <label htmlFor="city">City</label>
            <select id="city" value={city} onChange={(e) => setCity(e.target.value)}>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}
      </div>

      {mode === 'bloodbanks' && (
        <p className="row-sub" style={{ marginBottom: 'var(--space-3)' }}>
          Pins marked <span className="badge badge-success" style={{ padding: '1px 8px' }}>exact</span> are
          precisely located. Pins marked <span className="badge badge-warning" style={{ padding: '1px 8px' }}>area</span> show
          the hospital's city/locality — tap <strong>Directions</strong> in the popup for the exact address.
        </p>
      )}

      <div className="map-wrap">
        <MapContainer center={center} zoom={mode === 'bloodbanks' ? 10 : 12} style={{ height: '460px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {mode === 'donors' && donors.map(d => (
            <Marker key={d._id} position={[d.location.coordinates[1], d.location.coordinates[0]]} icon={donorIcon}>
              <Popup>{d.name} — {d.bloodType}</Popup>
            </Marker>
          ))}

          {mode === 'bloodbanks' && visibleBanks.map(b => (
            <Marker key={b._id} position={[b.lat, b.lng]} icon={bankIcon}>
              <Popup>
                <strong>{b.name}</strong><br />
                {b.address}<br />
                {b.phone}<br />
                <span style={{ fontSize: '11px', color: '#8C7666' }}>
                  {b.geoAccuracy === 'exact' ? 'Exact pin' : 'Approximate area pin'}
                </span><br />
                <a href={googleMapsDirectionsUrl(b)} target="_blank" rel="noreferrer">
                  Get directions on Google Maps →
                </a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}