const { findByIdAndUpdate } = require("../models/Budget");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const addNewUser = async (user) => {
  const { name, email, password, phone, admin, wallet, referredBy } =
    user;
  const totalUsers = await User.find({}).countDocuments();
  const referredUser = await User.findOne({ userId: referredBy }).exec();
  const newUser = await User({
    name,
    email,
    password,
    admin,
    phone,
    wallet,
    userId: `OCEAN${3000 + totalUsers + 1}`,
    referredBy: referredUser._id
  });

  // Setting Referral Wallet
  if (referredUser) {
    referredUser.referredUsers.push(newUser._id);
    referredUser.save();
  }
  return newUser.save();
};

const removeUser = async (req, res) => {
  const { id } = req.params;
  try {


    const user = await User.findOne({ _id: id }).exec();
    if (user) {
      const parent = await User.findOne({ _id: user.referredBy }).exec();
      if (parent) {
        parent.referredUsers.pull(id);
        parent.save();
      }
    } else {
      return res.status(400).json({ msg: "User not found" });
    }

    // Delete all transactions
    await Transaction.deleteMany({ userId: id }).exec();

    // Delete user
    await User.findByIdAndDelete(id).exec();

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const fetchAllUsers = async (req, res) => {
  const sort = req.query.sort || "name";
  const order = req.query.order || "asc";
  const filter = req.query.filter || "";
  if (filter == "name") {
    const userNames = await User.find({}, { _id: 1, name: 1, userId: 1, phone: 1, status: 1 });
    return res.json(userNames);
  } else if (filter == "refs") {
    const userNames = await User.find({}, { name: 1, referredUsers: 1 });
    return res.json(userNames);
  }
  const users = await User.find({}, { _id: 1, __v: 0 }).sort({
    [sort]: order,
  });
  res.json(users);
};

const fetchUserById = async (id) => {
  return User.findById(id, { _id: 1, __v: 0, password: 0 });
};

const fetchUserByIdForAdmin = async (id) => {
  return User.findById(id, { _id: 1, __v: 0 });
};

const modifyUserById = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  try {
    const userObj = await User.findByIdAndUpdate(id, user, { new: false });
    res.json({ msg: "User updated", user: userObj });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
}

module.exports = {
  addNewUser,
  removeUser,
  fetchAllUsers,
  fetchUserById,
  modifyUserById,
  fetchUserByIdForAdmin
};
