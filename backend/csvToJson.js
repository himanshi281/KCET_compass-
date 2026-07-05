const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const results = [];

fs.createReadStream(path.join(__dirname, "data", "kcet_master.csv"))
  .pipe(csv({
    separator: ",",
    mapHeaders: ({ header }) => header.trim()
  }))

  .on("data", (row) => {
    results.push(row);
  })

  .on("end", () => {

    const groupedColleges = {};

    results.forEach((row) => {

      const code = row["College Code"];

      if (!code) return;

      if (!groupedColleges[code]) {

        groupedColleges[code] = {
          collegeCode: row["College Code"],
          collegeName: row["College Name"],
          location: row["Location"],
          district: row["District"],
          collegeType: row["College Type"],

          courses: []
        };
      }

      groupedColleges[code].courses.push({

        courseName: row["College Course"],

        cutoffs: {
          GM: Number(row["GM"]) || null,
          GMK: Number(row["GMK"]) || null,
          GMR: Number(row["GMR"]) || null
        }
      });
    });

    const finalJson = Object.values(groupedColleges);

    fs.writeFileSync(
      path.join(__dirname, "data", "colleges.json"),
      JSON.stringify(finalJson, null, 2)
    );

    console.log("✅ CSV converted to JSON successfully!");
    console.log(`🎉 Total colleges converted: ${finalJson.length}`);
  });