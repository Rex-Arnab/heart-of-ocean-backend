const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const {
  fetchUserByIdForAdmin,
} = require("../services/UserService");

const getAdminDashboardInfo = async (_req, res) => {
  try {

    // Get Transactions Count
    const TxdCount = await Transaction.countDocuments({}).exec()
    const UserCount = await User.countDocuments({}).exec()

    // Get total Fund Balance From all users
    const totalFundBalance = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $sum: "$wallet.fundWallet" } }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1
        }
      }
    ]).exec()

    res.json({ TxdCount, UserCount, totalFundBalance: totalFundBalance[0].total })
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const noticeBoard = async (req, res) => {
  let adminUser = await Budget.findOne({ _id: '62d2da6507141fb2315886bd' }).exec()
  try {
    adminUser.noticeText = req.body.noticeText
    adminUser.noticeColor = req.body.noticeColor
    await adminUser.save()
    res.json({ msg: "Notice Board Updated" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Server Error" })
  }
}

const noticeSwitch = async (req, res) => {
  let adminUser = await Budget.findOne({ _id: '62d2da6507141fb2315886bd' }).exec()
  try {
    adminUser.noticeSwitch = req.body.value
    await adminUser.save()
    res.json({ msg: "Notice Board Updated" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Server Error" })
  }
}

const getUserById = (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;

    if (id === 'undefined' || id === undefined) {
      return res.status(400).json({ msg: "User not found" });
    }
    fetchUserByIdForAdmin(id).then((data) => {
      return res.json(data);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

const userDisable = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id }).exec();
    if (user) {
      user.status.active = !user.status.active;
      await user.save();
      res.json({ msg: "User disabled", value: user.status.active });
    } else {
      return res.status(400).json({ msg: "User not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
}



module.exports = {
  getAdminDashboardInfo,
  noticeBoard,
  noticeSwitch,
  getUserById,
  userDisable
};
