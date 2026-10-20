import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function DonationCamps() {
  const [camps, setCamps] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', location: '', organizer: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    api.get('/camps').then(res => setCamps(res.data));
  };

  useEffect(load, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = camps.filter(c => new Date(c.date) >= today);
  const past = camps.filter(c => new Date(c.date) < today);

  const directionsUrl = (location) =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/camps', form);
      setForm({ name: '', date: '', location: '', organizer: '' });
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add camp.');
    } finally {
      setSubmitting(false);
    }
  };

  const CampRow = ({ c }) => (
    <div className="row-item" key={c._id}>
      <div className="row-main">
        <span className="row-title">{c.name}</span>
        <span className="row-sub">{c.location}</span>
        <span className="row-sub">Organized by {c.organizer}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <span className="badge badge-trust">
          {new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <a
          className="btn btn-outline btn-sm"
          href={directionsUrl(c.location)}
          target="_blank"
          rel="noreferrer"
        >
          Directions
        </a>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Blood donation camps</h1>
        <p>
          Upcoming donation drives organized by hospitals, NGOs, colleges, and community groups
          across Maharashtra. Camp schedules change often — if you're organizing one, add it below
          so nearby donors can find it.
        </p>
      </div>

      <button className="btn btn-primary btn-sm" style={{ marginBottom: 'var(--space-4)' }} onClick={() => setShowForm(s => !s)}>
        {showForm ? 'Cancel' : '+ Add a camp'}
      </button>

      {showForm && (
        <form className="form panel" style={{ maxWidth: 480, marginBottom: 'var(--space-6)' }} onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Camp name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="date">Date</label>
            <input id="date" name="date" type="date" value={form.date} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="location">Location / address</label>
            <input id="location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Civil Hospital Grounds, Thane" required />
          </div>
          <div className="field">
            <label htmlFor="organizer">Organizer</label>
            <input id="organizer" name="organizer" value={form.organizer} onChange={handleChange} placeholder="e.g. Lions Club of Thane" required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Adding…' : 'Add camp'}
          </button>
        </form>
      )}

      {camps.length === 0 ? (
        <div className="empty-state">
          No camps listed yet. Run <code>npm run seed:camps</code> in the backend folder, or add one above.
        </div>
      ) : (
        <>
          <h3>Upcoming ({upcoming.length})</h3>
          {upcoming.length === 0 ? (
            <div className="empty-state" style={{ marginBottom: 'var(--space-5)' }}>No upcoming camps listed.</div>
          ) : (
            <div className="row-list" style={{ marginBottom: 'var(--space-6)' }}>
              {upcoming.map(c => <CampRow c={c} key={c._id} />)}
            </div>
          )}

          {past.length > 0 && (
            <>
              <h3>Past</h3>
              <div className="row-list">
                {past.map(c => <CampRow c={c} key={c._id} />)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}