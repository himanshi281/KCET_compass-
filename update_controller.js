const fs = require('fs');

let js = fs.readFileSync('backend/controllers/collegeController.js', 'utf8');

const newController = `
// ==========================================
// ✅ GET COLLEGE BY ID
// ==========================================

const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    res.json(college);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
`;

js = js.replace(/module\.exports\s*=\s*\{([\s\S]*?)\};/, newController + '\nmodule.exports = {$1, getCollegeById};');

fs.writeFileSync('backend/controllers/collegeController.js', js, 'utf8');
console.log('Added getCollegeById to collegeController.js');
