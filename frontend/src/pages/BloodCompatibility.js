import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function BloodCompatibility() {
  const [data, setData] = useState({});

  useEffect(() => {
    api.get('/bloodbanks/compatibility').then(res => setData(res.data));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Blood compatibility guide</h1>
        <p>Which blood types can donate to, or receive from, which others.</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Blood type</th>
            <th>Can donate to</th>
            <th>Can receive from</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([type, info]) => (
            <tr key={type}>
              <td><span className="badge badge-blood">{type}</span></td>
              <td>{info.canDonateTo.join(', ')}</td>
              <td>{info.canReceiveFrom.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
