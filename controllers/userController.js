const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

const {
  removeUser,
  fetchAllUsers,
  fetchUserById,
  modifyUserById
} = require("../services/UserService");
const {
  balanceTransferByUserId,
  depositFunds,
  widthdrawlFunds,
  ReFunds,
} = require("../services/TransferService");
const User = require("../models/User");

const getAllUsers = fetchAllUsers;
const getUserById = (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  fetchUserById(id).then((data) => {
    res.json(data);
  });
};

const depositById = depositFunds;
const widthdrawlById = widthdrawlFunds;
const ReFundsById = ReFunds;

const deleteById = removeUser;
const transferBalance = balanceTransferByUserId;

// Function to convert object to array
function objectToArray(obj) {
  return Object.keys(obj).map(key => obj[key].referredUsers);
}

async function fetchUserArrayReferrals(tempUser) {
  let temp = [];
  if (tempUser.length > 0) {
    temp = await User.find({
      _id: {
        $in: tempUser
      }
    }, {
      referredUsers: 1,
      _id: 0
    })
    temp = [...objectToArray(temp).flat()]
  }
  return temp;
}

async function creditLevelIncomeToSingleUser(tempUser, curUser, adminUser, rate, level) {
  try {

    if (tempUser.length > 0) {
      tempUser.map(async user => {
        console.log("================================")
        console.log("CHECKING USER : ", user)
        let t = await User.findOne({ _id: user }).exec()
        if (t === null) {
          return
        }
        console.log(t)
        if (t.status.active) {
          let balance = t.status.rci * rate;
          curUser.wallet.mainWallet += balance
          curUser.status.levelIncome += balance
          curUser.status.totalIncome += balance;
          if (level === 1) {
            curUser.incomeOverview.level1 += balance;
          } else if (level === 2) {
            curUser.incomeOverview.level2 += balance;
          } else if (level === 3) {
            curUser.incomeOverview.level3 += balance;
          } else if (level === 4) {
            curUser.incomeOverview.level4 += balance;
          } else if (level === 5) {
            curUser.incomeOverview.level5 += balance;
          } else if (level === 6) {
            curUser.incomeOverview.level6 += balance;
          } else if (level === 7) {
            curUser.incomeOverview.level7 += balance;
          } else if (level === 8) {
            curUser.incomeOverview.level8 += balance;
          } else if (level === 9) {
            curUser.incomeOverview.level9 += balance;
          } else if (level === 10) {
            curUser.incomeOverview.level10 += balance;
          } else if (level === 11) {
            curUser.incomeOverview.level11 += balance;
          } else if (level === 12) {
            curUser.incomeOverview.level12 += balance;
          } else if (level === 13) {
            curUser.incomeOverview.level13 += balance;
          } else if (level === 14) {
            curUser.incomeOverview.level14 += balance;
          } else if (level === 15) {
            curUser.incomeOverview.level15 += balance;
          } else if (level === 16) {
            curUser.incomeOverview.level16 += balance;
          } else if (level === 17) {
            curUser.incomeOverview.level17 += balance;
          } else if (level === 18) {
            curUser.incomeOverview.level18 += balance;
          } else if (level === 19) {
            curUser.incomeOverview.level19 += balance;
          } else if (level === 20) {
            curUser.incomeOverview.level20 += balance;
          } else if (level === 21) {
            curUser.incomeOverview.level21 += balance;
          } else if (level === 22) {
            curUser.incomeOverview.level22 += balance;
          } else if (level === 23) {
            curUser.incomeOverview.level23 += balance;
          } else if (level === 24) {
            curUser.incomeOverview.level24 += balance;
          } else if (level === 25) {
            curUser.incomeOverview.level25 += balance;
          } else if (level === 26) {
            curUser.incomeOverview.level26 += balance;
          } else if (level === 27) {
            curUser.incomeOverview.level27 += balance;
          } else if (level === 28) {
            curUser.incomeOverview.level28 += balance;
          } else if (level === 29) {
            curUser.incomeOverview.level29 += balance;
          } else if (level === 30) {
            curUser.incomeOverview.level30 += balance;
          }
          adminUser.level += balance

          if (t.status.rci * rate > 0) {
            new Transaction({
              user: curUser,
              amount: balance,
              type: `LEVEL Income Received from ${t.name}`,
              status: "Success",
            }).save();
          }
        }
      })
    }
  } catch (err) {
    console.log(err)
  }

}

