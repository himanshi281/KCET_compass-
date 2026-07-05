const fs = require('fs');
let css = fs.readFileSync('assets/css/components/cards.css', 'utf8');

// Update .college-card padding
css = css.replace(/padding:\s*28px;/, 'padding: 16px;');

// Update card top h2
css = css.replace(/font-size:\s*1\.5rem;/, 'font-size: 1.15rem;');

// Update card paragraphs
css = css.replace(/margin-bottom:\s*12px;/, 'margin-bottom: 8px;');
css = css.replace(/line-height:\s*1\.7;/, 'line-height: 1.5; font-size: 0.9rem;');

// Update category grid to enforce 3 columns minmax
// Wait, category-grid is defined in base.css or fix_render.js?
// I appended .category-grid to cards.css before:
css = css.replace(/grid-template-columns: repeat\(auto-fit, minmax\(340px, 1fr\)\);/, 'grid-template-columns: repeat(3, 1fr);');
// Fallback if not matched:
if (!css.includes('grid-template-columns: repeat(3, 1fr);')) {
  css += `
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 50px;
}
  `;
}

// Add pagination styles
css += `
/* ✅ PAGINATION CONTROLS */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  margin-bottom: 60px;
}

.pagination-controls button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.pagination-controls button:disabled {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.3);
  cursor: not-allowed;
}

.pagination-controls button:hover:not(:disabled) {
  background: #2563eb;
}

.pagination-controls span {
  color: #cbd5e1;
  font-weight: 600;
}
`;

fs.writeFileSync('assets/css/components/cards.css', css, 'utf8');
console.log('Updated cards.css sizes and layout');
