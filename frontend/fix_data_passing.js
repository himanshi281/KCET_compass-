const fs = require('fs');

// 1. Update main.js anchor tags to save to sessionStorage
let mainJs = fs.readFileSync('assets/js/main.js', 'utf8');

mainJs = mainJs.replace(/<a href="college\.html\?id=\$\{c\._id\}" class="college-card"/g, 
  `<a href="college.html?id=\${c._id}" onclick="sessionStorage.setItem('selectedCollege', JSON.stringify(currentResults.find(x => x._id === '\${c._id}')));" class="college-card"`);

fs.writeFileSync('assets/js/main.js', mainJs, 'utf8');
console.log('Updated main.js with sessionStorage logic');

// 2. Update college.js to read from sessionStorage OR fallback to fetching all colleges
let collegeJs = fs.readFileSync('assets/js/college.js', 'utf8');

const newCollegeJs = `
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const collegeId = urlParams.get('id');

  if (!collegeId) {
    document.getElementById('collegeHero').innerHTML = '<h1>Error: No College ID Provided</h1><p>Please go back to the dashboard and select a valid college.</p>';
    return;
  }

  try {
    let college;
    // 1. Try to get the college from sessionStorage (No API Call!)
    const storedCollege = sessionStorage.getItem('selectedCollege');
    if (storedCollege) {
      college = JSON.parse(storedCollege);
    }
    
    // Validate that the stored college matches the ID (in case of stale data)
    if (!college || college._id !== collegeId) {
      // 2. Fallback: Fetch all colleges and find it (Using the existing working API)
      const res = await fetch('http://localhost:5000/api/colleges');
      if (!res.ok) throw new Error('Failed to fetch colleges data');
      const allColleges = await res.json();
      college = allColleges.find(c => c._id === collegeId);
      
      if (!college) throw new Error('College not found in database');
    }

    renderCollege(college);
  } catch (error) {
    console.error(error);
    document.getElementById('collegeHero').innerHTML = \`<h1>Error Loading College</h1><p>\${error.message}</p>\`;
  }
});

function renderCollege(college) {
  // Update Hero
  const hero = document.getElementById('collegeHero');
  hero.innerHTML = \`
    <h1>\${college.collegeName}</h1>
    <p>\${college.location || 'Location not specified'} | \${college.district || 'District not specified'}</p>
  \`;

  // Update Stats
  document.getElementById('collegeCode').textContent = college.collegeCode || 'N/A';
  document.getElementById('collegeDistrict').textContent = college.district || 'N/A';
  document.getElementById('collegeType').textContent = college.collegeType || 'N/A';

  // Render Courses
  const grid = document.getElementById('coursesGrid');
  if (!college.courses || college.courses.length === 0) {
    grid.innerHTML = '<p>No course data available for this college.</p>';
  } else {
    grid.innerHTML = college.courses.map(course => {
      const cutoffs = course.cutoffs || {};
      const gm = cutoffs['GM'] || '--';
      const gmk = cutoffs['GMK'] || '--';
      const gmr = cutoffs['GMR'] || '--';

      return \`
        <div class="course-card">
          <h3>\${course.courseName}</h3>
          <div class="cutoffs-grid">
            <div class="cutoff-item">
              <span>GM</span>
              <strong>\${gm}</strong>
            </div>
            <div class="cutoff-item">
              <span>GMK</span>
              <strong>\${gmk}</strong>
            </div>
            <div class="cutoff-item">
              <span>GMR</span>
              <strong>\${gmr}</strong>
            </div>
          </div>
        </div>
      \`;
    }).join('');
  }

  // Show main content
  document.getElementById('collegeMain').classList.remove('hidden');
}
`;

fs.writeFileSync('assets/js/college.js', newCollegeJs, 'utf8');
console.log('Updated college.js to avoid unnecessary API calls');
