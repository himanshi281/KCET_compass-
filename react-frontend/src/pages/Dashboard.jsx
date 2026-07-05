import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Hash, GraduationCap, Heart } from 'lucide-react';

export default function Dashboard() {
  const { user, loading, toggleLike } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: 'calc(100vh - 65px)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', padding: '60px 20px', textAlign: 'center' }}>
        <h1 className="results-title" style={{ fontWeight: 800, marginBottom: '16px' }}>My Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Manage your profile and view your saved colleges.</p>
        
        {/* Search Input for Liked Colleges */}
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <SearchIcon size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input" 
            style={{ padding: '16px 16px 16px 48px', fontSize: '1.1rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
            placeholder="Search your saved colleges..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="page-container" style={{ paddingTop: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Saved Colleges ({filteredColleges.length})</h2>
        </div>

        {likedColleges.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)', background: 'white', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
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
              <div key={college._id} style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-orange)', textTransform: 'uppercase' }}>{college.collegeCode}</div>
                  <button 
                    onClick={() => toggleLike(college._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand-orange)' }}
                    title="Remove from saved"
                  >
                    <Heart size={20} fill="var(--brand-orange)" />
                  </button>
                </div>
                
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '16px', flexGrow: 1 }}>{college.collegeName}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={16} /> {college.district || '--'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <Hash size={16} /> {college.collegeType || '--'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <GraduationCap size={16} /> {college.courses?.length || 0} Courses
                  </div>
                </div>
                
                <Link to={`/college/${college._id}`} state={{ college }} className="btn btn-outline" style={{ width: '100%', textAlign: 'center', padding: '12px' }}>
                  View Full Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
