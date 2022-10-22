const ProductService = require("../services/ProductService");
const UserService = require("../services/UserService");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const User = require("../models/User");
const Product = require("../models/Product");

const addNewProduct = ProductService.addNewProduct;
const fetchAllProducts = ProductService.getAllProducts;
const fetchProductById = (req, res) => {
  const { id } = req.params;
  try {

    ProductService.getProductById(id)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ msg: err.message });
      });
  } catch (err) {
    res.json({ msg: err.message });
  }
};
const deleteProductById = ProductService.removeProduct;

const getLevelIncomePerUser = async (userId, sum, rate, level) => {
  const user = await User.findOne({ _id: userId }).populate({
    path: "referredUsers", select: "status.active"
  }).exec()

  const directUsers = user.referredUsers.map(user => user.status.active)
  const directRefs = directUsers.filter(user => user).length; // Counting Direct Active Users
  if (level >= 10) {
    level = 10;
  }
  if (user.status.active && directRefs >= level) {

    let tempWallet = sum * rate;
    user.wallet.mainWallet += tempWallet;
    user.status.levelIncome += tempWallet;
    user.status.totalIncome += tempWallet;
    if (level === 1) {
      user.incomeOverview.level1 += tempWallet;
    } else if (level === 2) {
      user.incomeOverview.level2 += tempWallet;
    } else if (level === 3) {
      user.incomeOverview.level3 += tempWallet;
    } else if (level === 4) {
      user.incomeOverview.level4 += tempWallet;
    } else if (level === 5) {
      user.incomeOverview.level5 += tempWallet;
    } else if (level === 6) {
      user.incomeOverview.level6 += tempWallet;
    } else if (level === 7) {
      user.incomeOverview.level7 += tempWallet;
    } else if (level === 8) {
      user.incomeOverview.level8 += tempWallet;
    } else if (level === 9) {
      user.incomeOverview.level9 += tempWallet;
    } else if (level === 10) {
      user.incomeOverview.level10 += tempWallet;
    } else if (level === 11) {
      user.incomeOverview.level11 += tempWallet;
    } else if (level === 12) {
      user.incomeOverview.level12 += tempWallet;
    } else if (level === 13) {
      user.incomeOverview.level13 += tempWallet;
    } else if (level === 14) {
      user.incomeOverview.level14 += tempWallet;
    } else if (level === 15) {
      user.incomeOverview.level15 += tempWallet;
    } else if (level === 16) {
      user.incomeOverview.level16 += tempWallet;
    } else if (level === 17) {
      user.incomeOverview.level17 += tempWallet;
    } else if (level === 18) {
      user.incomeOverview.level18 += tempWallet;
    } else if (level === 19) {
      user.incomeOverview.level19 += tempWallet;
    } else if (level === 20) {
      user.incomeOverview.level20 += tempWallet;
    } else if (level === 21) {
      user.incomeOverview.level21 += tempWallet;
    } else if (level === 22) {
      user.incomeOverview.level22 += tempWallet;
    } else if (level === 23) {
      user.incomeOverview.level23 += tempWallet;
    } else if (level === 24) {
      user.incomeOverview.level24 += tempWallet;
    } else if (level === 25) {
      user.incomeOverview.level25 += tempWallet;
    } else if (level === 26) {
      user.incomeOverview.level26 += tempWallet;
    } else if (level === 27) {
      user.incomeOverview.level27 += tempWallet;
    } else if (level === 28) {
      user.incomeOverview.level28 += tempWallet;
    } else if (level === 29) {
      user.incomeOverview.level29 += tempWallet;
    } else if (level === 30) {
      user.incomeOverview.level30 += tempWallet;
    }
    let budget = await Budget.findOne({ _id: '62d2da6507141fb2315886bd' }).exec()
    budget.level += tempWallet;
    budget.save();
    user.save();

    new Transaction({
      user: user._id,
      amount: tempWallet,
      type: `Level Income [L${level}] Received`,
      status: "Success",
    }).save();

  }
  return user;

}

