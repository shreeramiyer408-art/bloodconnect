import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import SearchDonors from './pages/SearchDonors';
import RequestHistory from './pages/RequestHistory';
import Profile from './pages/Profile';
import BloodCompatibility from './pages/BloodCompatibility';
import BloodBankDirectory from './pages/BloodBankDirectory';
import DonationCamps from './pages/DonationCamps';
import MapView from './pages/MapView';
import Awareness from './pages/Awareness';

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main">{children}</main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth pages — split-screen layout, no sidebar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* App pages — sidebar layout */}
          <Route path="/" element={<AppShell><SearchDonors /></AppShell>} />
          <Route path="/search" element={<AppShell><SearchDonors /></AppShell>} />
          <Route path="/compatibility" element={<AppShell><BloodCompatibility /></AppShell>} />
          <Route path="/bloodbanks" element={<AppShell><BloodBankDirectory /></AppShell>} />
          <Route path="/camps" element={<AppShell><DonationCamps /></AppShell>} />
          <Route path="/map" element={<AppShell><MapView /></AppShell>} />
          <Route path="/why-donate" element={<AppShell><Awareness /></AppShell>} />

          <Route path="/history" element={
            <ProtectedRoute><AppShell><RequestHistory /></AppShell></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><AppShell><Profile /></AppShell></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
