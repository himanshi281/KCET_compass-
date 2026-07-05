const fs = require('fs');
const path = require('path');

const dataPath = path.join('react-frontend', 'src', 'pages', 'Data.jsx');
const dataCode = `
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';

export default function Data() {
  // Master API Results
  const [currentResults, setCurrentResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Dropdown Options (Populated once on mount)
  const [branches, setBranches] = useState([]);
  const [locations, setLocations] = useState([]);

  // Filter States
  const [rank, setRank] = useState('');
  const [quota, setQuota] = useState('GM');
  const [branch, setBranch] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('none'); // Unused in original searchColleges but kept in UI
  
  // Global Search & Pagination
  const [globalSearch, setGlobalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // On mount: Fetch all colleges once just to populate the Branch and Location dropdowns
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

  // Handle Search click (Equivalent to searchColleges in main.js)
  const handleSearch = async () => {
    setLoading(true);
    setCurrentPage(1); // Reset page on new search
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

  // 2. Pagination (Happens BEFORE categorization, just like main.js!)
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

      // Exact logic from main.js
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

  // UI Component for rendering a college card perfectly matching vanilla design
  const renderCard = (c, idx) => {
    const courseCount = c.matchingCourses ? c.matchingCourses.length : 0;
    
    return (
      <Link 
        to={\`/college/\${c._id}\`} 
        state={{ college: c }} // <--- Zero API Latency Pass!
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
          <input type="number" className="input" placeholder="e.g. 45000" value={rank} onChange={e => setRank(e.target.value)} />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Quota</label>
          <select className="input" value={quota} onChange={e => setQuota(e.target.value)}>
            <option value="GM">General (GM)</option>
            <option value="GMK">Kannada (GMK)</option>
            <option value="GMR">Rural (GMR)</option>
            <option value="SCG">SCG</option>
            <option value="STG">STG</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Branch</label>
          <select className="input" value={branch} onChange={e => setBranch(e.target.value)}>
            <option value="">Select Branch</option>
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Location</label>
          <select className="input" value={location} onChange={e => setLocation(e.target.value)}>
            <option value="">Select Location</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSearch}>
          {loading ? 'Searching...' : 'Apply Filters'}
        </button>
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
              onChange={e => { setGlobalSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        {currentResults.length === 0 && !loading && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Enter your criteria and click "Apply Filters" to see colleges.
          </div>
        )}

        {/* Categories */}
        {categorized.safe.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#10b981' }}>🟢 Safe Colleges</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {categorized.safe.map((c, i) => renderCard(c, i))}
            </div>
          </div>
        )}

        {categorized.moderate.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#f59e0b' }}>🟡 Moderate Colleges</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {categorized.moderate.map((c, i) => renderCard(c, i))}
            </div>
          </div>
        )}

        {categorized.dream.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#ef4444' }}>🔴 Dream Colleges</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {categorized.dream.map((c, i) => renderCard(c, i))}
            </div>
          </div>
        )}

        {/* Uncategorized (If rank not entered) */}
        {!rank && currentResults.length > 0 && categorized.dream.length > 0 && (
           <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {categorized.dream.map((c, i) => renderCard(c, i))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
            <button 
              className="btn btn-outline" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              <ChevronLeft size={18} /> Prev
            </button>
            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Page {currentPage} of {totalPages}</span>
            <button 
              className="btn btn-outline" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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

const detailsPath = path.join('react-frontend', 'src', 'pages', 'CollegeDetails.jsx');
const detailsCode = `
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Hash } from 'lucide-react';
import api from '../api';

export default function CollegeDetails() {
  const { id } = useParams();
  const location = useLocation();
  
  // 1. Instantly use the rich object passed via React Router State! (Zero API Calls)
  const [college, setCollege] = useState(location.state?.college || null);
  const [loading, setLoading] = useState(!college);

  useEffect(() => {
    // 2. Fallback API Call if user arrived directly via URL (memory wiped)
    if (!college) {
      const fetchCollege = async () => {
        try {
          const res = await api.get('/colleges');
          const allColleges = res.data;
          const found = allColleges.find(c => c._id === id);
          if (found) setCollege(found);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCollege();
    }
  }, [id, college]);

  if (loading) {
    return <div className="page-container" style={{ textAlign: 'center' }}>Loading college data...</div>;
  }

  if (!college) {
    return <div className="page-container" style={{ textAlign: 'center' }}>College not found.</div>;
  }

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: 'calc(100vh - 65px)' }}>
      {/* Hero Header */}
      <div style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="page-container" style={{ padding: '60px 20px' }}>
          <Link to="/data" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px', fontWeight: 500, fontSize: '0.875rem' }}>
            <ArrowLeft size={16} /> Back to Search
          </Link>
          
          <h1 style={{ fontSize: '3rem', marginBottom: '16px', lineHeight: 1.1 }}>{college.collegeName}</h1>
          
          <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={18} color="var(--brand-orange)" /> {college.district || 'Unknown District'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Hash size={18} color="var(--brand-orange)" /> {college.collegeCode}</span>
            <span style={{ background: 'rgba(249, 115, 22, 0.1)', color: 'var(--brand-orange)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '0.875rem' }}>
              {college.collegeType || 'Private'}
            </span>
          </div>
        </div>
      </div>

      {/* Courses Data */}
      <div className="page-container" style={{ paddingTop: '40px' }}>
        <div style={{ background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Available Courses & Cutoffs</h2>
          </div>
          
          {(!college.courses || college.courses.length === 0) ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No courses found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '16px 24px', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>Course Name</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>GM</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>SCG</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>STG</th>
                </tr>
              </thead>
              <tbody>
                {college.courses.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-main)'}>
                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>{c.courseName}</td>
                    <td style={{ padding: '16px 24px', color: c.cutoffs?.GM ? 'inherit' : 'var(--text-muted)' }}>{c.cutoffs?.GM || '--'}</td>
                    <td style={{ padding: '16px 24px', color: c.cutoffs?.SCG ? 'inherit' : 'var(--text-muted)' }}>{c.cutoffs?.SCG || '--'}</td>
                    <td style={{ padding: '16px 24px', color: c.cutoffs?.STG ? 'inherit' : 'var(--text-muted)' }}>{c.cutoffs?.STG || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(detailsPath, detailsCode);

console.log('Successfully updated React components to match legacy logic!');
