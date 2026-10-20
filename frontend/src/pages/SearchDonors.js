import { useState } from 'react';
import api from '../utils/api';

const BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

export default function SearchDonors() {
  const [bloodType, setBloodType] = useState('');
  const [note, setNote] = useState('I need blood urgently.');
  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [sentTo, setSentTo] = useState({});
  const [sendError, setSendError] = useState('');

  const handleSearch = () => {
    if (!bloodType) return;
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const res = await api.get('/donors/search', {
        params: { bloodType, lat: latitude, lng: longitude, maxDistance: 15000 }
      });
      setDonors(res.data);
      setSearched(true);
    }, () => alert('Location access is required to search.'));
  };

  const sendRequest = async (donorId) => {
    setSendError('');
    try {
      await api.post('/requests', { donorId, message: note });
      setSentTo({ ...sentTo, [donorId]: true });
    } catch (err) {
      setSendError(err.response?.data?.message || 'Could not send the request. Please try again.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Search donors</h1>
        <p>
          Find available donors near your current location, ranked nearest first. Your name, mobile
          number and email are shared with a donor only if they accept your request.
        </p>
      </div>

      <div className="search-bar">
        <div className="field">
          <label htmlFor="bloodType">Blood type</label>
          <select id="bloodType" value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
            <option value="">Select</option>
            {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
          </select>
        </div>
        <div className="field" style={{ maxWidth: 'none', flex: 1, minWidth: 220 }}>
          <label htmlFor="note">Message to donors</label>
          <input id="note" value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={handleSearch}>Search nearby</button>
      </div>

      {sendError && <div className="eligibility-banner not-eligible" style={{ marginBottom: 16 }}>{sendError}</div>}

      {searched && donors.length === 0 && (
        <div className="empty-state">No available donors found nearby for this blood type. Try a wider search area or check back later.</div>
      )}

      {donors.length > 0 && (
        <div className="row-list">
          {donors.map(d => (
            <div className="row-item accent-available" key={d._id}>
              <div className="row-main">
                <span className="row-title">{d.name}</span>
                <span className="row-sub">Available now</span>
              </div>
              <span className="badge badge-blood">{d.bloodType}</span>
              {sentTo[d._id] ? (
                <span className="badge badge-trust">Request sent</span>
              ) : (
                <button className="btn btn-secondary btn-sm" onClick={() => sendRequest(d._id)}>Request contact</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}