import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import heroImage from '../assets/image1.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      {/* Left side: Image */}
      <div className="auth-image-side">
        <div className="hero-accent-bg"></div>
        <img src={heroImage} className="hero-image" alt="Student" />
        <div className="floating-badge badge-left">Welcome Back</div>
        <div className="floating-badge badge-right">KCET Compass ⭐</div>
      </div>

      {/* Right side: Form */}
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Welcome back</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Log in to access your saved colleges.</p>
          </div>

          {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '0', marginBottom: '24px', fontSize: '0.875rem', fontWeight: 500 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Email</label>
              <input 
                type="email" 
                className="input" 
                style={{ borderRadius: '0' }}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Password</label>
              <input 
                type="password" 
                className="input" 
                style={{ borderRadius: '0' }}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', padding: '16px', borderRadius: '0' }}>Log in</button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/signup" state={{ from }} style={{ color: 'var(--brand-orange)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
