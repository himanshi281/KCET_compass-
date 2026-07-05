
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Data from './pages/Data';
import Search from './pages/Search';
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
        <Route path="/search" element={<Search />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/college/:id" element={<CollegeDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
