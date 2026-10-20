import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', bloodType: '' });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        await api.post('/auth/register', { ...form, coordinates: [longitude, latitude] });
        navigate('/login');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    }, () => setError('Location access is required to register as a donor.'));
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <span className="drop-big" />
        <h1>Every registered donor is a life on standby.</h1>
        <p>Set your blood type and availability once — get matched with nearby requests automatically.</p>
      </div>

      <div className="auth-form-side">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Create an account</h2>

          {error && <div className="eligibility-banner not-eligible">{error}</div>}

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="phone">Mobile number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="98765 43210"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="bloodType">Blood type</label>
            <select id="bloodType" name="bloodType" value={form.bloodType} onChange={handleChange} required>
              <option value="" disabled>Select blood type</option>
              {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
            </select>
          </div>

          <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: 'var(--muted)' }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
              style={{ width: 18, height: 18, padding: 0, marginTop: 2, flexShrink: 0 }}
            />
            <span>
              I agree to share my mobile number and email with the other person, but only after a
              blood request between us has been accepted.
            </span>
          </label>

          <button type="submit" className="btn btn-primary">Register</button>

          <span className="form-footer-link">
            Already have an account? <Link to="/login">Log in</Link>
          </span>
        </form>
      </div>
    </div>
  );
}