import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { to: '/search', label: 'Search Donors' },
  { to: '/history', label: 'Request History' },
  { to: '/profile', label: 'My Profile' },
  { to: '/map', label: 'Map View' },
  { to: '/camps', label: 'Donation Camps' },
  { to: '/bloodbanks', label: 'Blood Banks' },
  { to: '/compatibility', label: 'Compatibility Guide' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="drop" />
        <span>BloodConnect</span>
      </div>

      <nav className="sidebar-nav">
        {LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="sidebar-footer">
          <button className="btn btn-sm" onClick={handleLogout}>Log out</button>
        </div>
      )}
    </aside>
  );
}
