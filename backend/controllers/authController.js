const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==========================================
// ✅ SIGNUP
// ==========================================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    user = new User({ name, email, password });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          success: true,
          message: "Signup successful",
          token,
          user: { id: user.id, name: user.name, email: user.email, likedColleges: user.likedColleges, avatar: user.avatar }
        });
      }
    );
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// ✅ LOGIN
// ==========================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('likedColleges');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    
    // Also allow old plaintext passwords if they haven't been hashed yet (for backwards compatibility if they created users before)
    if (!isMatch && user.password !== password) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    // Create JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          user: { id: user.id, name: user.name, email: user.email, likedColleges: user.likedColleges, avatar: user.avatar }
        });
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// ✅ GET PROFILE
// ==========================================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('likedColleges');
    res.json({ success: true, user });
  } catch (error) {
    console.error("Get Profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// ✅ TOGGLE LIKE COLLEGE
// ==========================================
exports.toggleLike = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const collegeId = req.params.collegeId;

    const isLiked = user.likedColleges.some(id => id.toString() === collegeId);

    if (isLiked) {
      user.likedColleges = user.likedColleges.filter(id => id.toString() !== collegeId);
    } else {
      user.likedColleges.push(collegeId);
    }

    await user.save();
    
    const updatedUser = await User.findById(req.user.id).select('-password').populate('likedColleges');
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Toggle Like error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// ✅ UPDATE AVATAR
// ==========================================
exports.updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ success: false, message: "Avatar is required" });
    }

    user.avatar = avatar;
    await user.save();
    
    const updatedUser = await User.findById(req.user.id).select('-password').populate('likedColleges');
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update Avatar error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};