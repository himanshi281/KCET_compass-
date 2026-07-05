const fs = require('fs');
let js = fs.readFileSync('backend/routes/collegeRoutes.js', 'utf8');

if (!js.includes('getCollegeById')) {
  js = js.replace('const {', 'const { getCollegeById,');
  js += '\nrouter.get("/:id", getCollegeById);\n';
  fs.writeFileSync('backend/routes/collegeRoutes.js', js, 'utf8');
  console.log('Added /:id route to collegeRoutes.js');
}
