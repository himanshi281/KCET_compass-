const fs = require('fs');
let js = fs.readFileSync('main.js', 'utf8');

const newRender = `function renderResults() {
  const quota = document.getElementById('quota').value;
  const userRank = Number(document.getElementById('rank').value);
  const resultsDiv = document.getElementById('results');

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  let safe = [];
  let moderate = [];
  let dream = [];

  currentResults.forEach((college) => {
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
    <div class="college-card" onclick="openCollegeModal('\${c._id}')" style="animation-delay:\${index * 0.08}s">
      <button class="favorite-btn" style="background:\${c.isFavorite ? '#ff008c' : 'rgba(255,255,255,0.12)'};box-shadow:\${c.isFavorite ? '0 0 20px rgba(255,20,147,0.45)' : 'none'}" onclick="toggleFavorite('\${c.collegeName}')">
        \${c.isFavorite ? '♥' : '♡'}
      </button>
      <div class="card-top">
        <h2>\${c.collegeName}</h2>
      </div>
      <p><strong>College Code:</strong> \${c.collegeCode || 'N/A'}</p>
      <p><strong>District:</strong> \${c.district || 'N/A'}</p>
      <p><strong>College Type:</strong> \${c.collegeType || 'N/A'}</p>
      <h3>Matching Courses:</h3>
      <ul>
        \${c.matchingCourses ? c.matchingCourses.map(course => \`<li>\${course.courseName} — \${quota} Cutoff: \${course.cutoffs?.[quota] || 'N/A'}</li>\`).join('') : ''}
      </ul>
    </div>
  \`;

  let html = '';

  if (safe.length > 0) {
    html += \`<h2 class="category-header safe-header">🟢 Safe Colleges (\${safe.length})</h2><div class="category-grid">\`;
    html += safe.map(renderCard).join('');
    html += \`</div>\`;
  }
  
  if (moderate.length > 0) {
    html += \`<h2 class="category-header moderate-header">🟡 Moderate Colleges (\${moderate.length})</h2><div class="category-grid">\`;
    html += moderate.map(renderCard).join('');
    html += \`</div>\`;
  }

  if (dream.length > 0) {
    html += \`<h2 class="category-header dream-header">🔴 Dream Colleges (\${dream.length})</h2><div class="category-grid">\`;
    html += dream.map(renderCard).join('');
    html += \`</div>\`;
  }

  if (currentResults.length === 0) {
    html = '<p>No colleges found matching your criteria.</p>';
  }

  resultsDiv.innerHTML = html;
}`;

const regex = /function renderResults\(\)\s*\{[\s\S]*?(?=function toggleChatbot|\/\/ ==========================================\s*\/\/ \S* CHATBOT TOGGLE)/;
js = js.replace(regex, newRender + '\n\n');
fs.writeFileSync('main.js', js, 'utf8');
console.log('Successfully replaced renderResults!');
