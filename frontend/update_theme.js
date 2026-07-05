const fs = require('fs');

// 1. UPDATE BASE.CSS
let baseCss = fs.readFileSync('assets/css/base.css', 'utf8');

// Replace the root variables and @media query with [data-theme] selectors
const vibrantCSS = `
[data-theme="light"] {
  /* Colors - Vibrant Light Theme */
  --bg-main: #f0f4f8; /* Soft airy blue-grey */
  --bg-secondary: #ffffff;
  --bg-tertiary: #f8fafc;
  --bg-hover: #e2e8f0;
  
  --border-color: #cbd5e1;
  --border-hover: #94a3b8;
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;
  
  /* Vibrant Accents */
  --accent-color: #4f46e5;
  --accent-bg: linear-gradient(135deg, #4f46e5, #9333ea);
  --accent-text: #ffffff;
  
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #e11d48;

  --card-gradient: linear-gradient(145deg, #ffffff, #f8fafc);
  --glow-shadow: 0 10px 30px rgba(79, 70, 229, 0.15);
}

[data-theme="dark"] {
  /* Colors - Vibrant Dark Theme */
  --bg-main: #0B0F19; /* Deep midnight blue */
  --bg-secondary: #131B2F; /* Rich surface */
  --bg-tertiary: #1A233A; /* Floating surface */
  --bg-hover: #212D4A;
  
  --border-color: #2E3C5A;
  --border-hover: #4B5E87;
  
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  
  /* Vibrant Accents */
  --accent-color: #8b5cf6;
  --accent-bg: linear-gradient(135deg, #8b5cf6, #06b6d4);
  --accent-text: #ffffff;
  
  --card-gradient: linear-gradient(145deg, #131B2F, #1A233A);
  --glow-shadow: 0 10px 30px rgba(139, 92, 246, 0.25);
}
`;

// Replace the top portion of base.css up to the :root spacing scale
baseCss = baseCss.replace(/:root \{[\s\S]*?\}[\s\S]*?@media \(prefers-color-scheme: dark\) \{[\s\S]*?\}[\s\S]*?\}/, vibrantCSS.trim());
fs.writeFileSync('assets/css/base.css', baseCss, 'utf8');
console.log('Updated base.css themes');

// 2. UPDATE MAIN.JS
let mainJs = fs.readFileSync('assets/js/main.js', 'utf8');

if (!mainJs.includes('function toggleTheme')) {
  const themeLogic = `
// Theme Engine
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeButton(next);
}

function updateThemeButton(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
  }
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeButton(saved);
});
`;
  mainJs = themeLogic + '\n' + mainJs;
  fs.writeFileSync('assets/js/main.js', mainJs, 'utf8');
  console.log('Updated main.js with theme logic');
}

// 3. UPDATE APP.HTML
let appHtml = fs.readFileSync('app.html', 'utf8');

if (!appHtml.includes('id="themeToggleBtn"')) {
  appHtml = appHtml.replace(
    '<div class="auth-buttons">',
    `<div class="auth-buttons">\n      <button id="themeToggleBtn" onclick="toggleTheme()" style="background: transparent; border: 1px solid var(--border-color); color: var(--text-primary);">☀️ Light</button>`
  );
  
  // Inject theme script into head to prevent flash of wrong theme
  const headScript = `
  <script>
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  </script>
  `;
  appHtml = appHtml.replace('</head>', headScript + '</head>');
  fs.writeFileSync('app.html', appHtml, 'utf8');
  console.log('Updated app.html with toggle button');
}

// 4. UPDATE CARDS.CSS
let cardsCss = fs.readFileSync('assets/css/components/cards.css', 'utf8');

// Inject the vibrant gradient and glowing shadow
cardsCss = cardsCss.replace(
  /background: linear-gradient[^;]+;/,
  `background: var(--card-gradient);`
);

cardsCss = cardsCss.replace(
  /box-shadow: var\(--shadow-md\);/g,
  `box-shadow: var(--glow-shadow);`
);

cardsCss = cardsCss.replace(
  /border-color: var\(--text-muted\);/g,
  `border-color: var(--accent-color);`
);

fs.writeFileSync('assets/css/components/cards.css', cardsCss, 'utf8');
console.log('Updated cards.css with vibrant aesthetics');
