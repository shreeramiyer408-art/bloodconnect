import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/search');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your details and try again.');
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <span className="drop-big" />
        <h1>Find the nearest donor, faster.</h1>
        <p>BloodConnect matches blood requests with available, nearby donors — no more scattered phone calls.</p>
      </div>

      <div className="auth-form-side">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Log in</h2>

          {error && <div className="eligibility-banner not-eligible">{error}</div>}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Log in</button>

          <span className="form-footer-link">
            Don't have an account? <Link to="/register">Register</Link>
          </span>
        </form>
      </div>
    </div>
  );
}
