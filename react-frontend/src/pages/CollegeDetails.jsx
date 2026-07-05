
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Hash } from 'lucide-react';
import api from '../api';

export default function CollegeDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
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
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px', fontWeight: 500, fontSize: '0.875rem' }}>
            <ArrowLeft size={16} /> Back to Search
          </button>
          
          <h1 style={{ fontSize: '3rem', marginBottom: '16px', lineHeight: 1.1 }}>{college.collegeName}</h1>
          
          <div className="flex-wrap-mobile" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={18} color="var(--brand-orange)" /> {college.district || 'Unknown District'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Hash size={18} color="var(--brand-orange)" /> {college.collegeCode}</span>
            <span style={{ background: 'rgba(42, 90, 74, 0.1)', color: 'var(--brand-orange)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '0.875rem' }}>
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
            <div style={{ overflowX: 'auto' }}>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
