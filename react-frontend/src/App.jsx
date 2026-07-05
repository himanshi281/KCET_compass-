import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Data from './pages/Data';
import Search from './pages/Search';
import Compare from './pages/Compare';
import CollegeDetails from './pages/CollegeDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProfileDrawer from './components/ProfileDrawer';

function Navbar() {
  const { user, loading } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">KCET Compass ⭐</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/data">Colleges</Link>
        <Link to="/compare">Compare</Link>
        
        {!loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto', paddingLeft: '24px', borderLeft: '1px solid var(--border-color)' }}>
            {user ? (
              <ProfileDrawer />
            ) : (
              <>
                <Link to="/login" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Log in</Link>
                <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Sign up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/data" element={<Data />} />
          <Route path="/search" element={<Search />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/college/:id" element={<CollegeDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
