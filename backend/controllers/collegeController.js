const College = require("../models/College");



// ==========================================
// ✅ GET ALL COLLEGES
// ==========================================

const getAllColleges = async (req, res) => {

  try {

    const colleges =
      await College.find();

    res.json(colleges);

  } catch (error) {

    console.log(error);

    res.status(500).json({

      error: error.message

    });

  }
};



// ==========================================
// ✅ SEARCH COLLEGES
// ==========================================

const searchColleges = async (req, res) => {

  try {

    const {
      rank,
      branch,
      location,
      quota
    } = req.query;


    const colleges =
      await College.find();


    let filteredResults = [];



    colleges.forEach((college) => {

      // ==========================
      // LOCATION FILTER
      // ==========================

      if (

        location &&

        !college.district
          ?.toLowerCase()
          .includes(
            location.toLowerCase()
          )

      ) {

        return;
      }



      // ==========================
      // MATCHING COURSES
      // ==========================

      const matchingCourses =

        college.courses.filter((course) => {

          // ======================
          // BRANCH FILTER
          // ======================

          if (

            branch &&

            course.courseName !== branch

          ) {

            return false;
          }



          // ======================
          // QUOTA FILTER
          // ======================

          const cutoff =
            course.cutoffs?.[quota];



          if (!cutoff) {

            return false;
          }



          // ======================
          // RANK FILTER
          // ======================

          if (

            rank &&

            Number(rank) > cutoff

          ) {

            return false;
          }



          return true;

        });



      // ==========================
      // PUSH RESULT
      // ==========================

      if (matchingCourses.length > 0) {

        filteredResults.push({

          ...college.toObject(),

          matchingCourses

        });

      }

    });



    // ==========================
    // SEND RESULTS
    // ==========================

    res.json(filteredResults);

  } catch (error) {

    console.log(error);

    res.status(500).json({

      error: error.message

    });

  }
};



// ==========================================
// ✅ EXPORTS
// ==========================================


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

module.exports = {

  getAllColleges,

  searchColleges
, getCollegeById};