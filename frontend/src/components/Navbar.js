import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { to: '/search', label: 'Find Donors' },
  { to: '/map', label: 'Map' },
  { to: '/camps', label: 'Camps' },
  { to: '/bloodbanks', label: 'Blood Banks' },
  { to: '/compatibility', label: 'Compatibility' },
  { to: '/why-donate', label: 'Why Donate' },
  { to: '/history', label: 'My Requests' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/search" className="brand">
          <span className="brand-drop">❤</span>
          <span className="brand-word">BloodConnect</span>
        </NavLink>

        <nav className="navbar-links">
          {LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          {user ? (
            <>
              <NavLink to="/profile" className="pill-link">{user.name?.split(' ')[0] || 'Profile'}</NavLink>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-sm">Log in</NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
