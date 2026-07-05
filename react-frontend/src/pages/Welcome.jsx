import React from 'react';
import { Link } from 'react-router-dom';
import { Search, GraduationCap, Building } from 'lucide-react';
import bgImage from '../assets/image.png';

export default function Welcome() {
  return (
    <div style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: 'calc(100vh - 65px)',
      display: 'flex',
      alignItems: 'center',
      padding: '40px 0'
    }}>
      <div className="page-container" style={{ textAlign: 'center', width: '100%' }}>
        <h4 style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Combine Quality with Morality</h4>
        <h1 style={{ color: 'white', fontSize: '4.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '40px' }}>
          Find Your Perfect<br/>College Destination.
        </h1>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px' }}>
          <Link to="/data" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            <Search size={20} /> Search Colleges
          </Link>
          <Link to="/compare" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
            Compare Options
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'left' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-color)', opacity: 0.95 }}>
            <GraduationCap size={40} color="var(--brand-orange)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Explore Courses</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Find top-tier engineering, medical, and architecture courses across thousands of institutions.</p>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-color)', opacity: 0.95 }}>
            <Building size={40} color="var(--brand-orange)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Verify Cutoffs</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Get accurate, historical cutoff data for GM, GMK, and GMR categories instantly.</p>
          </div>
          <div style={{ background: 'var(--brand-orange)', padding: '32px', borderRadius: '12px', color: 'white', opacity: 0.95 }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Start Your Journey.</h3>
            <p style={{ color: 'white', opacity: 0.9, marginBottom: '24px' }}>Join 48K+ students finding their dream colleges today.</p>
            <Link to="/data" style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              View All Colleges &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