const buyProduct = async (req, res) => {
  const { id } = req.params;
  const getCommission = new Date().getDay() !== 6 || new Date().getDay() !== 0;

  try {


    const product = await ProductService.getProductById(id);
    const user = await UserService.fetchUserById(req.user._id);
    let budget = await Budget.findOne({ _id: '62d2da6507141fb2315886bd' }).exec()
    let levelsActivated = 0;
    let tempLevelIncome = 0;

    if (product.price > user.wallet.fundWallet) {
      return res.status(400).json({ msg: "Insufficient balance" });
    } else {
      if (user.wallet.fundWallet - product.price < 0) {
        return res.status(400).json({ msg: "Insufficient balance" });
      }
      user.wallet.fundWallet -= product.price;
      user.status.active = true;
      user.boughtProducts.push({ _id: product._id, expiryDate: new Date(Date.now() + parseInt(product.days) * 24 * 60 * 60 * 1000) });
      budget.purchase += product.price;
      user.status.totalPurchase += product.price;

      new Transaction({
        user: user._id,
        amount: -product.price,
        type: "Tour Purchase",
        status: "Success",
      }).save();

      if (getCommission && user.status.active) {

        // RCI income Instantly to Me
        const productList = user.boughtProducts;
        let productPrices = [];

        // rewrite the above for loop with for of
        for (let productInfo of productList) {
          const productDetails = await Product.findOne({ _id: productInfo }).exec();
          productPrices.push(productDetails.price);
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

        user.wallet.mainWallet += sum;
        user.status.rci += sum;
        user.status.totalIncome += sum;
        budget.rci += sum;


        new Transaction({
          user: user._id,
          amount: sum,
          type: "RCI Income Received",
          status: "Success",
        }).save();

        // LEVEL Income

        if (user.referredBy) {
          getLevelIncomePerUser(user.referredBy, sum, 0.1, 1).then((user1) => {
            console.log("Level 1 Income Received");
            if (user1 && user1.referredUsers.length >= 1) {
              tempLevelIncome += sum * 0.1;
              levelsActivated++;
            }
            if (user1.referredBy) {
              getLevelIncomePerUser(user1.referredBy, sum, 0.08, 2).then((user2) => {
                console.log("Level 2 Income Received");
                if (user2 && user2.referredUsers.length >= 2) {
                  tempLevelIncome += sum * 0.08;
                  levelsActivated++;
                }
                if (user2.referredBy) {
                  getLevelIncomePerUser(user2.referredBy, sum, 0.06, 3).then((user3) => {
                    console.log("Level 3 Income Received");
                    if (user3 && user3.referredUsers.length >= 3) {
                      tempLevelIncome += sum * 0.06;
                      levelsActivated++;
                    }
                    if (user3.referredBy) {
                      getLevelIncomePerUser(user3.referredBy, sum, 0.04, 4).then((user4) => {
                        console.log("Level 4 Income Received");
                        if (user4 && user4.referredUsers.length >= 4) {
                          tempLevelIncome += sum * 0.04;
                          levelsActivated++;
                        }
                        if (user4.referredBy) {
                          getLevelIncomePerUser(user4.referredBy, sum, 0.02, 5).then((user5) => {
                            console.log("Level 5 Income Received");
                            if (user5 && user5.referredUsers.length >= 5) {
                              tempLevelIncome += sum * 0.02;
                              levelsActivated++;
                            }
                            if (user5.referredBy) {
                              getLevelIncomePerUser(user5.referredBy, sum, 0.01, 6).then((user6) => {
                                console.log("Level 6 Income Received");
                                if (user6 && user6.referredUsers.length >= 6) {
                                  tempLevelIncome += sum * 0.01;
                                  levelsActivated++;
                                }
                                if (user6.referredBy) {
                                  getLevelIncomePerUser(user6.referredBy, sum, 0.01, 7).then((user7) => {
                                    console.log("Level 7 Income Received");
                                    if (user7 && user7.referredUsers.length >= 7) {
                                      tempLevelIncome += sum * 0.01;
                                      levelsActivated++;
                                    }
                                    if (user7.referredBy) {
                                      getLevelIncomePerUser(user7.referredBy, sum, 0.01, 8).then((user8) => {
                                        console.log("Level 8 Income Received");
                                        if (user8 && user8.referredUsers.length >= 8) {
                                          tempLevelIncome += sum * 0.01;
                                          levelsActivated++;
                                        }
                                        if (user8.referredBy) {
                                          getLevelIncomePerUser(user8.referredBy, sum, 0.01, 9).then((user9) => {
                                            if (user9 && user9.referredUsers.length >= 9) {
                                              console.log("Level 9 Income Received");
                                              tempLevelIncome += sum * 0.01;
                                              levelsActivated++;
                                            }
                                            if (user9.referredBy) {
                                              getLevelIncomePerUser(user9.referredBy, sum, 0.01, 10).then((user10) => {
                                                if (user10 && user10.referredUsers.length >= 10) {
                                                  console.log("Level 10 Income Received");
                                                  tempLevelIncome += sum * 0.01;
                                                  levelsActivated++;
                                                }
                                                if (user10.referredBy) {
                                                  getLevelIncomePerUser(user10.referredBy, sum, 0.005, 11).then((user11) => {
                                                    if (user11 && user11.referredUsers.length >= 10) {
                                                      console.log("Level 11 Income Received");
                                                      tempLevelIncome += sum * 0.005;
                                                      levelsActivated++;
                                                    }
                                                    if (user11.referredBy) {
                                                      getLevelIncomePerUser(user11.referredBy, sum, 0.005, 12).then((user12) => {
                                                        if (user12 && user12.referredUsers.length >= 10) {
                                                          console.log("Level 12 Income Received");
                                                          tempLevelIncome += sum * 0.005;
                                                          levelsActivated++;
                                                        }
                                                        if (user12.referredBy) {
                                                          getLevelIncomePerUser(user12.referredBy, sum, 0.005, 13).then((user13) => {
                                                            if (user13 && user13.referredUsers.length >= 10) {
                                                              console.log("Level 13 Income Received");
                                                              tempLevelIncome += sum * 0.005;
                                                              levelsActivated++;
                                                            }
                                                            if (user13.referredBy) {
                                                              getLevelIncomePerUser(user13.referredBy, sum, 0.005, 14).then((user14) => {
                                                                if (user14 && user14.referredUsers.length >= 10) {
                                                                  console.log("Level 14 Income Received");
                                                                  tempLevelIncome += sum * 0.005;
                                                                  levelsActivated++;
                                                                }
                                                                if (user14.referredBy) {
                                                                  getLevelIncomePerUser(user14.referredBy, sum, 0.005, 15).then((user15) => {
                                                                    if (user15 && user15.referredUsers.length >= 10) {
                                                                      console.log("Level 15 Income Received");
                                                                      tempLevelIncome += sum * 0.005;
                                                                      levelsActivated++;
                                                                    }
                                                                    if (user15.referredBy) {
                                                                      getLevelIncomePerUser(user15.referredBy, sum, 0.005, 16).then((user16) => {
                                                                        if (user16 && user16.referredUsers.length >= 10) {
                                                                          console.log("Level 16 Income Received");
                                                                          tempLevelIncome += sum * 0.005;
                                                                          levelsActivated++;
                                                                        }
                                                                        if (user16.referredBy) {
                                                                          getLevelIncomePerUser(user16.referredBy, sum, 0.005, 17).then((user17) => {
                                                                            if (user17 && user17.referredUsers.length >= 10) {
                                                                              console.log("Level 17 Income Received");
                                                                              tempLevelIncome += sum * 0.005;
                                                                              levelsActivated++;
                                                                            }
                                                                            if (user17.referredBy) {
                                                                              getLevelIncomePerUser(user17.referredBy, sum, 0.005, 18).then((user18) => {
                                                                                if (user18 && user18.referredUsers.length >= 10) {
                                                                                  console.log("Level 18 Income Received");
                                                                                  tempLevelIncome += sum * 0.005;
                                                                                  levelsActivated++;
                                                                                }
                                                                                if (user18.referredBy) {
                                                                                  getLevelIncomePerUser(user18.referredBy, sum, 0.005, 19).then((user19) => {
                                                                                    if (user19 && user19.referredUsers.length >= 10) {
                                                                                      console.log("Level 19 Income Received");
                                                                                      tempLevelIncome += sum * 0.005;
                                                                                      levelsActivated++;
                                                                                    }
                                                                                    if (user19.referredBy) {
                                                                                      getLevelIncomePerUser(user19.referredBy, sum, 0.005, 20).then((user20) => {
                                                                                        if (user20 && user20.referredUsers.length >= 10) {
                                                                                          console.log("Level 20 Income Received");
                                                                                          tempLevelIncome += sum * 0.005;
                                                                                          levelsActivated++;
                                                                                        }
                                                                                        if (user20.referredBy) {
                                                                                          getLevelIncomePerUser(user20.referredBy, sum, 0.0025, 21).then((user21) => {
                                                                                            if (user21 && user21.referredUsers.length >= 10) {
                                                                                              console.log("Level 21 Income Received");
                                                                                              tempLevelIncome += sum * 0.0025;
                                                                                              levelsActivated++;
                                                                                            }
                                                                                            if (user21.referredBy) {
                                                                                              getLevelIncomePerUser(user21.referredBy, sum, 0.0025, 22).then((user22) => {
                                                                                                if (user22 && user22.referredUsers.length >= 10) {
                                                                                                  console.log("Level 22 Income Received");
                                                                                                  tempLevelIncome += sum * 0.0025;
                                                                                                  levelsActivated++;
                                                                                                }
                                                                                                if (user22.referredBy) {
                                                                                                  getLevelIncomePerUser(user22.referredBy, sum, 0.0025, 23).then((user23) => {
                                                                                                    if (user23 && user23.referredUsers.length >= 10) {
                                                                                                      console.log("Level 23 Income Received");
                                                                                                      tempLevelIncome += sum * 0.0025;
                                                                                                      levelsActivated++;
                                                                                                    }
                                                                                                    if (user23.referredBy) {
                                                                                                      getLevelIncomePerUser(user23.referredBy, sum, 0.0025, 24).then((user24) => {
                                                                                                        if (user24 && user24.referredUsers.length >= 10) {
                                                                                                          console.log("Level 24 Income Received");
                                                                                                          tempLevelIncome += sum * 0.0025;
                                                                                                          levelsActivated++;
                                                                                                        }
                                                                                                        if (user24.referredBy) {
                                                                                                          getLevelIncomePerUser(user24.referredBy, sum, 0.0025, 25).then((user25) => {
                                                                                                            if (user25 && user25.referredUsers.length >= 10) {
                                                                                                              console.log("Level 25 Income Received");
                                                                                                              tempLevelIncome += sum * 0.0025;
                                                                                                              levelsActivated++;
                                                                                                            }
                                                                                                            if (user25.referredBy) {
                                                                                                              getLevelIncomePerUser(user25.referredBy, sum, 0.0025, 26).then((user26) => {
                                                                                                                if (user26 && user26.referredUsers.length >= 10) {
                                                                                                                  console.log("Level 26 Income Received");
                                                                                                                  tempLevelIncome += sum * 0.0025;
                                                                                                                  levelsActivated++;
                                                                                                                }
                                                                                                                if (user26.referredBy) {
                                                                                                                  getLevelIncomePerUser(user26.referredBy, sum, 0.0025, 27).then((user27) => {
                                                                                                                    if (user27 && user27.referredUsers.length >= 10) {
                                                                                                                      console.log("Level 27 Income Received");
                                                                                                                      tempLevelIncome += sum * 0.0025;
                                                                                                                      levelsActivated++;
                                                                                                                    }
                                                                                                                    if (user27.referredBy) {
                                                                                                                      getLevelIncomePerUser(user27.referredBy, sum, 0.0025, 28).then((user28) => {
                                                                                                                        if (user28 && user28.referredUsers.length >= 10) {
                                                                                                                          console.log("Level 28 Income Received");
                                                                                                                          tempLevelIncome += sum * 0.0025;
                                                                                                                          levelsActivated++;
                                                                                                                        }
                                                                                                                        if (user28.referredBy) {
                                                                                                                          getLevelIncomePerUser(user28.referredBy, sum, 0.0025, 29).then((user29) => {
                                                                                                                            if (user29 && user29.referredUsers.length >= 10) {
                                                                                                                              console.log("Level 29 Income Received");
                                                                                                                              tempLevelIncome += sum * 0.0025;
                                                                                                                              levelsActivated++;
                                                                                                                            }
                                                                                                                            if (user29.referredBy) {
                                                                                                                              getLevelIncomePerUser(user29.referredBy, sum, 0.0025, 30).then((user30) => {
                                                                                                                                if (user30 && user30.referredUsers.length >= 10) {
                                                                                                                                  console.log("Level 30 Income Received");
                                                                                                                                  tempLevelIncome += sum * 0.0025;
                                                                                                                                  levelsActivated++;
                                                                                                                                }

                                                                                                                              })
                                                                                                                            }
                                                                                                                          })
                                                                                                                        }
                                                                                                                      })
                                                                                                                    }
                                                                                                                  })
                                                                                                                }
                                                                                                              })
                                                                                                            }
                                                                                                          })
                                                                                                        }
                                                                                                      })
                                                                                                    }
                                                                                                  })
                                                                                                }
                                                                                              })
                                                                                            }
                                                                                          })
                                                                                        }

                                                                                      })
                                                                                    }
                                                                                  })
                                                                                }
                                                                              })
                                                                            }
                                                                          })
                                                                        }
                                                                      })
                                                                    }
                                                                  })
                                                                }
                                                              })
                                                            }
                                                          })
                                                        }
                                                      })
                                                    }
                                                  })
                                                }
                                              })
                                            }
                                          })
                                        }
                                      })
                                    }
                                  })
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }


      }

      if (user.status.active) {


        // Referral Income To all Senior Users

        if (user.referredBy) {
          let user1 = await UserService.fetchUserById(user.referredBy);
          user1.wallet.mainWallet += product.price * 0.05;
          user1.status.referralIncome += product.price * 0.05;
          user1.status.totalIncome += product.price * 0.05;
          budget.referral += product.price * 0.05;
          new Transaction({
            user: user1._id,
            amount: product.price * 0.05,
            type: `Referal Earnigns L1${user.name}`,
            status: "Success",
          }).save();
          user1.save();
          if (user1.referredBy) {
            let user2 = await UserService.fetchUserById(user1.referredBy);
            user2.wallet.mainWallet += product.price * 0.02;
            user2.status.referralIncome += product.price * 0.02;
            user2.status.totalIncome += product.price * 0.02;
            budget.referral += product.price * 0.02;
            new Transaction({
              user: user2._id,
              amount: product.price * 0.02,
              type: `Referal Earnigns L2(${user.name})`,
              status: "Success",
            }).save();
            user2.save();
            if (user2.referredBy) {
              let user3 = await UserService.fetchUserById(user2.referredBy);
              user3.wallet.mainWallet += product.price * 0.01;
              user3.status.referralIncome += product.price * 0.01;
              user3.status.totalIncome += product.price * 0.01;
              budget.referral += product.price * 0.01;
              new Transaction({
                user: user3._id,
                amount: product.price * 0.01,
                type: `Referal Earnigns L3(${user.name})`,
                status: "Success",
              }).save();
              user3.save();
              if (user3.referredBy) {
                let user4 = await UserService.fetchUserById(user3.referredBy);
                user4.wallet.mainWallet += product.price * 0.005;
                user4.status.referralIncome += product.price * 0.005;
                user4.status.totalIncome += product.price * 0.005;
                budget.referral += product.price * 0.005;
                new Transaction({
                  user: user4._id,
                  amount: product.price * 0.005,
                  type: `Referal Earnigns L4(${user.name})`,
                  status: "Success",
                }).save();
                user4.save();
                if (user4.referredBy) {
                  let user5 = await UserService.fetchUserById(user4.referredBy);
                  user5.wallet.mainWallet += product.price * 0.005;
                  user5.status.referralIncome += product.price * 0.005;
                  user5.status.totalIncome += product.price * 0.005;
                  budget.referral += product.price * 0.005;
                  new Transaction({
                    user: user5._id,
                    amount: product.price * 0.005,
                    type: `Referal Earnigns L5(${user.name})`,
                    status: "Success",
                  }).save();
                  user5.save();
                }
              }
            }
          }
        }
      } else {
        console.log("User is not active");
        return res.status(400).json({
          message: "User is not active"
        })
      }

      budget.level += tempLevelIncome;
      budget.save();
      user.save();
      return res.json({ msg: "Tour bought" });
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json({ msg: err.message });
  }
};

const getDashboardProducts = async (req, res) => {
  const { userId } = req.params;
  try {

    let user = await User.findOne({ _id: userId }, { __v: 0 }).populate({ path: "boughtProducts._id" }).populate({
      path: "referredUsers"
    }).exec();
    if (user === null) {
      return res.status(400).json({ msg: "User not found" });
    }

    const product = await user.boughtProducts.map(product => {
      return {
        _id: product._id._id,
        name: product._id.name,
        price: product._id.price,
        image: product._id.image,
        description: product._id.description,
        days: product._id.days,
        createdAt: product._id.createdAt,
        expiryDate: product.expiryDate,
      }
    })

    const team = await User.find(
      {
        _id: {
          $in: user.referredUsers,
        },
      },
      { _id: 1, name: 1, referredUsers: 1 }
    ).exec();

    res.json({ product: product, status: user.status, wallet: user.wallet, team });

  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }

};

module.exports = {
  addNewProduct,
  fetchAllProducts,
  deleteProductById,
  buyProduct,
  fetchProductById,
  getDashboardProducts,
};