const getLevelIncome = async (req, res) => {
  const { userId } = req.params;
  const getCommission = new Date().getDay() !== 6 || new Date().getDay() !== 0;
  try {

    if (getCommission) {

      // const curUser = await User.findById(userId).exec()
      const curUser = await User.findOne({ _id: userId }).populate({
        path: "referredUsers", select: "status.active"
      }).exec()

      if (curUser.status.active) {

        let adminUser = await Budget.findOne({ _id: '62d2da6507141fb2315886bd' }).exec()

        // const directRefs = curUser.referredUsers.length;

        const directUsers = curUser.referredUsers.map(user => user.status.active)
        const directRefs = directUsers.filter(user => user).length; // Counting Direct Active Users

        // user.save()
        let user1 = await User.find({
          _id: {
            $in: curUser
          }
        }, {
          referredUsers: 1,
          _id: 0
        })

        user1 = [...objectToArray(user1).flat()]

        if (directRefs > 0)
          creditLevelIncomeToSingleUser(user1, curUser, adminUser, 0.1, 1)
        let user2 = await fetchUserArrayReferrals(user1)
        if (directRefs > 1)
          creditLevelIncomeToSingleUser(user2, curUser, adminUser, 0.08, 2)
        let user3 = await fetchUserArrayReferrals(user2)
        if (directRefs > 2)
          creditLevelIncomeToSingleUser(user3, curUser, adminUser, 0.06, 3)
        let user4 = await fetchUserArrayReferrals(user3)
        if (directRefs > 3)
          creditLevelIncomeToSingleUser(user4, curUser, adminUser, 0.04, 4)
        let user5 = await fetchUserArrayReferrals(user4)
        if (directRefs > 4)
          creditLevelIncomeToSingleUser(user5, curUser, adminUser, 0.02, 5)
        let user6 = await fetchUserArrayReferrals(user5)
        if (directRefs > 5)
          creditLevelIncomeToSingleUser(user6, curUser, adminUser, 0.01, 6)
        let user7 = await fetchUserArrayReferrals(user6)
        if (directRefs > 6)
          creditLevelIncomeToSingleUser(user7, curUser, adminUser, 0.01, 7)
        let user8 = await fetchUserArrayReferrals(user7)
        if (directRefs > 7)
          creditLevelIncomeToSingleUser(user8, curUser, adminUser, 0.01, 8)
        let user9 = await fetchUserArrayReferrals(user8)
        if (directRefs > 8)
          creditLevelIncomeToSingleUser(user9, curUser, adminUser, 0.01, 9)
        let user10 = await fetchUserArrayReferrals(user9)
        if (directRefs > 9)
          creditLevelIncomeToSingleUser(user10, curUser, adminUser, 0.01, 10)
        let user11 = await fetchUserArrayReferrals(user10)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user11, curUser, adminUser, 0.005, 11)
        let user12 = await fetchUserArrayReferrals(user11)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user12, curUser, adminUser, 0.005, 12)
        let user13 = await fetchUserArrayReferrals(user12)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user13, curUser, adminUser, 0.005, 13)
        let user14 = await fetchUserArrayReferrals(user13)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user14, curUser, adminUser, 0.005, 14)
        let user15 = await fetchUserArrayReferrals(user14)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user15, curUser, adminUser, 0.005, 15)
        let user16 = await fetchUserArrayReferrals(user15)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user16, curUser, adminUser, 0.005, 16)
        let user17 = await fetchUserArrayReferrals(user16)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user17, curUser, adminUser, 0.005, 17)
        let user18 = await fetchUserArrayReferrals(user17)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user18, curUser, adminUser, 0.005, 18)
        let user19 = await fetchUserArrayReferrals(user18)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user19, curUser, adminUser, 0.005, 19)
        let user20 = await fetchUserArrayReferrals(user19)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user20, curUser, adminUser, 0.0025, 20)
        let user21 = await fetchUserArrayReferrals(user20)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user21, curUser, adminUser, 0.0025, 21)
        let user22 = await fetchUserArrayReferrals(user21)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user22, curUser, adminUser, 0.0025, 22)
        let user23 = await fetchUserArrayReferrals(user22)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user23, curUser, adminUser, 0.0025, 23)
        let user24 = await fetchUserArrayReferrals(user23)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user24, curUser, adminUser, 0.0025, 24)
        let user25 = await fetchUserArrayReferrals(user24)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user25, curUser, adminUser, 0.0025, 25)
        let user26 = await fetchUserArrayReferrals(user25)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user26, curUser, adminUser, 0.0025, 26)
        let user27 = await fetchUserArrayReferrals(user26)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user27, curUser, adminUser, 0.0025, 27)
        let user28 = await fetchUserArrayReferrals(user27)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user28, curUser, adminUser, 0.0025, 28)
        let user29 = await fetchUserArrayReferrals(user28)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user29, curUser, adminUser, 0.0025, 29)
        let user30 = await fetchUserArrayReferrals(user29)
        if (directRefs >= 10)
          creditLevelIncomeToSingleUser(user30, curUser, adminUser, 0.0025, 30)

        curUser.save()
        adminUser.save()


        res.json({
          levelIncome: curUser.status.levelIncome,
          directRefs
        })
      } else {
        res.json({
          levelIncome: 0,
          directRefs: 0
        })
      }
    } else {
      res.json({
        levelIncome: 0,
        directRefs: 0
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      error: err
    })
  }
}

