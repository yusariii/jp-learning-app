const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User  = require("../../models/user.model"); 
// level enum: N5..N1 (theo model)

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

module.exports.register = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password, fullName, level } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email và mật khẩu là bắt buộc." });
    }

    const existed = await User.findOne({ email: email });
    if (existed) return res.status(409).json({ message: "Email đã tồn tại." });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hash,
      fullName: fullName || null,
      level: level || "N5",
    });

    const token = signToken({ id: user._id, type: "user" });

    return res.status(201).json({
      token,
      data: { 
        user: { 
          _id: user._id, 
          email: user.email, 
          fullName: user.fullName, 
          level: user.level,
          progress: user.progress || [],
          streak: user.streak || 0,
        } 
      },
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e?.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu." });

    const user = await User.findOne({ email: email });
    if (!user) return res.status(401).json({ message: "Sai email hoặc mật khẩu." });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Sai email hoặc mật khẩu." });

    const token = signToken({ id: user._id, type: "user" });

    return res.json({
      token,
      data: { 
        user: { 
          _id: user._id, 
          email: user.email, 
          fullName: user.fullName, 
          level: user.level,
          progress: user.progress || [],
          streak: user.streak || 0,
        } 
      },
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e?.message });
  }
};
