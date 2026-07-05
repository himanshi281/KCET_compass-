import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Hash, GraduationCap, Heart } from 'lucide-react';

export default function Dashboard() {
  const { user, loading, toggleLike, updateAvatar } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  const AVATARS = ['Felix', 'Aneka', 'Jocelyn', 'Buster', 'Salem', 'Sheba', 'Sasha', 'Snickers', 'Oliver', 'Molly', 'Missy', 'Leo', 'Kitty', 'Jack', 'Gizmo'];

  const handleSelectAvatar = async (seed) => {
    try {
      setUpdatingAvatar(true);
      await updateAvatar(seed);
      setIsEditingAvatar(false);
    } catch (err) {
      alert("Failed to update avatar");
    } finally {
      setUpdatingAvatar(false);
    }
  };

  if (loading) {
    return <div style={{ minHeight: 'calc(100vh - 65px)', padding: '60px 20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const likedColleges = user.likedColleges || [];
  
  const filteredColleges = likedColleges.filter(college => 
    college.collegeName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    college.collegeCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uniqueLocations = new Set(likedColleges.map(c => c.district).filter(Boolean)).size;
  const totalCourses = likedColleges.reduce((acc, c) => acc + (c.courses?.length || 0), 0);

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: 'calc(100vh - 65px)', paddingBottom: '60px' }}>
      
      {/* Header Island */}
      <div className="dashboard-header-island" style={{ maxWidth: '1200px', margin: '20px auto 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Dashboard</h1>
            <p style={{ color: '#8ab0a0', fontSize: '1.1rem' }}>Welcome back, {user?.name}</p>
          </div>
          
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '3px solid rgba(255,255,255,0.2)', overflow: 'hidden' }}>
              <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user?.avatar || 'Felix'}`} alt="Avatar" style={{ width: '100%', height: '100%' }} />
            </div>
            <button 
              onClick={() => setIsEditingAvatar(!isEditingAvatar)}
              style={{ position: 'absolute', bottom: -5, right: -5, background: 'white', color: 'var(--brand-orange)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Edit Avatar"
            >
              ✏️
            </button>
          </div>
        </div>

        {isEditingAvatar && (
          <div style={{ background: 'white', color: 'var(--text-primary)', borderRadius: '0', padding: '24px', marginBottom: '32px', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 600 }}>Choose your avatar {updatingAvatar && '(Saving...)'}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {AVATARS.map(seed => (
                <button
                  key={seed}
                  onClick={() => handleSelectAvatar(seed)}
                  disabled={updatingAvatar}
                  style={{ 
                    width: '64px', height: '64px', borderRadius: '50%', border: user?.avatar === seed ? '3px solid var(--brand-orange)' : '1px solid var(--border-color)', 
                    background: 'var(--bg-tertiary)', cursor: 'pointer', overflow: 'hidden', padding: 0, transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`} alt={seed} style={{ width: '100%', height: '100%' }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dark Stat Cards */}
        <div className="grid-3-cols" style={{ marginBottom: '32px' }}>
          <div className="stat-card-dark">
            <div className="stat-title">Saved Colleges</div>
            <div className="stat-value">{likedColleges.length}</div>
          </div>
          <div className="stat-card-dark">
            <div className="stat-title">Locations</div>
            <div className="stat-value">{uniqueLocations}</div>
          </div>
          <div className="stat-card-dark">
            <div className="stat-title">Total Courses</div>
            <div className="stat-value">{totalCourses}</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <SearchIcon size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#8ab0a0' }} />
          <input 
            type="text" 
            style={{ width: '100%', padding: '16px 16px 16px 48px', fontSize: '1rem', borderRadius: '0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
            placeholder="Search your saved colleges..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content (Light Cards) */}
      <div className="page-container" style={{ paddingTop: '20px' }}>
        {likedColleges.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)', background: 'white', borderRadius: '0', border: '1px dashed var(--border-color)' }}>
            <Heart size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Colleges Saved Yet</h3>
            <p style={{ marginBottom: '24px' }}>Explore colleges and click the heart icon to save them here.</p>
            <Link to="/search" className="btn btn-primary">Find Colleges</Link>
          </div>
        ) : filteredColleges.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No saved colleges match your search.
          </div>
        ) : (
          <div className="grid-3-cols" style={{ gap: '24px' }}>
            {filteredColleges.map((college) => (
              <div key={college._id} className="dashboard-card">
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px dashed var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--brand-orange)', fontSize: '0.875rem' }}>
                      {college.collegeCode || 'CC'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{college.collegeName}</h3>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code #{college.collegeCode || 'N/A'}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleLike(college._id)}
                    style={{ background: 'rgba(34, 197, 94, 0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Remove from saved"
                  >
                    <Heart size={16} fill="#22c55e" color="#22c55e" />
                  </button>
                </div>
                
                <div style={{ flexGrow: 1, marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Location</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{college.district || '--'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Type</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{college.collegeType || '--'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Courses</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{college.courses?.length || 0}</span>
                  </div>
                </div>
                
                <Link to={`/college/${college._id}`} state={{ college }} className="btn-dark-green">
                  View details ↗
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