const getRciIncome = async (req, res) => {
  const { userId } = req.body;

  const getCommission = new Date().getDay() !== 6 || new Date().getDay() !== 0;

  try {

    if (getCommission) {
      const budget = await Budget.findOne({ _id: '62d2da6507141fb2315886bd' })
      const user = await fetchUserById(userId);
      if (user.status.active) {

        // console.log(user);
        if (user.boughtProducts.length > 0) {
          const productList = user.boughtProducts;
          let productPrices = [];

          for (let i = 0; i < productList.length; i++) {
            const product = await Product.findOne({ _id: productList[i] }).exec();
            productPrices.push(product.price);
          }

          let sum = productPrices.reduce((a, b) => a + b);
          if (sum >= 800000) {
            sum = 8000;
          } else if (sum >= 400000) {
            sum = 3400;
          } else if (sum >= 240000) {
            sum = 1800;
          } else if (sum >= 160000) {
            sum = 1200;
          } else if (sum >= 80000) {
            sum = 560;
          } else if (sum >= 40000) {
            sum = 280;
          } else if (sum >= 16000) {
            sum = 104;
          } else if (sum >= 8000) {
            sum = 48;
          } else if (sum >= 4000) {
            sum = 22;
          } else if (sum >= 2000) {
            sum = 10;
          }

          budget.rci += sum;
          user.status.rci = sum;
          user.status.referralIncome = 0;
          user.status.levelIncome = 0;
          user.status.SalaryIncome = 0;
          user.wallet.mainWallet += sum;
          user.status.totalIncome += sum;


          await user.save();

          await budget.save();



          await new Transaction({
            user: user._id,
            amount: sum,
            type: "RCI Income Received",
            status: "Success",
          }).save();



          res.json({
            current: sum,
            msg: "RCI updated",
          });

        } else {
          res.json({
            current: 0,
            msg: "No products bought",
          });

        }

      } else {
        res.json({
          current: 0,
          msg: "User not active",
        });
      }
    } else {
      res.json({
        current: 0,
        msg: "Not a working day",
      });
    }


  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
}

const getSalaryIncome = async (req, res) => {
  const { userId } = req.body;
  try {

    const user = await fetchUserById(userId);
    if (user.status.active) {

      if (user.boughtProducts.length > 0) {
        const productList = user.boughtProducts;
        let productPrices = [];

        for (let i = 0; i < productList.length; i++) {
          const product = await Product.findOne({ _id: productList[i] }).exec();
          productPrices.push(product.price);
        }

        const tempSalary = productPrices.reduce((a, b) => a + b);
        let salary = 0;
        let rank = 'newbie';

        if (tempSalary >= 100000000) {
          salary = 30000;
          rank = 'King of Future Grow'
        } else if (tempSalary >= 50000000) {
          salary = 15000;
          rank = 'Crown'
        } else if (tempSalary >= 15000000) {
          salary = 10000;
          rank = 'Diamond'
        } else if (tempSalary >= 5000000) {
          salary = 5000;
          rank = 'Emerald'
        } else if (tempSalary >= 1000000) {
          salary = 2300;
          rank = 'Platinum'
        } else if (tempSalary >= 560000) {
          salary = 1700;
          rank = 'Gold'
        } else if (tempSalary >= 310000) {
          salary = 1200;
          rank = 'Star'
        } else if (tempSalary >= 150000) {
          salary = 800;
          rank = 'Ruby'
        } else if (tempSalary >= 70000) {
          salary = 500;
          rank = 'Silver'
        } else if (tempSalary >= 30000) {
          salary = 300;
          rank = 'Bronze'
        }

        let budget = await Budget.findOne({ _id: '62d2da6507141fb2315886bd' }).exec()
        budget.salary += salary;
        user.status.SalaryIncome = salary;
        user.status.rank = rank;
        user.wallet.mainWallet += salary;
        user.status.totalIncome += salary;
        budget.save();
        user.save();

        new Transaction({
          user: user._id,
          amount: salary,
          type: 'Salary',
          status: 'Success',
        }).save();

        res.json({
          salary,
          rank,
          msg: "Salary and Rank updated",
        });


      } else {
        res.json({
          msg: "No products bought",
        });
      }
    } else {
      res.json({
        msg: "User not active",
      });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
}

const saveBankDetails = async (req, res) => {
  const { bankName, accountNumber, accountName, ifscCode, screenshot } = req.body;
  const { userId } = req.params;
  const user = await fetchUserById(userId);
  if (user.bank.type !== "fresh") {
    user.bank.bankName = bankName;
    user.bank.accountName = accountName;
    user.bank.accountNumber = accountNumber;
    user.bank.ifscCode = ifscCode;
    user.bank.screenshot = screenshot;
    user.bank.type = "fresh";
    user.save();
    res.json({
      msg: "Bank Details updated",
    });
  } else {
    user.bank.bankName = bankName;
    user.bank.accountName = accountName;
    user.bank.accountNumber = accountNumber;
    user.bank.ifscCode = ifscCode;
    user.bank.screenshot = screenshot;
    user.bank.type = "updated";
    user.save();
    res.json({
      msg: "request to admin submitted",
    });
  }
}

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  const user = await User.findOne({ _id: id }).exec();
  if (user.password === oldPassword) {
    user.password = newPassword;
    user.save();
    res.json({
      msg: "Password updated",
    });
  } else {
    res.json({
      msg: "Old Password is incorrect",
    });
  }
}

const getUserIds = users => {
  console.log(users)
  return users.map(tempUser => tempUser._id);
}

const UserOverview = async (req, res) => {
  const { userId } = req.params;

  try {

    const user = await fetchUserById(userId);
    const level1 = await User.find({ _id: { $in: user.referredUsers } }).exec();
    const level1Refs = level1.map(tempUser => tempUser.referredUsers).flat();

    const level2 = await User.find({ _id: { $in: level1Refs } }).exec();
    const level2Refs = level2.map(tempUser => tempUser.referredUsers).flat();

    const level3 = await User.find({ _id: { $in: level2Refs } }).exec();
    const level3Refs = level3.map(tempUser => tempUser.referredUsers).flat();

    const level4 = await User.find({ _id: { $in: level3Refs } }).exec();
    const level4Refs = level4.map(tempUser => tempUser.referredUsers).flat();

    const level5 = await User.find({ _id: { $in: level4Refs } }).exec();
    const level5Refs = level5.map(tempUser => tempUser.referredUsers).flat();

    const level6 = await User.find({ _id: { $in: level5Refs } }).exec();
    const level6Refs = level6.map(tempUser => tempUser.referredUsers).flat();

    const level7 = await User.find({ _id: { $in: level6Refs } }).exec();
    const level7Refs = level7.map(tempUser => tempUser.referredUsers).flat();

    const level8 = await User.find({ _id: { $in: level7Refs } }).exec();
    const level8Refs = level8.map(tempUser => tempUser.referredUsers).flat();

    const level9 = await User.find({ _id: { $in: level8Refs } }).exec();
    const level9Refs = level9.map(tempUser => tempUser.referredUsers).flat();

    const level10 = await User.find({ _id: { $in: level9Refs } }).exec();
    const level10Refs = level10.map(tempUser => tempUser.referredUsers).flat();

    const resolvedUser = await User.find({ _id: { $in: user.referredUsers } }, { userId: 1, name: 1, boughtProducts: 1 }).populate({ path: "boughtProducts._id" }).exec();
    const resolvedLevel1Refs = await User.find({ _id: { $in: level1Refs } }, { userId: 1, name: 1, boughtProducts: 1 }).populate({ path: "boughtProducts._id" }).exec();
    const resolvedLevel2Refs = await User.find({ _id: { $in: level2Refs } }, { userId: 1, name: 1, boughtProducts: 1 }).populate({ path: "boughtProducts._id" }).exec();
    const resolvedLevel3Refs = await User.find({ _id: { $in: level3Refs } }, { userId: 1, name: 1, boughtProducts: 1 }).populate({ path: "boughtProducts._id" }).exec();
    const resolvedLevel4Refs = await User.find({ _id: { $in: level4Refs } }, { userId: 1, name: 1, boughtProducts: 1 }).populate({ path: "boughtProducts._id" }).exec();
    const resolvedLevel5Refs = await User.find({ _id: { $in: level5Refs } }, { userId: 1, name: 1, boughtProducts: 1 }).populate({ path: "boughtProducts._id" }).exec();
    const resolvedLevel6Refs = await User.find({ _id: { $in: level6Refs } }, { userId: 1, name: 1, boughtProducts: 1 }).populate({ path: "boughtProducts._id" }).exec();
    const resolvedLevel7Refs = await User.find({ _id: { $in: level7Refs } }, { userId: 1, name: 1, boughtProducts: 1 }).populate({ path: "boughtProducts._id" }).exec();
    const resolvedLevel8Refs = await User.find({ _id: { $in: level8Refs } }, { userId: 1, name: 1, boughtProducts: 1 }).populate({ path: "boughtProducts._id" }).exec();
    const resolvedLevel9Refs = await User.find({ _id: { $in: level9Refs } }, { userId: 1, name: 1, boughtProducts: 1 }).populate({ path: "boughtProducts._id" }).exec();
    const resolvedLevel10Refs = await User.find({ _id: { $in: level10Refs } }, { userId: 1, name: 1, boughtProducts: 1 }).populate({ path: "boughtProducts._id" }).exec();
    res.json({
      user: resolvedUser,
      resolvedLevel1Refs,
      resolvedLevel2Refs,
      resolvedLevel3Refs,
      resolvedLevel4Refs,
      resolvedLevel5Refs,
      resolvedLevel6Refs,
      resolvedLevel7Refs,
      resolvedLevel8Refs,
      resolvedLevel9Refs,
      resolvedLevel10Refs,
    });
  } catch (error) {
    console.log(error);
  }
}


const UserOverviewIncomeImproved = async (req, res) => {
  const { userId } = req.params;

  try {

    const user = await fetchUserById(userId);
    if (user === null) {
      return res.status(400).json({
        msg: "User not found",
      });
    }
    const level1 = await User.find({ _id: { $in: user.referredUsers } }).exec();
    const level1Refs = level1.map(tempUser => tempUser.referredUsers).flat();

    let level2 = {}
    let level2Refs = []
    let level3 = {}
    let level3Refs = []
    let level4 = {}
    let level4Refs = []
    let level5 = {}
    let level5Refs = []
    let level6 = {}
    let level6Refs = []
    let level7 = {}
    let level7Refs = []
    let level8 = {}
    let level8Refs = []
    let level9 = {}
    let level9Refs = []
    let level10 = {}
    let level10Refs = []
    let level11 = {}
    let level11Refs = []
    let level12 = {}
    let level12Refs = []
    let level13 = {}
    let level13Refs = []
    let level14 = {}
    let level14Refs = []
    let level15 = {}
    let level15Refs = []
    let level16 = {}
    let level16Refs = []
    let level17 = {}
    let level17Refs = []
    let level18 = {}
    let level18Refs = []
    let level19 = {}
    let level19Refs = []
    let level20 = {}
    let level20Refs = []
    let level21 = {}
    let level21Refs = []
    let level22 = {}
    let level22Refs = []
    let level23 = {}
    let level23Refs = []
    let level24 = {}
    let level24Refs = []
    let level25 = {}
    let level25Refs = []
    let level26 = {}
    let level26Refs = []
    let level27 = {}
    let level27Refs = []
    let level28 = {}
    let level28Refs = []
    let level29 = {}
    let level29Refs = []
    let level30 = {}
    let level30Refs = []


    if (level1Refs.length === 0) {
      level2 = await User.find({ _id: { $in: level1Refs } }).exec();
      level2Refs = level2.map(tempUser => tempUser.referredUsers).flat();
      if (level2Refs.length === 0) {
        level3 = await User.find({ _id: { $in: level2Refs } }).exec();
        level3Refs = level3.map(tempUser => tempUser.referredUsers).flat();
        if (level3Refs.length === 0) {
          level4 = await User.find({ _id: { $in: level3Refs } }).exec();
          level4Refs = level4.map(tempUser => tempUser.referredUsers).flat();

          if (level4Refs.length === 0) {
            level5 = await User.find({ _id: { $in: level4Refs } }).exec();
            level5Refs = level5.map(tempUser => tempUser.referredUsers).flat();

            if (level5Refs.length === 0) {
              level6 = await User.find({ _id: { $in: level5Refs } }).exec();
              level6Refs = level6.map(tempUser => tempUser.referredUsers).flat();

              if (level6Refs.length === 0) {

                level7 = await User.find({ _id: { $in: level6Refs } }).exec();
                level7Refs = level7.map(tempUser => tempUser.referredUsers).flat();

                level8 = await User.find({ _id: { $in: level7Refs } }).exec();
                level8Refs = level8.map(tempUser => tempUser.referredUsers).flat();

                level9 = await User.find({ _id: { $in: level8Refs } }).exec();
                level9Refs = level9.map(tempUser => tempUser.referredUsers).flat();

                level10 = await User.find({ _id: { $in: level9Refs } }).exec();
                level10Refs = level10.map(tempUser => tempUser.referredUsers).flat();

                level11 = await User.find({ _id: { $in: level10Refs } }).exec();
                level11Refs = level11.map(tempUser => tempUser.referredUsers).flat();

                level12 = await User.find({ _id: { $in: level11Refs } }).exec();
                level12Refs = level12.map(tempUser => tempUser.referredUsers).flat();

                level13 = await User.find({ _id: { $in: level12Refs } }).exec();
                level13Refs = level13.map(tempUser => tempUser.referredUsers).flat();

                level14 = await User.find({ _id: { $in: level13Refs } }).exec();
                level14Refs = level14.map(tempUser => tempUser.referredUsers).flat();

                level15 = await User.find({ _id: { $in: level14Refs } }).exec();
                level15Refs = level15.map(tempUser => tempUser.referredUsers).flat();

                level16 = await User.find({ _id: { $in: level15Refs } }).exec();
                level16Refs = level16.map(tempUser => tempUser.referredUsers).flat();

                level17 = await User.find({ _id: { $in: level16Refs } }).exec();
                level17Refs = level17.map(tempUser => tempUser.referredUsers).flat();

                level18 = await User.find({ _id: { $in: level17Refs } }).exec();
                level18Refs = level18.map(tempUser => tempUser.referredUsers).flat();

                level19 = await User.find({ _id: { $in: level18Refs } }).exec();
                level19Refs = level19.map(tempUser => tempUser.referredUsers).flat();

                level20 = await User.find({ _id: { $in: level19Refs } }).exec();
                level20Refs = level20.map(tempUser => tempUser.referredUsers).flat();

                level21 = await User.find({ _id: { $in: level20Refs } }).exec();
                level21Refs = level21.map(tempUser => tempUser.referredUsers).flat();

                level22 = await User.find({ _id: { $in: level21Refs } }).exec();
                level22Refs = level22.map(tempUser => tempUser.referredUsers).flat();

                level23 = await User.find({ _id: { $in: level22Refs } }).exec();
                level23Refs = level23.map(tempUser => tempUser.referredUsers).flat();

                level24 = await User.find({ _id: { $in: level23Refs } }).exec();
                level24Refs = level24.map(tempUser => tempUser.referredUsers).flat();

                level25 = await User.find({ _id: { $in: level24Refs } }).exec();
                level25Refs = level25.map(tempUser => tempUser.referredUsers).flat();

                level26 = await User.find({ _id: { $in: level25Refs } }).exec();
                level26Refs = level26.map(tempUser => tempUser.referredUsers).flat();

                level27 = await User.find({ _id: { $in: level26Refs } }).exec();
                level27Refs = level27.map(tempUser => tempUser.referredUsers).flat();

                level28 = await User.find({ _id: { $in: level27Refs } }).exec();
                level28Refs = level28.map(tempUser => tempUser.referredUsers).flat();

                level29 = await User.find({ _id: { $in: level28Refs } }).exec();
                level29Refs = level29.map(tempUser => tempUser.referredUsers).flat();

                level30 = await User.find({ _id: { $in: level29Refs } }).exec();
                level30Refs = level30.map(tempUser => tempUser.referredUsers).flat();
              }
            }
          }
        }
      }
    }




    const resolvedUser = await User.find({ _id: { $in: user.referredUsers } }, { userId: 1 }).exec();
    let resolvedLevel1Refs = [];
    let resolvedLevel2Refs = [];
    let resolvedLevel3Refs = [];
    let resolvedLevel4Refs = [];
    let resolvedLevel5Refs = [];
    let resolvedLevel6Refs = [];
    let resolvedLevel7Refs = [];
    let resolvedLevel8Refs = [];
    let resolvedLevel9Refs = [];
    let resolvedLevel10Refs = [];
    let resolvedLevel11Refs = [];
    let resolvedLevel12Refs = [];
    let resolvedLevel13Refs = [];
    let resolvedLevel14Refs = [];
    let resolvedLevel15Refs = [];
    let resolvedLevel16Refs = [];
    let resolvedLevel17Refs = [];
    let resolvedLevel18Refs = [];
    let resolvedLevel19Refs = [];
    let resolvedLevel20Refs = [];
    let resolvedLevel21Refs = [];
    let resolvedLevel22Refs = [];
    let resolvedLevel23Refs = [];
    let resolvedLevel24Refs = [];
    let resolvedLevel25Refs = [];
    let resolvedLevel26Refs = [];
    let resolvedLevel27Refs = [];
    let resolvedLevel28Refs = [];
    let resolvedLevel29Refs = [];
    let resolvedLevel30Refs = [];
    if (resolvedUser.length > 0) {
      resolvedLevel1Refs = await User.find({ _id: { $in: level1Refs } }, { userId: 1 }).exec();
      if (resolvedLevel1Refs.length > 0) {
        resolvedLevel2Refs = await User.find({ _id: { $in: level2Refs } }, { userId: 1 }).exec();
        if (resolvedLevel2Refs.length > 0) {
          resolvedLevel3Refs = await User.find({ _id: { $in: level3Refs } }, { userId: 1 }).exec();
          if (resolvedLevel3Refs.length > 0) {
            resolvedLevel4Refs = await User.find({ _id: { $in: level4Refs } }, { userId: 1 }).exec();
            if (resolvedLevel4Refs.length > 0) {
              resolvedLevel5Refs = await User.find({ _id: { $in: level5Refs } }, { userId: 1 }).exec();
              resolvedLevel6Refs = await User.find({ _id: { $in: level6Refs } }, { userId: 1 }).exec();
              resolvedLevel7Refs = await User.find({ _id: { $in: level7Refs } }, { userId: 1 }).exec();
              resolvedLevel8Refs = await User.find({ _id: { $in: level8Refs } }, { userId: 1 }).exec();
              resolvedLevel9Refs = await User.find({ _id: { $in: level9Refs } }, { userId: 1 }).exec();
              resolvedLevel10Refs = await User.find({ _id: { $in: level10Refs } }, { userId: 1 }).exec();
              resolvedLevel11Refs = await User.find({ _id: { $in: level11Refs } }, { userId: 1 }).exec();
              resolvedLevel12Refs = await User.find({ _id: { $in: level12Refs } }, { userId: 1 }).exec();
              resolvedLevel13Refs = await User.find({ _id: { $in: level13Refs } }, { userId: 1 }).exec();
              resolvedLevel14Refs = await User.find({ _id: { $in: level14Refs } }, { userId: 1 }).exec();
              resolvedLevel15Refs = await User.find({ _id: { $in: level15Refs } }, { userId: 1 }).exec();
              resolvedLevel16Refs = await User.find({ _id: { $in: level16Refs } }, { userId: 1 }).exec();
              resolvedLevel17Refs = await User.find({ _id: { $in: level17Refs } }, { userId: 1 }).exec();
              resolvedLevel18Refs = await User.find({ _id: { $in: level18Refs } }, { userId: 1 }).exec();
              resolvedLevel19Refs = await User.find({ _id: { $in: level19Refs } }, { userId: 1 }).exec();
              resolvedLevel20Refs = await User.find({ _id: { $in: level20Refs } }, { userId: 1 }).exec();
              resolvedLevel21Refs = await User.find({ _id: { $in: level21Refs } }, { userId: 1 }).exec();
              resolvedLevel22Refs = await User.find({ _id: { $in: level22Refs } }, { userId: 1 }).exec();
              resolvedLevel23Refs = await User.find({ _id: { $in: level23Refs } }, { userId: 1 }).exec();
              resolvedLevel24Refs = await User.find({ _id: { $in: level24Refs } }, { userId: 1 }).exec();
              resolvedLevel25Refs = await User.find({ _id: { $in: level25Refs } }, { userId: 1 }).exec();
              resolvedLevel26Refs = await User.find({ _id: { $in: level26Refs } }, { userId: 1 }).exec();
              resolvedLevel27Refs = await User.find({ _id: { $in: level27Refs } }, { userId: 1 }).exec();
              resolvedLevel28Refs = await User.find({ _id: { $in: level28Refs } }, { userId: 1 }).exec();
              resolvedLevel29Refs = await User.find({ _id: { $in: level29Refs } }, { userId: 1 }).exec();
              resolvedLevel30Refs = await User.find({ _id: { $in: level30Refs } }, { userId: 1 }).exec();
            }
          }
        }
      }
    }

    res.json({
      user: resolvedUser,
      resolvedLevel1Refs,
      resolvedLevel2Refs,
      resolvedLevel3Refs,
      resolvedLevel4Refs,
      resolvedLevel5Refs,
      resolvedLevel6Refs,
      resolvedLevel7Refs,
      resolvedLevel8Refs,
      resolvedLevel9Refs,
      resolvedLevel10Refs,
      resolvedLevel11Refs,
      resolvedLevel12Refs,
      resolvedLevel13Refs,
      resolvedLevel14Refs,
      resolvedLevel15Refs,
      resolvedLevel16Refs,
      resolvedLevel17Refs,
      resolvedLevel18Refs,
      resolvedLevel19Refs,
      resolvedLevel20Refs,
      resolvedLevel21Refs,
      resolvedLevel22Refs,
      resolvedLevel23Refs,
      resolvedLevel24Refs,
      resolvedLevel25Refs,
      resolvedLevel26Refs,
      resolvedLevel27Refs,
      resolvedLevel28Refs,
      resolvedLevel29Refs,
      resolvedLevel30Refs,
      userIncomeList: user.incomeOverview
    });
  } catch (error) {
    console.log(error);
  }
}

const UserOverviewIncome = async (req, res) => {
  const { userId } = req.params;

  try {

    const user = await fetchUserById(userId);
    if (user === null) {
      return res.status(400).json({
        msg: "User not found",
      });
    }
    const level1 = await User.find({ _id: { $in: user.referredUsers } }).exec();
    const level1Refs = level1.map(tempUser => tempUser.referredUsers).flat();

    const level2 = await User.find({ _id: { $in: level1Refs } }).exec();
    const level2Refs = level2.map(tempUser => tempUser.referredUsers).flat();

    const level3 = await User.find({ _id: { $in: level2Refs } }).exec();
    const level3Refs = level3.map(tempUser => tempUser.referredUsers).flat();

    const level4 = await User.find({ _id: { $in: level3Refs } }).exec();
    const level4Refs = level4.map(tempUser => tempUser.referredUsers).flat();

    const level5 = await User.find({ _id: { $in: level4Refs } }).exec();
    const level5Refs = level5.map(tempUser => tempUser.referredUsers).flat();

    const level6 = await User.find({ _id: { $in: level5Refs } }).exec();
    const level6Refs = level6.map(tempUser => tempUser.referredUsers).flat();

    const level7 = await User.find({ _id: { $in: level6Refs } }).exec();
    const level7Refs = level7.map(tempUser => tempUser.referredUsers).flat();

    const level8 = await User.find({ _id: { $in: level7Refs } }).exec();
    const level8Refs = level8.map(tempUser => tempUser.referredUsers).flat();

    const level9 = await User.find({ _id: { $in: level8Refs } }).exec();
    const level9Refs = level9.map(tempUser => tempUser.referredUsers).flat();

    const level10 = await User.find({ _id: { $in: level9Refs } }).exec();
    const level10Refs = level10.map(tempUser => tempUser.referredUsers).flat();

    const level11 = await User.find({ _id: { $in: level10Refs } }).exec();
    const level11Refs = level11.map(tempUser => tempUser.referredUsers).flat();

    const level12 = await User.find({ _id: { $in: level11Refs } }).exec();
    const level12Refs = level12.map(tempUser => tempUser.referredUsers).flat();

    const level13 = await User.find({ _id: { $in: level12Refs } }).exec();
    const level13Refs = level13.map(tempUser => tempUser.referredUsers).flat();

    const level14 = await User.find({ _id: { $in: level13Refs } }).exec();
    const level14Refs = level14.map(tempUser => tempUser.referredUsers).flat();

    const level15 = await User.find({ _id: { $in: level14Refs } }).exec();
    const level15Refs = level15.map(tempUser => tempUser.referredUsers).flat();

    const level16 = await User.find({ _id: { $in: level15Refs } }).exec();
    const level16Refs = level16.map(tempUser => tempUser.referredUsers).flat();

    const level17 = await User.find({ _id: { $in: level16Refs } }).exec();
    const level17Refs = level17.map(tempUser => tempUser.referredUsers).flat();

    const level18 = await User.find({ _id: { $in: level17Refs } }).exec();
    const level18Refs = level18.map(tempUser => tempUser.referredUsers).flat();

    const level19 = await User.find({ _id: { $in: level18Refs } }).exec();
    const level19Refs = level19.map(tempUser => tempUser.referredUsers).flat();

    const level20 = await User.find({ _id: { $in: level19Refs } }).exec();
    const level20Refs = level20.map(tempUser => tempUser.referredUsers).flat();

    const level21 = await User.find({ _id: { $in: level20Refs } }).exec();
    const level21Refs = level21.map(tempUser => tempUser.referredUsers).flat();

    const level22 = await User.find({ _id: { $in: level21Refs } }).exec();
    const level22Refs = level22.map(tempUser => tempUser.referredUsers).flat();

    const level23 = await User.find({ _id: { $in: level22Refs } }).exec();
    const level23Refs = level23.map(tempUser => tempUser.referredUsers).flat();

    const level24 = await User.find({ _id: { $in: level23Refs } }).exec();
    const level24Refs = level24.map(tempUser => tempUser.referredUsers).flat();

    const level25 = await User.find({ _id: { $in: level24Refs } }).exec();
    const level25Refs = level25.map(tempUser => tempUser.referredUsers).flat();

    const level26 = await User.find({ _id: { $in: level25Refs } }).exec();
    const level26Refs = level26.map(tempUser => tempUser.referredUsers).flat();

    const level27 = await User.find({ _id: { $in: level26Refs } }).exec();
    const level27Refs = level27.map(tempUser => tempUser.referredUsers).flat();

    const level28 = await User.find({ _id: { $in: level27Refs } }).exec();
    const level28Refs = level28.map(tempUser => tempUser.referredUsers).flat();

    const level29 = await User.find({ _id: { $in: level28Refs } }).exec();
    const level29Refs = level29.map(tempUser => tempUser.referredUsers).flat();

    const level30 = await User.find({ _id: { $in: level29Refs } }).exec();
    const level30Refs = level30.map(tempUser => tempUser.referredUsers).flat();

    const resolvedUser = await User.find({ _id: { $in: user.referredUsers } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel1Refs = await User.find({ _id: { $in: level1Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel2Refs = await User.find({ _id: { $in: level2Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel3Refs = await User.find({ _id: { $in: level3Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel4Refs = await User.find({ _id: { $in: level4Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel5Refs = await User.find({ _id: { $in: level5Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel6Refs = await User.find({ _id: { $in: level6Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel7Refs = await User.find({ _id: { $in: level7Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel8Refs = await User.find({ _id: { $in: level8Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel9Refs = await User.find({ _id: { $in: level9Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel10Refs = await User.find({ _id: { $in: level10Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel11Refs = await User.find({ _id: { $in: level11Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel12Refs = await User.find({ _id: { $in: level12Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel13Refs = await User.find({ _id: { $in: level13Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel14Refs = await User.find({ _id: { $in: level14Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel15Refs = await User.find({ _id: { $in: level15Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel16Refs = await User.find({ _id: { $in: level16Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel17Refs = await User.find({ _id: { $in: level17Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel18Refs = await User.find({ _id: { $in: level18Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel19Refs = await User.find({ _id: { $in: level19Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel20Refs = await User.find({ _id: { $in: level20Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel21Refs = await User.find({ _id: { $in: level21Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel22Refs = await User.find({ _id: { $in: level22Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel23Refs = await User.find({ _id: { $in: level23Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel24Refs = await User.find({ _id: { $in: level24Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel25Refs = await User.find({ _id: { $in: level25Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel26Refs = await User.find({ _id: { $in: level26Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel27Refs = await User.find({ _id: { $in: level27Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel28Refs = await User.find({ _id: { $in: level28Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel29Refs = await User.find({ _id: { $in: level29Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    const resolvedLevel30Refs = await User.find({ _id: { $in: level30Refs } }, { userId: 1, name: 1, status: 1 }).exec();
    res.json({
      user: resolvedUser,
      resolvedLevel1Refs,
      resolvedLevel2Refs,
      resolvedLevel3Refs,
      resolvedLevel4Refs,
      resolvedLevel5Refs,
      resolvedLevel6Refs,
      resolvedLevel7Refs,
      resolvedLevel8Refs,
      resolvedLevel9Refs,
      resolvedLevel10Refs,
      resolvedLevel11Refs,
      resolvedLevel12Refs,
      resolvedLevel13Refs,
      resolvedLevel14Refs,
      resolvedLevel15Refs,
      resolvedLevel16Refs,
      resolvedLevel17Refs,
      resolvedLevel18Refs,
      resolvedLevel19Refs,
      resolvedLevel20Refs,
      resolvedLevel21Refs,
      resolvedLevel22Refs,
      resolvedLevel23Refs,
      resolvedLevel24Refs,
      resolvedLevel25Refs,
      resolvedLevel26Refs,
      resolvedLevel27Refs,
      resolvedLevel28Refs,
      resolvedLevel29Refs,
      resolvedLevel30Refs,
      userIncomeList: user.incomeOverview
    });
  } catch (error) {
    console.log(error);
  }
}

const getUserDetails = modifyUserById;

const getUserByUserId = async (req, res) => {
  const { userId } = req.params;
  try {

    const user = await User.find({ userId: userId }, { password: 0 });
    res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Server error",
    });
  }
}


const getUserByPhone = async (req, res) => {
  const { phone } = req.params;
  try {

    const user = await User.find({ phone: phone }, { password: 0 });
    res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Server error",
    });
  }
}

const checkReferral = async (req, res) => {
  const { userId } = req.params;
  try {

    const user = await User.find({ phone: userId });
    if (user.length > 0) {
      return res.status(200).json({
        _id: user[0]._id,
        name: user[0].name,
      });
    }
    return res.status(404).json({
      msg: "User not found",
    });

  } catch (error) {
    console.log(error);
  }
}

const getDownUsersList = async (userId) => {
  try {


    const user = await User.findOne({ _id: userId });

    const referredUsers = await User.find({
      _id: {
        $in: user.referredUsers,
      }
    }, { name: 1, userId: 1, referredUsers: 1 });
    if (user) {
      return referredUsers
    }
    return null;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
}

const activateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    if (user) {
      if (user.wallet.fundWallet < 100) {
        return res.status(400).json({ error: 'Insufficient fund' });
      }
      user.status.active = true;
      user.wallet.fundWallet -= 100;
      // Add a transaction for user activation
        new Transaction({
          user: user._id,
          amount: 100,
          type: 'Account Activation',
          status: 'Success',
        }).save();

      await user.save();
      return res.status(200).json({
        msg: "User activated successfully",
      });
    }
    return res.status(404).json({
      msg: "User not found",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
}

module.exports = {
  getAllUsers,
  deleteById,
  getUserById,
  ReFundsById,
  transferBalance,
  depositById,
  widthdrawlById,
  getRciIncome,
  getLevelIncome,
  getSalaryIncome,
  saveBankDetails,
  changePassword,
  getUserDetails,
  UserOverview,
  UserOverviewIncome,
  getUserByUserId,
  getUserByPhone,
  checkReferral,
  activateUser
};
