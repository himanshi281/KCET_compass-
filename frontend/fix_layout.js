const fs = require('fs');

// 1. Rewrite base.css app-layout
let baseCss = fs.readFileSync('assets/css/base.css', 'utf8');

// Replace the old app-layout completely
baseCss = baseCss.replace(/\/\* ✅ APP LAYOUT \*\/[\s\S]*?(?=\/\* Adjustments for Sidebar Elements \*\/|$)/, `/* ✅ APP LAYOUT */
body { margin: 0; overflow: hidden; height: 100vh; }
.app-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* ✅ SIDEBAR */
.sidebar {
  background: rgba(15, 23, 42, 0.95);
  padding: 30px 20px;
  border-right: 1px solid rgba(255,255,255,0.05);
  height: 100%;
  overflow-y: auto;
}

.main-content {
  height: 100vh;
  overflow-y: auto;
  padding: 40px;
  min-width: 0;
  position: relative;
}
`);
fs.writeFileSync('assets/css/base.css', baseCss, 'utf8');

// 2. Rewrite cards.css for better design
let cardsCss = fs.readFileSync('assets/css/components/cards.css', 'utf8');

// Make cards modern!
cardsCss = cardsCss.replace(/\.college-card \{[\s\S]*?transition:[^;]+;/g, `.college-card {
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.05);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.5s ease forwards;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform, box-shadow;`);

// Fix grid template to use minmax auto-fill so it scales properly on all widths
cardsCss = cardsCss.replace(/grid-template-columns: repeat\(3, 1fr\);/g, 'grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));');

fs.writeFileSync('assets/css/components/cards.css', cardsCss, 'utf8');
console.log('Fixed CSS Layout');
