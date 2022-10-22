const express = require("express");
const app = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

app.get("/", adminController.getAdminDashboardInfo);
app.post("/login", authController.login);
app.get("/:id", authController.verifyToken, authController.verifyAdmin, adminController.getUserById);
app.get("/userDisable/:id", authController.verifyToken, authController.verifyAdmin, adminController.userDisable);
app.post("/noticeBoard", authController.verifyToken, authController.verifyAdmin, adminController.noticeBoard);
app.post("/noticeSwitch", authController.verifyToken, authController.verifyAdmin, adminController.noticeSwitch);
module.exports = app;
