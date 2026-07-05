const fs = require('fs');
let html = fs.readFileSync('app.html', 'utf8');

// Replace the container contents with a layout grid
// First, create the sidebar wrapper
html = html.replace('    <!-- ✅ TOP BAR -->', '    <div class="app-layout">\n      <aside class="sidebar">\n    <!-- ✅ TOP BAR -->');

// End of compare section is </div>
// Then start the main content
html = html.replace('    <!-- ✅ RESULTS -->', '      </aside>\n\n      <main class="main-content">\n    <!-- ✅ RESULTS -->');

// Also move the search-summary and statsPanel into main-content BEFORE results
const searchSummaryRegex = /<!-- ✅ SEARCH PARAMETERS DISPLAY -->[\s\S]*?(?=<!-- ✅ HIDDEN SEARCH STATE)/;
const summaryMatch = html.match(searchSummaryRegex);
html = html.replace(searchSummaryRegex, '');

const statsPanelRegex = /<!-- ✅ STATS PANEL -->\s*<div id="statsPanel"><\/div>/;
const statsMatch = html.match(statsPanelRegex);
html = html.replace(statsPanelRegex, '');

html = html.replace('<main class="main-content">', '<main class="main-content">\n' + (summaryMatch ? summaryMatch[0] : '') + '\n' + (statsMatch ? statsMatch[0] : ''));

// Close the app-layout div just before the closing container div
html = html.replace('<!--  FLOATING ROBOT -->', '      </main>\n    </div>\n    <!--  FLOATING ROBOT -->');

fs.writeFileSync('app.html', html, 'utf8');
console.log('Updated app.html structure');
