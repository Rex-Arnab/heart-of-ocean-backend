const express = require("express");
const app = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const productController = require("../controllers/productController");

app.get("/", userController.getAllUsers);
app.get("/:id", userController.getUserById);
app.get("/referral/:phone", userController.getUserByPhone);
app.get("/:id/buy", authController.verifyToken, productController.buyProduct);
app.post("/rci/income", authController.verifyToken, authController.verifyAdmin, userController.getRciIncome);
app.post("/salary/income", authController.verifyToken, authController.verifyAdmin, userController.getSalaryIncome);
app.get("/activate/:id", userController.activateUser);
app.get("/check/:userId", userController.checkReferral)

app.put("/:id", authController.verifyToken, authController.verifyAdmin, authController.verifyEditUserPermission, userController.getUserDetails);

app.post("/register", authController.reqister);
app.post("/login", authController.login);
app.post("/deposit", authController.verifyToken,
  authController.verifyAdmin,
  // authController.verifyFundDepositPermission,
  userController.depositById);
app.post("/refund", authController.verifyToken, authController.verifyAdmin, userController.ReFundsById);
app.post("/widthdrawl", authController.verifyToken, authController.verifyFundWithdrawPermission, userController.widthdrawlById);
app.post("/bank/:userId", authController.verifyToken, userController.saveBankDetails);

app.post("/:id", authController.verifyToken, userController.changePassword);

app.post(
  "/transfer/balance",
  authController.verifyToken,
  // authController.verifyFundTransferPermission,
  userController.transferBalance
);
app.delete(
  "/:id",
  authController.verifyToken,
  authController.verifyAdmin,
  authController.verifyDeleteUserPermission,
  userController.deleteById
);

module.exports = app;
