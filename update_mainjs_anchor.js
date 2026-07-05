const fs = require('fs');

let js = fs.readFileSync('frontend/assets/js/main.js', 'utf8');

// Replace the div with anchor tag
js = js.replace(/<div class="college-card" onclick="openCollegeModal\('\\?\$\{c\._id\}'\)"/g, '<a href="college.html?id=${c._id}" class="college-card" style="display:block; text-decoration:none; color:inherit;"');
js = js.replace(/<\/ul>\s*<\/div>/g, '</ul>\n    </a>');

fs.writeFileSync('frontend/assets/js/main.js', js, 'utf8');
console.log('Modified main.js to use anchor tags');
