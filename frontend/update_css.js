const fs = require('fs');

const css = `
/* ✅ APP LAYOUT */
.app-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
  max-width: 1600px;
  margin: 0 auto;
  align-items: start;
}

/* ✅ SIDEBAR */
.sidebar {
  position: sticky;
  top: 40px;
  background: rgba(15, 23, 42, 0.4);
  padding: 24px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.05);
}

.main-content {
  min-width: 0;
}
`;

fs.appendFileSync('assets/css/base.css', css, 'utf8');
console.log('Appended CSS to base.css');
