import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, X } from 'lucide-react';

export default function ProfileDrawer() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}
      >
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user?.avatar || 'Felix'}`} alt="Avatar" style={{ width: '100%', height: '100%' }} />
        </div>
        <span className="hide-on-mobile">{user?.name}</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
        />
      )}

      {/* Drawer */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-350px',
          width: '300px',
          height: '100vh',
          background: 'white',
          boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
          zIndex: 101,
          transition: 'right 0.3s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Profile</h2>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-tertiary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid var(--border-color)' }}>
            <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user?.avatar || 'Felix'}`} alt="Avatar" style={{ width: '100%', height: '100%' }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '4px' }}>{user?.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user?.email}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link 
            to="/dashboard" 
            onClick={() => setIsOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '8px', background: 'var(--bg-secondary)', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 500, transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border-color)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
          >
            <LayoutDashboard size={20} color="var(--brand-orange)" />
            Dashboard
          </Link>

          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '8px', background: 'white', border: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 500, transition: 'background 0.2s', textAlign: 'left', width: '100%' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
          >
            <LogOut size={20} color="#ef4444" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
