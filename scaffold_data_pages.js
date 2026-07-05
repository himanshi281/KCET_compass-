const fs = require('fs');
const path = require('path');
const pagesDir = 'react-frontend/src/pages';

// Data.jsx
const dataJsx = `
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';

export default function Data() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Filters
  const [rank, setRank] = useState('');
  const [quota, setQuota] = useState('none');
  const [category, setCategory] = useState('none');
  const [branch, setBranch] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Just fetch all colleges and we will filter client-side for immediate reactivity
      const res = await api.get('/colleges');
      setColleges(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredColleges = useMemo(() => {
    let result = colleges;
    
    if (globalSearch) {
      const q = globalSearch.toLowerCase();
      result = result.filter(c => 
        (c.collegeName || '').toLowerCase().includes(q) ||
        (c.collegeCode || '').toLowerCase().includes(q) ||
        (c.district || '').toLowerCase().includes(q)
      );
    }
    
    // Add logic here if we want to filter by rank/branch strictly on frontend
    
    return result;
  }, [colleges, globalSearch, rank, quota, category, branch]);

  const totalPages = Math.ceil(filteredColleges.length / itemsPerPage) || 1;
  const paginatedColleges = filteredColleges.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 'calc(100vh - 65px)' }}>
      
      {/* Left Sidebar Filters */}
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
            <option value="none">General (none)</option>
            <option value="K">Kannada (K)</option>
            <option value="R">Rural (R)</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Category</label>
          <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="none">General Merit (GM)</option>
            <option value="1G">1G</option>
            <option value="2AG">2AG</option>
            <option value="3BG">3BG</option>
            <option value="SCG">SCG</option>
          </select>
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }}>Apply Filters</button>
      </aside>

      {/* Main Content */}
      <main style={{ padding: '32px', background: 'var(--bg-main)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem' }}>Search for a course</h1>
          
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Search colleges, locations..." 
              style={{ paddingLeft: '40px' }}
              value={globalSearch}
              onChange={e => { setGlobalSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading colleges...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {paginatedColleges.map((c, idx) => (
                <Link to={\`/college/\${c._id}\`} key={c._id} style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '24px',
                  background: 'white',
                  transition: 'all 0.2s',
                  boxShadow: 'var(--shadow-sm)'
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
                </Link>
              ))}
            </div>

            {filteredColleges.length === 0 && (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No colleges found matching your criteria.
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px' }}>
                <button 
                  className="btn btn-outline" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  style={{ padding: '8px 16px' }}
                >
                  <ChevronLeft size={18} /> Prev
                </button>
                
                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  Page {currentPage} of {totalPages}
                </span>
                
                <button 
                  className="btn btn-outline" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  style={{ padding: '8px 16px' }}
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, 'Data.jsx'), dataJsx);

// CollegeDetails.jsx
const collegeJsx = `
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Hash } from 'lucide-react';
import api from '../api';

export default function CollegeDetails() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await api.get(\`/colleges/\${id}\`);
        setCollege(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [id]);

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
fs.writeFileSync(path.join(pagesDir, 'CollegeDetails.jsx'), collegeJsx);

console.log('Scaffolded Data and CollegeDetails pages');
