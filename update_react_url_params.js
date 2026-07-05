const fs = require('fs');
const path = require('path');

const dataPath = path.join('react-frontend', 'src', 'pages', 'Data.jsx');
const dataCode = `
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';

export default function Data() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL Params State
  const rank = searchParams.get('rank') || '';
  const quota = searchParams.get('quota') || 'GM';
  const branch = searchParams.get('branch') || '';
  const location = searchParams.get('location') || '';
  const globalSearch = searchParams.get('q') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  // Local State
  const [currentResults, setCurrentResults] = useState([]);
  const [loading, setLoading] = useState(false);
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
        const res = await api.get(\`/colleges/search?rank=\${rank}&branch=\${branch}&location=\${location}&quota=\${quota}\`);
        setCurrentResults(res.data);
      } catch (err) {
        console.error(err);
        setCurrentResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if at least one filter is applied to avoid empty fetches on load, or fetch all if preferred.
    fetchResults();
  }, [rank, branch, location, quota]);

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
        to={\`/college/\${c._id}\`} 
        state={{ college: c }}
        key={\`\${c._id}-\${idx}\`} 
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-orange)', textTransform: 'uppercase' }}>{c.collegeCode || 'CODE'}</span>
          <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: '4px', fontWeight: 500 }}>{c.district || 'Location'}</span>
        </div>
        
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', lineHeight: 1.3, color: 'var(--text-primary)' }}>
          {c.collegeName}
        </h3>
        
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {c.collegeType || 'Institution'}
        </p>

        <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(249, 115, 22, 0.1)', color: 'var(--brand-orange)', borderRadius: '4px', fontWeight: 600 }}>
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
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 'calc(100vh - 65px)' }}>
      {/* LEFT FILTERS */}
      <aside style={{ borderRight: '1px solid var(--border-color)', padding: '32px', background: 'var(--bg-secondary)', height: '100%', position: 'sticky', top: '65px', overflowY: 'auto' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '1.25rem' }}>
          <Filter size={20} /> Filters
        </h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Your Rank</label>
          <input type="number" className="input" placeholder="e.g. 45000" value={rank} onChange={e => updateParams({ rank: e.target.value, page: 1 })} />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Quota</label>
          <select className="input" value={quota} onChange={e => updateParams({ quota: e.target.value, page: 1 })}>
            <option value="GM">General (GM)</option>
            <option value="GMK">Kannada (GMK)</option>
            <option value="GMR">Rural (GMR)</option>
            <option value="SCG">SCG</option>
            <option value="STG">STG</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Branch</label>
          <select className="input" value={branch} onChange={e => updateParams({ branch: e.target.value, page: 1 })}>
            <option value="">Select Branch</option>
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Location</label>
          <select className="input" value={location} onChange={e => updateParams({ location: e.target.value, page: 1 })}>
            <option value="">Select Location</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ padding: '32px', background: 'var(--bg-main)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem' }}>Results ({filteredData.length})</h1>
          
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Global Search (Name, Code, Location)" 
              style={{ paddingLeft: '40px' }}
              value={globalSearch}
              onChange={e => updateParams({ q: e.target.value, page: 1 })}
            />
          </div>
        </div>

        {loading && <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>Loading...</div>}

        {/* TAB UI */}
        {!loading && (categorized.safe.length > 0 || categorized.moderate.length > 0 || categorized.dream.length > 0) && (
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border-color)' }}>
            
            <button 
              onClick={() => setActiveTab('safe')}
              style={{ 
                padding: '12px 24px', 
                background: 'transparent', 
                border: 'none',
                borderBottom: activeTab === 'safe' ? '2px solid #10b981' : '2px solid transparent',
                color: activeTab === 'safe' ? '#10b981' : 'var(--text-muted)',
                fontWeight: activeTab === 'safe' ? 600 : 500,
                cursor: 'pointer',
                fontSize: '1rem'
              }}>
              🟢 Safe ({categorized.safe.length})
            </button>
            
            <button 
              onClick={() => setActiveTab('moderate')}
              style={{ 
                padding: '12px 24px', 
                background: 'transparent', 
                border: 'none',
                borderBottom: activeTab === 'moderate' ? '2px solid #f59e0b' : '2px solid transparent',
                color: activeTab === 'moderate' ? '#f59e0b' : 'var(--text-muted)',
                fontWeight: activeTab === 'moderate' ? 600 : 500,
                cursor: 'pointer',
                fontSize: '1rem'
              }}>
              🟡 Moderate ({categorized.moderate.length})
            </button>
            
            <button 
              onClick={() => setActiveTab('dream')}
              style={{ 
                padding: '12px 24px', 
                background: 'transparent', 
                border: 'none',
                borderBottom: activeTab === 'dream' ? '2px solid #ef4444' : '2px solid transparent',
                color: activeTab === 'dream' ? '#ef4444' : 'var(--text-muted)',
                fontWeight: activeTab === 'dream' ? 600 : 500,
                cursor: 'pointer',
                fontSize: '1rem'
              }}>
              🔴 Dream ({categorized.dream.length})
            </button>

          </div>
        )}

        {/* ACTIVE TAB CONTENT */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
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
      </main>
    </div>
  );
}
`;
fs.writeFileSync(dataPath, dataCode);

console.log('Successfully added URL param state and Tab UI to React app!');
