const fs = require('fs');
const path = require('path');

const pagesDir = 'react-frontend/src/pages';
const compDir = 'react-frontend/src/components';

// Welcome.jsx
const welcomeJsx = `
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, GraduationCap, Building } from 'lucide-react';

export default function Welcome() {
  return (
    <div className="page-container" style={{ textAlign: 'center', marginTop: '60px' }}>
      <h4 style={{ color: 'var(--brand-orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Combine Quality with Morality</h4>
      <h1 style={{ fontSize: '4.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '40px' }}>
        Find Your Perfect<br/>College Destination.
      </h1>
      
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px' }}>
        <Link to="/data" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
          <Search size={20} /> Search Colleges
        </Link>
        <Link to="/compare" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
          Compare Options
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'left' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <GraduationCap size={40} color="var(--brand-orange)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Explore Courses</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Find top-tier engineering, medical, and architecture courses across thousands of institutions.</p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <Building size={40} color="var(--brand-orange)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Verify Cutoffs</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Get accurate, historical cutoff data for GM, GMK, and GMR categories instantly.</p>
        </div>
        <div style={{ background: 'var(--brand-orange)', padding: '32px', borderRadius: '12px', color: 'white' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Start Your Journey.</h3>
          <p style={{ color: 'white', opacity: 0.9, marginBottom: '24px' }}>Join 48K+ students finding their dream colleges today.</p>
          <Link to="/data" style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            View All Colleges &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, 'Welcome.jsx'), welcomeJsx);

// Compare.jsx
const compareJsx = `
import React from 'react';

export default function Compare() {
  return (
    <div className="page-container">
      <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Compare Colleges</h2>
      <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Compare feature coming soon! Go to the Colleges tab to search for data.
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, 'Compare.jsx'), compareJsx);

console.log('Scaffolded Welcome and Compare pages');
