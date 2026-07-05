
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
    document.getElementById('collegeHero').innerHTML = `<h1>Error Loading College</h1><p>${error.message}</p>`;
  }
});


function renderCollege(college) {
  // Update Hero
  const hero = document.getElementById('collegeHero');
  hero.innerHTML = `
    <h1 class="hero-title">${college.collegeName}</h1>
    <p class="hero-subtitle">${college.district || 'District not specified'} • ${college.collegeType || 'Unknown Type'}</p>
    <div class="hero-tags">
      <span class="tag">Code: ${college.collegeCode || 'N/A'}</span>
      <span class="tag">Location: ${college.location || 'N/A'}</span>
    </div>
  `;

  // Render Courses as a Data Table
  const tableContainer = document.getElementById('coursesGrid');
  if (!college.courses || college.courses.length === 0) {
    tableContainer.innerHTML = '<div class="empty-state">No course data available.</div>';
  } else {
    let tableHtml = `
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Course Name</th>
              <th class="text-right">GM Cutoff</th>
              <th class="text-right">GMK Cutoff</th>
              <th class="text-right">GMR Cutoff</th>
            </tr>
          </thead>
          <tbody>
    `;

    tableHtml += college.courses.map(course => {
      const cutoffs = course.cutoffs || {};
      const gm = cutoffs['GM'] || '--';
      const gmk = cutoffs['GMK'] || '--';
      const gmr = cutoffs['GMR'] || '--';

      return `
        <tr>
          <td class="font-medium">${course.courseName}</td>
          <td class="text-right">${gm}</td>
          <td class="text-right text-muted">${gmk}</td>
          <td class="text-right text-muted">${gmr}</td>
        </tr>
      `;
    }).join('');

    tableHtml += `
          </tbody>
        </table>
      </div>
    `;
    tableContainer.innerHTML = tableHtml;
  }

  document.getElementById('collegeMain').classList.remove('hidden');
}

