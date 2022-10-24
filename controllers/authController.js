const jwt = require("jsonwebtoken");
const Budget = require("../models/Budget");
const Product = require("../models/Product");
const User = require("../models/User");

const { addNewUser } = require("../services/UserService");

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const verifyToken = (req, res, next) => {
  const { token } = req.headers;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      res.json({ msg: "Invalid token" });
    } else {
      const admin = await User.findOne({ _id: decoded._id }, { adminPermissions: 1 }).exec();
      req.user = { ...decoded, adminPermissions: admin.adminPermissions }
      next();
    }
  });
};

const verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    res.json({ msg: "You are not authorized" });
  }
};

const verifyFundDepositPermission = (req, res, next) => {
  const admin = req.user;

  if (admin.adminPermissions.fundManagement.fundDeposit) {
    next();
  } else {
    res.json({ msg: "You Don't have Permission" });
  }
}

const verifyFundTransferPermission = (req, res, next) => {
  const admin = req.user;

  if (admin.adminPermissions.fundManagement.fundTransfer) {
    next();
  } else {
    res.json({ msg: "You Don't have Permission" });
  }
}

const verifyFundWithdrawPermission = (req, res, next) => {
  const admin = req.user;

  if (admin.adminPermissions.fundManagement.fundWithdraw) {
    next();
  } else {
    res.json({ msg: "You Don't have Permission" });
  }
}

const verifyEditUserPermission = (req, res, next) => {
  const admin = req.user;

  if (admin.adminPermissions.userManagement.editUser) {
    next();
  } else {
    res.json({ msg: "You Don't have Permission" });
  }
}

const verifyDeleteUserPermission = (req, res, next) => {
  const admin = req.user;

  if (admin.adminPermissions.userManagement.deleteUser) {
    next();
  } else {
    res.json({ msg: "You Don't have Permission" });
  }
}

const login = async (req, res) => {
  const { phone, password } = req.body;
  try {

    let user;
    user = await User.findOne({ phone, password }).exec();
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    } else if (user.password !== password) {
      return res.status(401).json({ msg: "Invalid password" });
    } else {
      const team = await User.find(
        {
          _id: {
            $in: user.referredUsers,
          },
        },
        { userId: 1, name: 1, referredUsers: 1 }
      ).exec();


      let budget = await Budget.findOne({ _id: '62d2da6507141fb2315886bd' }).exec()
      if (user.admin) {
        return res.json({
          token: generateToken({
            _id: user._id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            phone: user.phone,
          }),
          user: {
            _id: user._id,
            userId: user.userId,
            phone: user.phone,
            name: user.name,
            email: user.email,
            admin: user.admin,
            adminStat: budget,
            wallet: user.wallet,
            bank: user.bank,
            team,
            status: user.status,
          },
        });
      }
      return res.json({
        token: generateToken({
          _id: user._id,
          name: user.name,
          email: user.email,
          admin: user.admin,
          phone: user.phone,
        }),
        user: {
          _id: user._id,
          userId: user.userId,
          phone: user.phone,
          name: user.name,
          email: user.email,
          wallet: user.wallet,
          bank: user.bank,
          notice: {
            text: budget.noticeText,
            color: budget.noticeColor,
            switch: budget.noticeSwitch,
          },
          team,
          status: user.status,
        },
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

const reqister = async (req, res) => {
  try {
    const { name, email, phone, password, admin, referredBy } = req.body;
    let refID = referredBy;

    if (phone) {
      const temp = await User.findOne({ phone: phone }).exec();
      if (temp) {
        return res.status(400).json({ msg: "Phone number already exists" });
      }
    }
    if (email) {
      const temp = await User.findOne({ email: email }).exec();
      if (temp) {
        return res.status(400).json({ msg: "Email already exists" });
      }
    }
    // if (refID.includes("ocean") || refID.includes("OCEAN")) {
    //   refID = await User.findOne({ userId: refID }).exec();
    //   if (!refID) {
    //     return res.status(400).json({ msg: "Invalid Referral ID" });
    //   }
    //   refID = refID._id;
    // }
    const user = addNewUser({
      name,
      email,
      phone,
      password,
      admin,
      wallet: { fundWallet: 0, mainWallet: 0, referralWallet: 0 },
      referredBy: refID,
    });
    user
      .then((me) => {
        res.json({ userId: me.userId });
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.json({ msg: "User already exists" });
        } else {
          res.json({ msg: err.message });
        }
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  generateToken,
  verifyToken,
  verifyAdmin,
  login,
  reqister,
  verifyFundDepositPermission,
  verifyFundTransferPermission,
  verifyFundWithdrawPermission,
  verifyEditUserPermission,
  verifyDeleteUserPermission,
};
