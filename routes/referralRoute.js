const express = require("express");
const User = require("../models/User");
const app = express.Router();
const userController = require("../controllers/userController");

app.get("/down/:id", async (req, res) => {
    const { id } = req.params;
    // try {

    const user = await User.findOne({ _id: id });
    const referredUsers = await User.find({
        _id: {
            $in: user.referredUsers,
        },
    }, { name: 1, userId: 1, referredUsers: 1, boughtProducts: 1 }).populate({ path: "boughtProducts._id", select: "price" }).exec();

    if (user && referredUsers.length > 0) {
        return res.json({ referredUsers });
    }
    return res.status(400).json({ msg: "User doesnt have referral" });
    // } catch (error) {
    //     return res.status(400).json({ msg: "User doesnt have referral" });
    // }
});

app.get("/overview/:userId", userController.UserOverview);
app.get("/income/:userId", userController.UserOverviewIncome);
app.get("/level/:userId", userController.getLevelIncome);

module.exports = app;