import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import HealthQuestionnaire from '../components/HealthQuestionnaire';

export default function Profile() {
  const { user } = useAuth();
  const [donor, setDonor] = useState(null);
  const [phone, setPhone] = useState('');
  const [phoneMsg, setPhoneMsg] = useState({ text: '', ok: true });

  useEffect(() => {
    if (user) api.get(`/donors/${user.id}`).then(res => setDonor(res.data));
  }, [user]);

  const toggleAvailability = async () => {
    const res = await api.patch('/donors/availability');
    setDonor({ ...donor, isAvailable: res.data.isAvailable });
  };

  const savePhone = async (e) => {
    e.preventDefault();
    setPhoneMsg({ text: '', ok: true });
    try {
      const res = await api.patch('/donors/profile', { phone });
      setDonor({ ...donor, phone: res.data.phone });
      setPhone('');
      setPhoneMsg({ text: 'Mobile number saved.', ok: true });
    } catch (err) {
      setPhoneMsg({ text: err.response?.data?.message || 'Could not save the number.', ok: false });
    }
  };

  if (!donor) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>My profile</h1>
        <p>Your donor details, availability, and donation eligibility.</p>
      </div>

      <div className="panel">
        <div className="stat-line">
          <span className="label">Name</span>
          <span className="value">{donor.name}</span>
        </div>
        <div className="stat-line">
          <span className="label">Email</span>
          <span className="value">{donor.email}</span>
        </div>
        <div className="stat-line">
          <span className="label">Mobile</span>
          <span className="value">
            {donor.phone || <span className="badge badge-warning">Not added</span>}
          </span>
        </div>
        <div className="stat-line">
          <span className="label">Blood type</span>
          <span className="value"><span className="badge badge-blood">{donor.bloodType}</span></span>
        </div>
        <div className="stat-line">
          <span className="label">Donations made</span>
          <span className="value">{donor.donationCount}</span>
        </div>
        <div className="stat-line">
          <span className="label">Availability</span>
          <span className="value">
            <span className={`badge ${donor.isAvailable ? 'badge-success' : 'badge-warning'}`}>
              {donor.isAvailable ? 'Available' : 'Unavailable'}
            </span>{' '}
            <button className="btn btn-secondary btn-sm" onClick={toggleAvailability}>Toggle</button>
          </span>
        </div>

        <div className={`eligibility-banner ${donor.eligibility?.eligible ? 'eligible' : 'not-eligible'}`}>
          {donor.eligibility?.message}
        </div>
      </div>

      <div className="panel">
        <h3>{donor.phone ? 'Change mobile number' : 'Add your mobile number'}</h3>
        <p className="row-sub">
          Shared with the other person only after a blood request between you has been accepted.
        </p>
        <form onSubmit={savePhone} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="tel"
            inputMode="tel"
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{ maxWidth: 240 }}
          />
          <button className="btn btn-primary btn-sm" type="submit">Save</button>
        </form>
        {phoneMsg.text && (
          <div className={`eligibility-banner ${phoneMsg.ok ? 'eligible' : 'not-eligible'}`}>{phoneMsg.text}</div>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <HealthQuestionnaire />
      </div>
    </div>
  );
}