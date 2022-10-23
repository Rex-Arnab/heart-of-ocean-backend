const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  bank: {
    bankName: {
      type: String,
      default: "",
    },
    accountNumber: {
      type: String,
      default: "",
    },
    ifscCode: {
      type: String,
      default: "",
    },
    accountName: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    screenshot: {
      type: String,
      default: "",
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  wallet: {
    fundWallet: {
      type: Number,
      default: 0,
    },
    mainWallet: {
      type: Number,
      default: 0,
    },
  },
  boughtProducts: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      expiryDate: Date,
    },
  ],
  referredUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  referredBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },    
  status: {
    active: {
      type: Boolean,
      default: false,
    },
    rank: {
      type: String,
      default: "newbie",
    },
    rci: {
      type: Number,
      default: 0,
    },
    referralIncome: {
      type: Number,
      default: 0,
    },
    levelIncome: {
      type: Number,
      default: 0,
    },
    SalaryIncome: {
      type: Number,
      default: 0,
    },
    totalWithdrawl: {
      type: Number,
      default: 0,
    },
    totalDeposit: {
      type: Number,
      default: 0,
    },
    totalIncome: {
      type: Number,
      default: 0,
    },
    totalPurchase: {
      type: Number,
      default: 0,
    }
  },
  incomeOverview: {
    level1: {
      type: Number,
      default: 0,
    },
    level2: {
      type: Number,
      default: 0,
    },
    level3: {
      type: Number,
      default: 0,
    },
    level4: {
      type: Number,
      default: 0,
    },
    level5: {
      type: Number,
      default: 0,
    },
    level6: {
      type: Number,
      default: 0,
    },
    level7: {
      type: Number,
      default: 0,
    },
    level8: {
      type: Number,
      default: 0,
    },
    level9: {
      type: Number,
      default: 0,
    },
    level10: {
      type: Number,
      default: 0,
    },
    level11: {
      type: Number,
      default: 0,
    },
    level12: {
      type: Number,
      default: 0,
    },
    level13: {
      type: Number,
      default: 0,
    },
    level14: {
      type: Number,
      default: 0,
    },
    level15: {
      type: Number,
      default: 0,
    },
    level16: {
      type: Number,
      default: 0,
    },
    level17: {
      type: Number,
      default: 0,
    },
    level18: {
      type: Number,
      default: 0,
    },
    level19: {
      type: Number,
      default: 0,
    },
    level20: {
      type: Number,
      default: 0,
    },
    level21: {
      type: Number,
      default: 0,
    },
    level22: {
      type: Number,
      default: 0,
    },
    level23: {
      type: Number,
      default: 0,
    },
    level24: {
      type: Number,
      default: 0,
    },
    level25: {
      type: Number,
      default: 0,
    },
    level26: {
      type: Number,
      default: 0,
    },
    level27: {
      type: Number,
      default: 0,
    },
    level28: {
      type: Number,
      default: 0,
    },
    level29: {
      type: Number,
      default: 0,
    },
    level30: {
      type: Number,
      default: 0,
    },
  },
  adminPermissions: {
    fundManagement: {
      fundDeposit: {
        type: Boolean,
        default: false,
      },
      fundWithdraw: {
        type: Boolean,
        default: false,
      },
      fundTransfer: {
        type: Boolean,
        default: false,
      },
    },
    userManagement: {
      editUser: {
        type: Boolean,
        default: false,
      },
      deleteUser: {
        type: Boolean,
        default: false,
      },
    },
    incomeManagement: {
      rci: {
        type: Boolean,
        default: false,
      },
      levelIncome: {
        type: Boolean,
        default: false,
      },
      salaryIncome: {
        type: Boolean,
        default: false,
      },
    }
  }
});

userSchema.index({ userId: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
