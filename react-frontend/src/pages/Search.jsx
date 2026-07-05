import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import api from '../api';
import heroImage from '../assets/image.png';
import { AuthContext } from '../context/AuthContext';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const routerLocation = useLocation();
  const navigate = useNavigate();
  
  // URL Params State
  const rank = searchParams.get('rank') || '';
  const quota = searchParams.get('quota') || 'GM';
  const branch = searchParams.get('branch') || '';
  const location = searchParams.get('location') || '';
  const globalSearch = searchParams.get('q') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  // Local Filter State (for the form)
  const [localRank, setLocalRank] = useState(rank);
  const [localQuota, setLocalQuota] = useState(quota);
  const [localBranch, setLocalBranch] = useState(branch);
  const [localLocation, setLocalLocation] = useState(location);

  useEffect(() => {
    setLocalRank(rank);
    setLocalQuota(quota);
    setLocalBranch(branch);
    setLocalLocation(location);
  }, [rank, quota, branch, location]);

  const handleApplyFilters = () => {
    updateParams({ rank: localRank, quota: localQuota, branch: localBranch, location: localLocation, page: 1 });
  };

  const handleClearFilters = () => {
    setLocalRank('');
    setLocalQuota('GM');
    setLocalBranch('');
    setLocalLocation('');
    setSearchParams({});
  };

  // Local State
  const [currentResults, setCurrentResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { user, toggleLike } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('safe');
  
  // Dropdown Options
  const [branches, setBranches] = useState([]);
  const [locations, setLocations] = useState([]);

  // URL Parameter Updater
  const updateParams = (newParams) => {
    const current = Object.fromEntries([...searchParams]);
    setSearchParams({ ...current, ...newParams });
  };

  // On mount: Fetch all colleges once to populate Dropdowns
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get('/colleges');
        const colleges = res.data;
        const branchSet = new Set();
        const locationSet = new Set();
        
        colleges.forEach(c => {
          if (c.district) locationSet.add(c.district);
          c.courses?.forEach(course => {
            if (course.courseName) branchSet.add(course.courseName);
          });
        });
        
        setBranches([...branchSet].sort());
        setLocations([...locationSet].sort());
      } catch (err) {
        console.error('Failed to load filter options', err);
      }
    };
    fetchOptions();
  }, []);

  // When filters change in URL, trigger Search automatically
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/colleges/search?rank=${rank}&branch=${branch}&location=${location}&quota=${quota}`);
        setCurrentResults(res.data);
      } catch (err) {
        console.error(err);
        setCurrentResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [rank, branch, location, quota]);

  const hasFilters = Boolean(rank || branch || location || globalSearch);

  // 1. Global Search Filter
  const filteredData = useMemo(() => {
    if (!globalSearch) return currentResults;
    const q = globalSearch.toLowerCase();
    return currentResults.filter(c => 
      (c.collegeName || '').toLowerCase().includes(q) ||
      (c.collegeCode || '').toLowerCase().includes(q) ||
      (c.district || '').toLowerCase().includes(q) ||
      (c.collegeType || '').toLowerCase().includes(q)
    );
  }, [currentResults, globalSearch]);

  // 2. Pagination (Happens BEFORE categorization)
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  // 3. Categorization (Safe/Moderate/Dream)
  const categorized = useMemo(() => {
    const safe = [];
    const moderate = [];
    const dream = [];
    const userRank = Number(rank) || 0;

    paginatedResults.forEach(c => {
      const firstCourse = c.matchingCourses?.[0];
      const cutoff = firstCourse?.cutoffs?.[quota] || 0;
      const collegeWithCutoff = { ...c, cutoff };

      if (userRank > 0 && cutoff >= userRank + 10000) {
        collegeWithCutoff.status = 'Safe';
        safe.push(collegeWithCutoff);
      } else if (userRank > 0 && cutoff >= userRank) {
        collegeWithCutoff.status = 'Moderate';
        moderate.push(collegeWithCutoff);
      } else {
        collegeWithCutoff.status = 'Dream';
        dream.push(collegeWithCutoff);
      }
    });

    return { safe, moderate, dream };
  }, [paginatedResults, rank, quota]);

  // Auto-switch tabs if the current tab is empty but another has data
  useEffect(() => {
    if (categorized.safe.length > 0 && activeTab === 'safe') return;
    
    if (categorized[activeTab]?.length === 0) {
      if (categorized.safe.length > 0) setActiveTab('safe');
      else if (categorized.moderate.length > 0) setActiveTab('moderate');
      else if (categorized.dream.length > 0) setActiveTab('dream');
    }
  }, [categorized, activeTab]);

  // UI Component for rendering a college card
  const renderCard = (c, idx) => {
    const courseCount = c.matchingCourses ? c.matchingCourses.length : 0;
    return (
      <Link 
        to={`/college/${c._id}`} 
        state={{ college: c }}
        key={`${c._id}-${idx}`} 
        style={{
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '24px',
          background: 'white',
          transition: 'all 0.2s',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          color: 'inherit'
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--brand-orange)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-orange)', textTransform: 'uppercase' }}>
            {c.collegeCode || 'CODE'}
          </span>
          {user ? (
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(c._id); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: user.likedColleges?.some(lc => (lc._id || lc) === c._id) ? '#22c55e' : 'var(--text-muted)', padding: 0 }}
              title="Save college"
            >
              <Heart size={20} fill={user.likedColleges?.some(lc => (lc._id || lc) === c._id) ? '#22c55e' : 'none'} />
            </button>
          ) : (
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/login', { state: { from: routerLocation.pathname + routerLocation.search } }); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
              title="Login to save college"
            >
              <Heart size={20} fill="none" />
            </button>
          )}
          <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: '4px', fontWeight: 500 }}>{c.district || 'Location'}</span>
        </div>
        
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', lineHeight: 1.3, color: 'var(--text-primary)' }}>
          {c.collegeName}
        </h3>
        
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {c.collegeType || 'Institution'}
        </p>

        <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(42, 90, 74, 0.1)', color: 'var(--brand-orange)', borderRadius: '4px', fontWeight: 600 }}>
            {courseCount} Matching Course{courseCount !== 1 ? 's' : ''}
          </span>
          {c.cutoff > 0 && (
            <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: '4px', fontWeight: 600 }}>
              Cutoff: {c.cutoff}
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div style={{ padding: '40px 20px', background: 'linear-gradient(to bottom, #e9f0ec, #ffffff)', minHeight: 'calc(100vh - 65px)' }}>
      {/* 4. SEARCH SECTION */}
      <div id="search-section" className="grid-sidebar-layout" style={{ maxWidth: '1400px', margin: '0 auto', background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      {/* LEFT FILTERS */}
      <aside style={{ borderRight: '1px solid var(--border-color)', padding: '32px', background: '#fafafa' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '1.25rem' }}>
          <Filter size={20} /> Filters
        </h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Your Rank</label>
          <input type="number" className="input" placeholder="e.g. 45000" value={localRank} onChange={e => setLocalRank(e.target.value)} />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Quota</label>
          <select className="input" value={localQuota} onChange={e => setLocalQuota(e.target.value)}>
            <option value="GM">General (GM)</option>
            <option value="GMK">Kannada (GMK)</option>
            <option value="GMR">Rural (GMR)</option>
            <option value="SCG">SCG</option>
            <option value="STG">STG</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Branch</label>
          <select className="input" value={localBranch} onChange={e => setLocalBranch(e.target.value)}>
            <option value="">Select Branch</option>
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Location</label>
          <select className="input" value={localLocation} onChange={e => setLocalLocation(e.target.value)}>
            <option value="">Select Location</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="flex-wrap-mobile" style={{ marginTop: '32px' }}>
          <button className="btn btn-outline" onClick={handleClearFilters}>
            Clear
          </button>
          <button className="btn btn-primary" onClick={handleApplyFilters}>
            Apply
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="search-main-content">
        {!hasFilters ? (
          <div className="empty-state-container">
            {/* Announcements Bar */}
            <div className="announcements-bar">
              <div className="announcements-badge">
                Announcements
                <div className="badge-arrow" />
              </div>
              <div className="announcements-ticker">
                <div className="ticker-content">
                  new openings...! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; new openings...! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; new openings...! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; new openings...!
                </div>
              </div>
            </div>

            {/* Main Content of Empty State */}
            <div className="empty-state-content">
              {/* Left Text */}
              <div className="empty-state-text">
                <h2 className="hero-title">
                  Shaping Futures, Building Leaders<br />
                  <span className="hero-highlight">KCET Compass ⭐</span>
                </h2>
                <p className="hero-subtitle">
                  Delivering excellence in education and vocational training with a holistic approach to student growth and global opportunities
                </p>
                <button onClick={() => document.querySelector('input[placeholder="e.g. 45000"]')?.focus()} className="hero-cta">
                  Explore our institute
                </button>
              </div>

              {/* Right Image/Graphic */}
              <div className="hero-image-wrapper">
                <div className="hero-accent-bg"></div>
                <img src={heroImage} className="hero-image" alt="Student" />
                
                {/* Floating Badges */}
                <div className="floating-badge badge-left">
                  Global Pathways
                </div>
                <div className="floating-badge badge-right">
                  Student First
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
          <div className="flex-between-mobile" style={{ marginBottom: '32px' }}>
            <h1 className="results-title">Search Results ({filteredData.length})</h1>
              
              <div className="global-search-wrapper">
                <SearchIcon size={18} className="search-icon" />
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Global Search (Name, Code, Location)" 
                  value={globalSearch}
                  onChange={e => updateParams({ q: e.target.value, page: 1 })}
                />
              </div>
            </div>

            {loading && <div className="loading-state">Loading...</div>}

            {/* TAB UI */}
            {!loading && (categorized.safe.length > 0 || categorized.moderate.length > 0 || categorized.dream.length > 0) && (
              <div className="tabs-container">
                
                <button 
                  onClick={() => setActiveTab('safe')}
                  className={`tab-btn ${activeTab === 'safe' ? 'active-safe' : ''}`}
                >
                  🟢 Safe ({categorized.safe.length})
                </button>
                
                <button 
                  onClick={() => setActiveTab('moderate')}
                  className={`tab-btn ${activeTab === 'moderate' ? 'active-moderate' : ''}`}
                >
                  🟡 Moderate ({categorized.moderate.length})
                </button>
                
                <button 
                  onClick={() => setActiveTab('dream')}
                  className={`tab-btn ${activeTab === 'dream' ? 'active-dream' : ''}`}
                >
                  🔴 Dream ({categorized.dream.length})
                </button>

              </div>
            )}

            {/* ACTIVE TAB CONTENT */}
            {!loading && (
              <div className="grid-3-cols">
                {activeTab === 'safe' && categorized.safe.map((c, i) => renderCard(c, i))}
                {activeTab === 'moderate' && categorized.moderate.map((c, i) => renderCard(c, i))}
                {activeTab === 'dream' && categorized.dream.map((c, i) => renderCard(c, i))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  className="btn btn-outline" 
                  disabled={currentPage === 1}
                  onClick={() => updateParams({ page: Math.max(1, currentPage - 1) })}
                >
                  <ChevronLeft size={18} /> Prev
                </button>
                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Page {currentPage} of {totalPages}</span>
                <button 
                  className="btn btn-outline" 
                  disabled={currentPage === totalPages}
                  onClick={() => updateParams({ page: Math.min(totalPages, currentPage + 1) })}
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
      </div>
    </div>
  );
}
