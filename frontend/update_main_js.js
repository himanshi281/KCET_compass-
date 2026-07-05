const fs = require('fs');
let js = fs.readFileSync('assets/js/main.js', 'utf8');

const newRenderCard = `
  const renderCard = (c, index) => {
    const courseCount = c.matchingCourses ? c.matchingCourses.length : 0;
    return \`
    <a href="college.html?id=\${c._id}" onclick="sessionStorage.setItem('selectedCollege', JSON.stringify(currentResults.find(x => x._id === '\${c._id}')));" class="college-card linear-card" style="animation-delay:\${index * 0.03}s">
      <div class="card-header">
        <h3 class="card-title" title="\${c.collegeName}">\${c.collegeName}</h3>
        <button class="favorite-btn \${c.isFavorite ? 'active' : ''}" onclick="event.preventDefault(); toggleFavorite('\${c.collegeName}');" title="Toggle Favorite">
          \${c.isFavorite ? '♥' : '♡'}
        </button>
      </div>
      <p class="card-subtitle">\${c.district || 'Unknown Dist'} • \${c.collegeType || 'Unknown Type'}</p>
      
      <div class="card-tags">
        <span class="tag code-tag">\${c.collegeCode || 'N/A'}</span>
        <span class="tag highlight-tag">\${courseCount} Matching Course\${courseCount !== 1 ? 's' : ''}</span>
      </div>
      
      <div class="card-footer">
        <span class="action-text">View Details →</span>
      </div>
    </a>
    \`;
  };
`;

// Replace old renderCard in main.js
// The old renderCard starts with const renderCard = (c, index) => ` and ends right before let html = '';
js = js.replace(/const renderCard = \(c, index\) => `[\s\S]*?<\/a>\s*`;/, newRenderCard);

// Also change the category headers to be smaller and modern
js = js.replace(/<h2 class="category-header safe-header">🟢 Safe Colleges<\/h2>/g, '<h2 class="category-header">Safe Colleges</h2>');
js = js.replace(/<h2 class="category-header moderate-header">🟡 Moderate Colleges<\/h2>/g, '<h2 class="category-header">Moderate Colleges</h2>');
js = js.replace(/<h2 class="category-header dream-header">🔴 Dream Colleges<\/h2>/g, '<h2 class="category-header">Dream Colleges</h2>');

fs.writeFileSync('assets/js/main.js', js, 'utf8');
console.log('Updated main.js renderCard');
