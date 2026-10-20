import { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';
import { googleMapsViewUrl, googleMapsDirectionsUrl } from '../utils/googleMaps';

export default function BloodBankDirectory() {
  const [banks, setBanks] = useState([]);
  const [city, setCity] = useState('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get('/bloodbanks').then(res => setBanks(res.data));
  }, []);

  const cities = useMemo(
    () => ['All', ...Array.from(new Set(banks.map(b => b.city))).sort()],
    [banks]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return banks.filter(b => {
      const cityOk = city === 'All' || b.city === city;
      const textOk =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q);
      return cityOk && textOk;
    });
  }, [banks, city, query]);

  const telHref = (phone) => {
    const first = phone.split('/')[0].replace(/\(.*?\)/g, '').replace(/[^\d+]/g, '');
    return first.length >= 6 ? `tel:${first}` : null;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Blood bank &amp; hospital directory</h1>
        <p>
          Licensed blood banks and hospital blood centres across Maharashtra where you can donate
          blood or request it. Tap <strong>Directions</strong> for exact Google Maps navigation —
          call ahead to confirm timings and whether a replacement donor is required.
        </p>
      </div>

      {banks.length === 0 ? (
        <div className="empty-state">
          No blood banks listed yet. Run <code>npm run seed:bloodbanks</code> in the backend folder.
        </div>
      ) : (
        <>
          <div className="search-bar">
            <div className="field">
              <label htmlFor="city">City</label>
              <select id="city" value={city} onChange={(e) => setCity(e.target.value)}>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field" style={{ flex: 1, maxWidth: 320 }}>
              <label htmlFor="q">Search by name or area</label>
              <input
                id="q"
                type="text"
                placeholder="e.g. Parel, Sassoon, Civil Hospital"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <p className="row-sub" style={{ marginBottom: 'var(--space-3)' }}>
            Showing {visible.length} of {banks.length}
          </p>

          {visible.length === 0 ? (
            <div className="empty-state">No blood banks match your search.</div>
          ) : (
            <div className="row-list">
              {visible.map(b => {
                const phoneHref = telHref(b.phone);
                return (
                  <div className="row-item" key={b._id}>
                    <div className="row-main">
                      <span className="row-title">{b.name}</span>
                      <span className="row-sub">{b.address}</span>
                      <span className="row-sub">
                        {b.city}
                        {phoneHref ? (
                          <> · <a href={phoneHref}>{b.phone}</a></>
                        ) : (
                          <> · {b.phone}</>
                        )}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                      <a
                        className="btn btn-outline btn-sm"
                        href={googleMapsViewUrl(b)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View on map
                      </a>
                      <a
                        className="btn btn-primary btn-sm"
                        href={googleMapsDirectionsUrl(b)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Directions
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
