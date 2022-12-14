const express = require("express");
const app = express.Router();
const authController = require("../controllers/authController");
const Transaction = require("../models/Transaction");
const Product = require("../controllers/productController");
const User = require("../models/User");

app.get("/", function (_req, res) {
  res.send("Hello World!");
});

app.get("/ping", (_req, res) => {
  res.send({ msg: "Pong!" })
})

app.get(
  "/token",
  authController.verifyToken,
  authController.verifyAdmin,
  (req, res) => res.json({ msg: "Token is valid", user: req.user })
);

app.get("/txd", authController.verifyToken, async (_req, res) => {
  // list all transactions
  const transactions = await Transaction.find({
    type: {
      $not: { $eq: "Funds Withdrawal" },
    }
  }).sort({ createdAt: -1 });

  res.json(transactions);
});
app.get("/txd/withdrawl", authController.verifyToken, async (_req, res) => {
  // list all transactions
  const transactions = await Transaction.find({ type: "Funds Withdrawal" }).populate("user").sort({ createdAt: -1 });

  res.json(transactions);
});
app.get("/txd/:txd_id", authController.verifyToken, (req, res) => {
  Transaction.find({ _id: req.params.txd_id }, (err, transactions) => {
    if (err) throw err;
    res.json(transactions);
  });
});
app.get("/txd/:user_id/user", authController.verifyToken, (req, res) => {
  Transaction.find({ user: req.params.user_id }, (err, transactions) => {
    if (err) throw err;
    res.json(transactions);
  });
});
app.post("/txd/:txd_id", authController.verifyToken, async (req, res) => {
  // Refund the user
  const txd = await Transaction.findOne({ _id: req.params.txd_id }).exec();
  console.log(txd)

  txd.status = req.body.status;
  let response = "Transaction Successfull";

  if (req.body.status === "Rejected") {
    const user = await User.findOne({ _id: txd.user }).exec();
    if (user) {
      user.wallet.mainWallet += parseInt(txd.amount);
      user.save();
      new Transaction({
        user: user._id,
        amount: txd.amount,
        type: "Funds Refunded",
        status: "Success",
      }).save();
      response = "Transaction Rejected";
    }

  }
  txd.save()
  res.json({ msg: response });
})


app.get("/dashboard/:userId", Product.getDashboardProducts);

app.get("/schedule/rci", async (_req, res) => {
  const users = await User.find({}, { _id: 1 })
  const userList = users.map(user => user._id)
  res.json(userList.filter(user => user != "62cfe8554c089bac16a2fa6d"))
})

app.get("/checkTime", (_req, res) => {
  res.json({
    time: new Date().toLocaleString()
  })
})

app.get("/fill/:id", async (req, res) => {
  const curUser = await User.findOne({ _id: req.params.id }).exec()
  curUser.adminPermissions.fundManagement.fundWithdraw = true;
  curUser.adminPermissions.fundManagement.fundTransfer = true;
  curUser.save()
  res.json({ msg: "Done with " + curUser.name })
})

app.get("/reset/:id", async (req, res) => {
  const curUser = await User.findOne({ _id: req.params.id }).exec()
  curUser.status.rci = 0;
  curUser.status.referralIncome = 0;
  curUser.status.levelIncome = 0;
  curUser.status.SalaryIncome = 0;
  curUser.save()
  res.json({ msg: "Done with " + curUser.name })
})


module.exports = app;
