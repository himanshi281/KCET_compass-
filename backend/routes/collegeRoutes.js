const express = require("express");

const router = express.Router();

const { getCollegeById,

  getAllColleges,

  searchColleges

} = require("../controllers/collegeController");



// ✅ GET ALL COLLEGES

router.get(
  "/",
  getAllColleges
);



// ✅ SEARCH

router.get(
  "/search",
  searchColleges
);



module.exports = router;
router.get("/:id", getCollegeById);
