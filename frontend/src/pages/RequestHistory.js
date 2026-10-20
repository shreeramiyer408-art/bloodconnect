import { useCallback, useEffect, useState } from 'react';
import api from '../utils/api';

const STATUS_BADGE = {
  pending: 'badge-warning',
  accepted: 'badge-trust',
  completed: 'badge-success',
  declined: 'badge-blood'
};

function ContactCell({ r }) {
  if (!r.contact) {
    if (r.status === 'pending') {
      return (
        <span className="row-sub">
          {r.role === 'donor' ? 'Shown to both of you after you accept' : 'Shown after the donor accepts'}
        </span>
      );
    }
    return <span className="row-sub">—</span>;
  }

  const { name, phone, email } = r.contact;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <strong>{name}</strong>
      {phone ? (
        <span>
          <a href={`tel:${phone}`}>{phone}</a>
          {' · '}
          <a href={`https://wa.me/${phone.replace('+', '')}`} target="_blank" rel="noreferrer">WhatsApp</a>
        </span>
      ) : (
        <span className="row-sub">No phone added</span>
      )}
      <a href={`mailto:${email}`}>{email}</a>
    </div>
  );
}

export default function RequestHistory() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api.get('/requests/history').then(res => setRequests(res.data));
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    setError('');
    try {
      await api.patch(`/requests/${id}`, { status });
      load(); // reload so contact details appear right after accepting
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update the request.');
    }
  };

  return (
    <div className="page" style={{ maxWidth: 1000 }}>
      <div className="page-header">
        <h1>Request history</h1>
        <p>
          All contact requests you've sent and received. Phone and email appear here only after a
          donor accepts.
        </p>
      </div>

      {error && <div className="eligibility-banner not-eligible" style={{ marginBottom: 16 }}>{error}</div>}

      {requests.length === 0 ? (
        <div className="empty-state">No requests yet. Search for a donor to send your first request.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Requester</th>
              <th>Donor</th>
              <th>Status</th>
              <th>Contact</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r._id}>
                <td>
                  {r.requester.name}
                  {r.message && <div className="row-sub">“{r.message}”</div>}
                </td>
                <td>{r.donor.name}</td>
                <td><span className={`badge ${STATUS_BADGE[r.status]}`}>{r.status}</span></td>
                <td><ContactCell r={r} /></td>
                <td>
                  {r.status === 'pending' && r.role === 'donor' && (
                    <>
                      <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(r._id, 'accepted')}>Accept</button>{' '}
                      <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(r._id, 'declined')}>Decline</button>
                    </>
                  )}
                  {r.status === 'pending' && r.role === 'requester' && (
                    <span className="row-sub">Waiting for donor</span>
                  )}
                  {r.status === 'accepted' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(r._id, 'completed')}>Mark completed</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}