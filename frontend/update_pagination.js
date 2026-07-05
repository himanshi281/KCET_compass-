const fs = require('fs');
let js = fs.readFileSync('assets/js/main.js', 'utf8');

// We need to add global pagination state at the top, but we can just inject it into the script or inside renderResults.
// A cleaner way is to just define it inside the script globally before renderResults, or just use properties on window.
const newRender = `
let currentPage = 1;
const itemsPerPage = 15;

function renderResults(resetPage = false) {
  if (resetPage) currentPage = 1;

  const quota = document.getElementById('quota').value;
  const userRank = Number(document.getElementById('rank').value);
  const resultsDiv = document.getElementById('results');

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Paginating overall results first
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = currentResults.slice(startIndex, endIndex);

  let safe = [];
  let moderate = [];
  let dream = [];

  paginatedResults.forEach((college) => {
    const firstCourse = college.matchingCourses?.[0];
    const cutoff = firstCourse?.cutoffs?.[quota] || 0;
    
    college.isFavorite = favorites.includes(college.collegeName);
    college.cutoff = cutoff;

    if (cutoff >= userRank + 10000) {
      college.status = 'Safe';
      safe.push(college);
    } else if (cutoff >= userRank) {
      college.status = 'Moderate';
      moderate.push(college);
    } else {
      college.status = 'Dream';
      dream.push(college);
    }
  });

  const renderCard = (c, index) => \`
    <div class="college-card" onclick="openCollegeModal('\${c._id}')" style="animation-delay:\${index * 0.05}s">
      <button class="favorite-btn" style="background:\${c.isFavorite ? '#ff008c' : 'rgba(255,255,255,0.12)'};box-shadow:\${c.isFavorite ? '0 0 20px rgba(255,20,147,0.45)' : 'none'}" onclick="event.stopPropagation(); toggleFavorite('\${c.collegeName}');">
        \${c.isFavorite ? '♥' : '♡'}
      </button>
      <div class="card-top">
        <h2>\${c.collegeName}</h2>
      </div>
      <p><strong>Code:</strong> \${c.collegeCode || 'N/A'}</p>
      <p><strong>Dist:</strong> \${c.district || 'N/A'}</p>
      <p><strong>Type:</strong> \${c.collegeType || 'N/A'}</p>
      <h3 style="margin-top: 10px; font-size: 0.95rem;">Courses:</h3>
      <ul>
        \${c.matchingCourses ? c.matchingCourses.map(course => \`<li style="font-size:0.85rem;">\${course.courseName} — \${quota}: \${course.cutoffs?.[quota] || 'N/A'}</li>\`).join('') : ''}
      </ul>
    </div>
  \`;

  let html = '';

  if (safe.length > 0) {
    html += \`<h2 class="category-header safe-header">🟢 Safe Colleges</h2><div class="category-grid">\`;
    html += safe.map(renderCard).join('');
    html += \`</div>\`;
  }
  
  if (moderate.length > 0) {
    html += \`<h2 class="category-header moderate-header">🟡 Moderate Colleges</h2><div class="category-grid">\`;
    html += moderate.map(renderCard).join('');
    html += \`</div>\`;
  }

  if (dream.length > 0) {
    html += \`<h2 class="category-header dream-header">🔴 Dream Colleges</h2><div class="category-grid">\`;
    html += dream.map(renderCard).join('');
    html += \`</div>\`;
  }

  if (currentResults.length === 0) {
    html = '<p>No colleges found matching your criteria.</p>';
  } else {
    // Render pagination controls
    const totalPages = Math.ceil(currentResults.length / itemsPerPage);
    html += \`
      <div class="pagination-controls">
        <button onclick="changePage(-1)" \${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        <span>Page \${currentPage} of \${totalPages}</span>
        <button onclick="changePage(1)" \${currentPage === totalPages ? 'disabled' : ''}>Next</button>
      </div>
    \`;
  }

  resultsDiv.innerHTML = html;
}

window.changePage = function(delta) {
  const totalPages = Math.ceil(currentResults.length / itemsPerPage);
  const newPage = currentPage + delta;
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    renderResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
`;

const regex = /function renderResults\(\)\s*\{[\s\S]*?(?=function toggleChatbot|\/\/ ==========================================\s*\/\/ \S* CHATBOT TOGGLE)/;

// Also I need to modify searchColleges to call renderResults(true) so page resets on new search
js = js.replace(/renderResults\(\);/g, 'renderResults(true);');
// Wait, in searchColleges it's called somewhere?
// If not, I'll just replace the function definition.
js = js.replace(regex, newRender + '\n\n');
fs.writeFileSync('assets/js/main.js', js, 'utf8');
console.log('Updated JS pagination');
