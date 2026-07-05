import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, ClipboardList } from 'lucide-react';
import heroImage from '../assets/image.png';
import heroImage1 from '../assets/image3.png';
import heroImage2 from '../assets/image2.png';

export default function Data() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'linear-gradient(to bottom, #e9f0ec, #ffffff)', minHeight: 'calc(100vh - 65px)', paddingBottom: '60px' }}>

      {/* 1. HERO BANNER */}
      <div style={{ padding: '40px 20px' }}>
        <div className="flex-wrap-mobile" style={{
          borderRadius: '24px',
          overflow: 'hidden',
          maxWidth: '1200px',
          margin: '0 auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          minHeight: '500px'
        }}>
          {/* Left Green Side */}
          <div style={{
            flex: 1,
            background: '#2a5a4a',
            padding: '80px 60px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '24px' }}>
              Join more than 25,000+ students all over the world.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '40px', maxWidth: '400px' }}>
              Join a global community of over 25,000 students who are transforming their skills and knowledge through our comprehensive courses. Whether you're a beginner or an experienced professional.
            </p>
            <div>
              <button onClick={() => navigate('/search')} style={{
                background: '#c8e6a1',
                color: '#1a332a',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}>
                Get Started Now
              </button>
            </div>
          </div>
          {/* Right Image Side */}
          <div style={{ flex: 1, position: 'relative', background: '#ccc' }}>
            <img src={heroImage} alt="Students" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      {/* 2. FEATURES */}
      <div className="grid-3-cols" style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2a5a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <User color="#c8e6a1" size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#111', fontWeight: 700 }}>Sign up & set your goals.</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6 }}>Begin your journey by creating an account on Edux. During the signup process</p>
        </div>
        <div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2a5a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <Settings color="#c8e6a1" size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#111', fontWeight: 700 }}>Explore & enroll in courses.</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6 }}>Once your account is set up, dive into the vast course catalog. Use the for search and filter options.</p>
        </div>
        <div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2a5a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <ClipboardList color="#c8e6a1" size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#111', fontWeight: 700 }}>Track your progress.</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6 }}>With your courses selected, it's time to start learning. Engage with form interactive content.</p>
        </div>
      </div>

      {/* 3. TESTIMONIALS */}
      <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px', color: '#111' }}>What our students say.</h2>
        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '40px' }}>Our learners come from diverse backgrounds industries, and corners</p>

        <div className="grid-custom-stats" style={{ height: '100%', minHeight: '400px' }}>
          <div style={{ borderRadius: '24px', overflow: 'hidden', background: '#ccc' }}>
            <img src={heroImage1} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ background: '#2a5a4a', borderRadius: '24px', padding: '40px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
              "I enrolled in a few courses on Edux to brush up on my skills, and the results have been incredible. The content is thorough, the instructors are knowledgeable, and the flexibility allowed me to learn at my own pace."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ccc', overflow: 'hidden' }}>
                <img src={heroImage1} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Brooklyn Simmons</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>UI/UX Designer</div>
              </div>
            </div>
          </div>

          <div style={{ borderRadius: '24px', overflow: 'hidden', background: '#ccc' }}>
            <img src={heroImage2} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
