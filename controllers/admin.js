const User = require("../models/user");
const Admin = require("../models/admin");

module.exports = {
  getUsers: async (req, res) => {
    const { adminId } = req.params;
    try {
      const admin = await Admin.findById(adminId).populate("users");
      if (!admin) return res.status(404).json({ message: "UnAuthorized" });

      res.status(200).json({ users: admin.users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteUser: async (req, res) => {
    let userId = req.params.id;
    const { adminId } = req.params;
    try {
      const admin = await Admin.findById(adminId).populate("users");
      if (!admin) return res.status(404).json({ message: "UnAuthorized" });

      let user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User was not found" });

      await user.remove();

      await admin.updateOne({ $pull: { users: userId } });

      res.status(200).json({ message: "User was deletes successfuly!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  createAdmin: async (req, res) => {
    let newAdmin = new Admin(req.body);
    try {
      await newAdmin.save();
      res.status(200).json({ message: "Admin is created" });
    } catch (error) {}
  },
};
