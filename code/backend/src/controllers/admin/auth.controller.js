const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin, Role } = require("../../models/admin.model"); 

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu." });

    const admin = await Admin.findOne({
      where: { email },
      include: [{ model: Role, as: "role" }], // nếu bạn có association
    });

    if (!admin) return res.status(401).json({ message: "Sai email hoặc mật khẩu." });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ message: "Sai email hoặc mật khẩu." });

    const token = signToken({ id: admin.id, type: "admin", roleId: admin.roleId });

    return res.json({
      token,
      data: {
        admin: { id: admin.id, email: admin.email, roleId: admin.roleId, role: admin.role || null },
      },
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e?.message });
  }
};
