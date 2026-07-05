const fs = require('fs');
const path = require('path');

const srcDir = 'react-frontend/src';

// 1. global.css (Orange Theme)
const globalCss = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --bg-main: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  
  --border-color: #e5e7eb;
  --border-hover: #d1d5db;
  
  --text-primary: #111827;
  --text-secondary: #4b5563;
  --text-muted: #9ca3af;
  
  --brand-orange: #f97316;
  --brand-orange-hover: #ea580c;
  
  --font-sans: 'Inter', sans-serif;
  
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: var(--font-sans);
  background-color: var(--bg-main);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  gap: 8px;
}

.btn-primary {
  background: var(--brand-orange);
  color: white;
}
.btn-primary:hover {
  background: var(--brand-orange-hover);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}
.btn-outline:hover {
  border-color: var(--brand-orange);
  color: var(--brand-orange);
}

/* Inputs */
.input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}
.input:focus {
  border-color: var(--brand-orange);
}

/* Layouts */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-main);
  position: sticky;
  top: 0;
  z-index: 100;
}
.navbar-brand {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--brand-orange);
}
.navbar-links {
  display: flex;
  gap: 24px;
}
.navbar-links a {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.875rem;
}
.navbar-links a:hover {
  color: var(--brand-orange);
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}
`;
fs.writeFileSync(path.join(srcDir, 'index.css'), globalCss);

// 2. api.js
const apiJs = `
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export default api;
`;
fs.writeFileSync(path.join(srcDir, 'api.js'), apiJs);

// 3. App.jsx
const appJsx = `
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Data from './pages/Data';
import Compare from './pages/Compare';
import CollegeDetails from './pages/CollegeDetails';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">KCET Compass ⭐</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/data">Colleges</Link>
        <Link to="/compare">Compare</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/data" element={<Data />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/college/:id" element={<CollegeDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
`;
fs.writeFileSync(path.join(srcDir, 'App.jsx'), appJsx);

// 4. Create Pages Dir
if (!fs.existsSync(path.join(srcDir, 'pages'))) {
  fs.mkdirSync(path.join(srcDir, 'pages'));
}
if (!fs.existsSync(path.join(srcDir, 'components'))) {
  fs.mkdirSync(path.join(srcDir, 'components'));
}
console.log('Scaffolded base React files successfully');
