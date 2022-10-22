const UserService = require("./UserService");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Budget = require("../models/Budget");

const balanceTransferByUserId = async (req, res) => {
  const { userFrom, userTo, amount } = req.body;

  if (req.user._id !== userFrom) {
    return res.status(401).json({ msg: "You are not authorized" });
  }

  const User1 = await User.findOne({ _id: userFrom }).exec();
  const User2 = await User.findOne({ _id: userTo }).exec();

  if (!User1) {
    return res.json({ msg: `${userFrom} not found` });
  }
  if (!User2) {
    return res.json({ msg: `${userTo} not found` });
  }
  console.log(User1);
  if (User1.wallet.fundWallet < parseInt(amount)) {
    return res.json({ msg: `${userFrom} has insufficient funds` });
  }
  User1.wallet.fundWallet -= parseInt(amount);
  User2.wallet.fundWallet += parseInt(amount);
  await User1.save();
  await User2.save();
  new Transaction({
    user: userFrom,
    user2: userTo,
    amount,
    type: "Balance Transfer",
    status: "success",
  }).save();
  new Transaction({
    user: userTo,
    user2: userFrom,
    amount,
    type: "Balance Received",
    status: "success",
  }).save();
  res.json({ msg: "Funds transferred" });
};

const depositFunds = async (req, res) => {
  const { userId, amount } = req.body;
  UserService.fetchUserById(userId)
    .then((userData) => {
      userData.wallet.fundWallet += parseInt(amount);
      userData.status.totalDeposit += parseInt(amount);
      userData.save();
      new Transaction({
        user: userId,
        amount: amount,
        type: "Funds Deposit",
        status: "Success",
      }).save();
      res.json({ msg: "Funds deposited" });
    })
    .catch((err) => {
      res.json({ msg: err.message });
    });
};

const ReFunds = async (req, res) => {
  console.log(req.body)
  const { userId, amount } = req.body;

  const user = await User.findOne({ name: userId }).exec();
  let budget = await Budget.findOne({ _id: '62d2da6507141fb2315886bd' }).exec()
  if (user) {

    user.wallet.mainWallet += parseInt(amount);
    if (user.status.totalWithdrawl - parseInt(amount) >= 0) {
      user.status.totalWithdrawl -= parseInt(amount);
    } else {
      user.status.totalWithdrawl = 0;
    }
    budget.purchase += parseInt(amount)
    budget.save()
    user.save();
    new Transaction({
      user: user._id,
      amount: amount,
      type: "Funds Refunded",
      status: "Success",
    }).save();
    res.json({ msg: "Funds Refunded" });
  } else {
    res.status(404).json({ msg: "User not found" });
  }

};

const widthdrawlFunds = async (req, res) => {
  const { userId, amount } = req.body;

  if (req.user._id !== userId) {
    return res.status(401).json({ msg: "You are not authorized" });
  }
  if (parseInt(amount) <= 0) {
    return res.json({ msg: "Insufficient funds" });
  }
  let budget = await Budget.findOne({ _id: '62d2da6507141fb2315886bd' }).exec()
  User.findOne({ _id: userId })
    .then((userData) => {
      if (userData.status.active) {

        userData.wallet.mainWallet -= parseInt(amount);
        userData.status.totalWithdrawl += parseInt(amount);
        userData.save();

        budget.withdrawl += parseInt(amount)
        budget.save()
        new Transaction({
          user: userId,
          amount: parseInt(amount),
          type: "Funds Withdrawal",
          status: "Pending",
        }).save();
        res.json({ msg: "Funds Widthdrawal" });
      } else {
        res.json({ msg: "User not active" });
      }
    })
    .catch((err) => {
      res.json({ msg: err.message });
    });
};

module.exports = {
  balanceTransferByUserId,
  depositFunds,
  widthdrawlFunds,
  ReFunds,
};
