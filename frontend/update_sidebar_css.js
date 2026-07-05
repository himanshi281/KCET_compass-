const fs = require('fs');
const css = `
/* Adjustments for Sidebar Elements */
.sidebar .top-bar {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: transparent;
  padding: 0;
  border: none;
  margin-bottom: 30px;
}

.sidebar .compare-section {
  background: transparent;
  padding: 0;
  border: none;
  margin-top: 20px;
}

.sidebar select {
  width: 100%;
  margin-bottom: 10px;
}
`;
fs.appendFileSync('assets/css/base.css', css, 'utf8');
console.log('Appended Sidebar CSS fixes');
