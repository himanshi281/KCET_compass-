const fs = require('fs');
const path = require('path');

const comparePath = path.join('react-frontend', 'src', 'pages', 'Compare.jsx');
const compareCode = `
import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, Hash, GraduationCap } from 'lucide-react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function Compare() {
  const [allColleges, setAllColleges] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await api.get('/colleges');
        setAllColleges(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchColleges();
  }, []);

  const filteredColleges = allColleges.filter(c => 
    c.collegeName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.collegeCode?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // Limit dropdown to 5 results

  const handleSelectCollege = (college) => {
    if (selectedColleges.length >= 3) {
      alert("You can only compare up to 3 colleges at once.");
      return;
    }
    if (selectedColleges.find(c => c._id === college._id)) {
      return; // Already selected
    }
    setSelectedColleges([...selectedColleges, college]);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const removeCollege = (id) => {
    setSelectedColleges(selectedColleges.filter(c => c._id !== id));
  };

  // Helper to extract a common list of courses across selected colleges
  const commonCourses = React.useMemo(() => {
    const courseSet = new Set();
    selectedColleges.forEach(college => {
      college.courses?.forEach(course => {
        courseSet.add(course.courseName);
      });
    });
    return Array.from(courseSet).sort();
  }, [selectedColleges]);

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: 'calc(100vh - 65px)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px', fontWeight: 800 }}>Compare Colleges</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Select up to 3 colleges to compare their courses, cutoffs, and data side-by-side.</p>
        
        {/* Search Input */}
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input" 
            style={{ padding: '16px 16px 16px 48px', fontSize: '1.1rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
            placeholder="Search for a college to add..." 
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setIsDropdownOpen(true); }}
            onFocus={() => setIsDropdownOpen(true)}
          />
          
          {/* Autocomplete Dropdown */}
          {isDropdownOpen && searchQuery && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', marginTop: '8px', boxShadow: 'var(--shadow-lg)', zIndex: 10, textAlign: 'left', overflow: 'hidden' }}>
              {filteredColleges.length > 0 ? (
                filteredColleges.map(c => (
                  <div 
                    key={c._id} 
                    onClick={() => handleSelectCollege(c)}
                    style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--brand-orange)', fontSize: '0.75rem', marginBottom: '4px' }}>{c.collegeCode}</div>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.collegeName}</div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px', color: 'var(--text-muted)' }}>No colleges found.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Compare Table */}
      <div className="page-container" style={{ paddingTop: '40px' }}>
        {selectedColleges.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)', background: 'white', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Colleges Selected</h3>
            <p>Use the search bar above to add colleges to the comparison engine.</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              
              {/* Table Head (College Names & Remove Buttons) */}
              <thead>
                <tr>
                  <th style={{ width: '25%', padding: '24px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Comparison</h3>
                  </th>
                  {selectedColleges.map(college => (
                    <th key={college._id} style={{ width: \`\${75 / selectedColleges.length}%\`, padding: '24px', borderRight: '1px solid var(--border-color)', borderBottom: '2px solid var(--border-color)', verticalAlign: 'top', position: 'relative' }}>
                      <button 
                        onClick={() => removeCollege(college._id)}
                        style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        <X size={16} />
                      </button>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-orange)', textTransform: 'uppercase', marginBottom: '8px' }}>{college.collegeCode}</div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '16px' }}>{college.collegeName}</h3>
                      
                      <Link to={\`/college/\${college._id}\`} state={{ college }} className="btn btn-outline" style={{ width: '100%', padding: '8px', fontSize: '0.875rem' }}>
                        View Full Details
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body (Specs) */}
              <tbody>
                {/* Location Row */}
                <tr>
                  <td style={{ padding: '16px 24px', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /> Location</div>
                  </td>
                  {selectedColleges.map(college => (
                    <td key={college._id} style={{ padding: '16px 24px', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                      {college.district || '--'}
                    </td>
                  ))}
                </tr>
                
                {/* Type Row */}
                <tr>
                  <td style={{ padding: '16px 24px', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Hash size={16} /> Institution Type</div>
                  </td>
                  {selectedColleges.map(college => (
                    <td key={college._id} style={{ padding: '16px 24px', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                      {college.collegeType || '--'}
                    </td>
                  ))}
                </tr>

                {/* Course Cutoffs Section Header */}
                <tr>
                  <td colSpan={selectedColleges.length + 1} style={{ padding: '24px', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '1.1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-orange)' }}><GraduationCap size={20} /> Course Cutoffs (GM)</div>
                  </td>
                </tr>

                {/* Dynamic Course Rows */}
                {commonCourses.map(courseName => (
                  <tr key={courseName}>
                    <td style={{ padding: '16px 24px', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-secondary)', fontSize: '0.875rem' }}>
                      {courseName}
                    </td>
                    {selectedColleges.map(college => {
                      const courseObj = college.courses?.find(c => c.courseName === courseName);
                      const cutoff = courseObj?.cutoffs?.GM || '--';
                      
                      return (
                        <td key={\`\${college._id}-\${courseName}\`} style={{ padding: '16px 24px', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', textAlign: 'center', fontWeight: cutoff !== '--' ? 600 : 400, color: cutoff !== '--' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {cutoff}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Click outside to close dropdown hack */}
      {isDropdownOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 5 }} onClick={() => setIsDropdownOpen(false)} />
      )}
    </div>
  );
}
`;
fs.writeFileSync(comparePath, compareCode);
console.log('Successfully added Compare.jsx feature!');
