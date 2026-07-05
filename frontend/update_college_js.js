const fs = require('fs');
let collegeJs = fs.readFileSync('assets/js/college.js', 'utf8');

const newRenderCollege = `
function renderCollege(college) {
  // Update Hero
  const hero = document.getElementById('collegeHero');
  hero.innerHTML = \`
    <h1 class="hero-title">\${college.collegeName}</h1>
    <p class="hero-subtitle">\${college.district || 'District not specified'} • \${college.collegeType || 'Unknown Type'}</p>
    <div class="hero-tags">
      <span class="tag">Code: \${college.collegeCode || 'N/A'}</span>
      <span class="tag">Location: \${college.location || 'N/A'}</span>
    </div>
  \`;

  // Render Courses as a Data Table
  const tableContainer = document.getElementById('coursesGrid');
  if (!college.courses || college.courses.length === 0) {
    tableContainer.innerHTML = '<div class="empty-state">No course data available.</div>';
  } else {
    let tableHtml = \`
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
    \`;

    tableHtml += college.courses.map(course => {
      const cutoffs = course.cutoffs || {};
      const gm = cutoffs['GM'] || '--';
      const gmk = cutoffs['GMK'] || '--';
      const gmr = cutoffs['GMR'] || '--';

      return \`
        <tr>
          <td class="font-medium">\${course.courseName}</td>
          <td class="text-right">\${gm}</td>
          <td class="text-right text-muted">\${gmk}</td>
          <td class="text-right text-muted">\${gmr}</td>
        </tr>
      \`;
    }).join('');

    tableHtml += \`
          </tbody>
        </table>
      </div>
    \`;
    tableContainer.innerHTML = tableHtml;
  }

  document.getElementById('collegeMain').classList.remove('hidden');
}
`;

// Replace the renderCollege function
collegeJs = collegeJs.replace(/function renderCollege\(college\) {[\s\S]*}/, newRenderCollege);
fs.writeFileSync('assets/js/college.js', collegeJs, 'utf8');
console.log('Updated college.js render function');
