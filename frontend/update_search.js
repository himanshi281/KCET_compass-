const fs = require('fs');

// 1. Update app.html
let html = fs.readFileSync('app.html', 'utf8');

// Insert a modern search bar right before #statsPanel
if (!html.includes('id="globalSearch"')) {
  const searchBarHtml = `
    <!-- 🔍 GLOBAL SEARCH -->
    <div class="global-search-container" style="margin-bottom: var(--space-6);">
      <input type="text" id="globalSearch" placeholder="Search colleges, codes, or locations..." oninput="handleGlobalSearch(event)" style="font-size: 1rem; padding: 12px 16px; border-radius: var(--radius-lg);" />
    </div>
  `;
  html = html.replace('<div id="statsPanel"></div>', searchBarHtml + '\n    <div id="statsPanel"></div>');
  fs.writeFileSync('app.html', html, 'utf8');
  console.log('Added search bar to app.html');
}

// 2. Update main.js
let mainJs = fs.readFileSync('assets/js/main.js', 'utf8');

if (!mainJs.includes('handleGlobalSearch')) {
  // Add globalSearchQuery and handleGlobalSearch function at the top level
  const searchFunc = `
let globalSearchQuery = '';

window.handleGlobalSearch = function(e) {
  globalSearchQuery = (e.target.value || '').toLowerCase();
  renderResults(true);
};
`;
  mainJs = searchFunc + '\n' + mainJs;

  // Now modify renderResults to use it
  // Find paginating overall results first
  mainJs = mainJs.replace(
    /const startIndex = \(currentPage - 1\) \* itemsPerPage;[\s\S]*?const paginatedResults = currentResults\.slice\(startIndex, endIndex\);/,
    `let filteredData = currentResults;
    if (globalSearchQuery) {
      filteredData = currentResults.filter(c => {
        return (
          (c.collegeName || '').toLowerCase().includes(globalSearchQuery) ||
          (c.collegeCode || '').toLowerCase().includes(globalSearchQuery) ||
          (c.district || '').toLowerCase().includes(globalSearchQuery) ||
          (c.collegeType || '').toLowerCase().includes(globalSearchQuery)
        );
      });
    }

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = filteredData.slice(startIndex, endIndex);`
  );

  // Update statsPanel calculation to use filteredData instead of currentResults
  mainJs = mainJs.replace(
    /document\.getElementById\('statsPanel'\)\.innerHTML = `[\s\S]*?<\/div>[\s\S]*?`;/,
    `document.getElementById('statsPanel').innerHTML = \`
      <div class="stat-card">
        <h2>\${filteredData.length}</h2>
        <p>Colleges Found</p>
      </div>
      <div class="stat-card">
        <h2>\${Math.round(filteredData.reduce((acc, curr) => acc + (curr.matchingCourses?.[0]?.cutoffs?.GM || 0), 0) / (filteredData.length || 1))}</h2>
        <p>Avg GM Cutoff</p>
      </div>
      <div class="stat-card">
        <h2>\${favorites.length}</h2>
        <p>Favorites</p>
      </div>
    \`;`
  );

  // Update totalPages calculation at the bottom of renderResults
  mainJs = mainJs.replace(
    /const totalPages = Math\.ceil\(currentResults\.length \/ itemsPerPage\);/,
    '// totalPages already calculated above'
  );
  
  // Fix empty state check
  mainJs = mainJs.replace(
    /if \(currentResults\.length === 0\) \{/,
    'if (filteredData.length === 0) {'
  );

  fs.writeFileSync('assets/js/main.js', mainJs, 'utf8');
  console.log('Updated main.js with real-time global search filtering');
}
