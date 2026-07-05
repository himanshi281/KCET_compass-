const fs = require('fs');

let html = fs.readFileSync('app.html', 'utf8');

// Remove <div class="container"> wrapper start
html = html.replace('<div class="container">', '');

// Remove the closing </div> of container which is right before the main script tag
html = html.replace(/<\/div>\s*(<script src="assets\/js\/main\.js"><\/script>)/, '$1');

fs.writeFileSync('app.html', html, 'utf8');
console.log('Fixed app.html');
