const User =
  require("../models/User");



// ==========================================
// ✅ SIGNUP
// ==========================================

exports.signup =
  async (req, res) => {

    try {

      const {

        name,

        email,

        password

      } = req.body;


      const existingUser =
        await User.findOne({

          email

        });


      if (existingUser) {

        return res.status(400)
          .json({

            success: false,

            message:
              "User already exists"

          });

      }


      const newUser =
        new User({

          name,

          email,

          password

        });


      await newUser.save();


      res.status(201).json({

        success: true,

        message:
          "Signup successful"

      });

    }

    catch (error) {

      res.status(500).json({

        success: false,

        message:
          "Server error"

      });

    }

  };



// ==========================================
// ✅ LOGIN
// ==========================================

exports.login =
  async (req, res) => {

    try {

      const {

        email,

        password

      } = req.body;


      const user =
        await User.findOne({

          email

        });


      if (!user) {

        return res.status(404)
          .json({

            success: false,

            message:
              "User not found"

          });

      }


      if (
        user.password !== password
      ) {

        return res.status(401)
          .json({

            success: false,

            message:
              "Incorrect password"

          });

      }


      res.status(200).json({

        success: true,

        message:
          "Login successful",

        user

      });

    }

    catch (error) {

      res.status(500).json({

        success: false,

        message:
          "Server error"

      });

    }

  };