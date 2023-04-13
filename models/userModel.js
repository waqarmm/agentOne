const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const { ERRORS } = require("../constants/index");
const {
  encryptPassword,
  passwordChanged,
} = require("../../utils/mongoose-middlewares/middlewares");
const {
  correctPassword,
  passwordChangedAfter,
  createPasswordResetToken,
} = require("../../utils/methods/methods");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 15,
      required: [true, ERRORS.REQUIRED.FIRSTNAME_REQUIRED],
    },
    lastName: {
      type: String,
      minlength: 3,
      maxlength: 15,
      required: [true, ERRORS.REQUIRED.LASTNAME_REQUIRED],
      validate: [validator.isAlpha, ERRORS.INVALID.INVALID_LASTNAME],
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, ERRORS.REQUIRED.EMAIL_REQUIRED],
      validate: [validator.isEmail, ERRORS.INVALID.INVALID_EMAIL],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, ERRORS.REQUIRED.PHONE_REQUIRED],
    },

    password: {
      type: String,
      minlength: [8, ERRORS.INVALID.PASSWORD_LENGTH],
      select: false,
    },
    // image: {
    //   type: String,
    // },
    passwordChangedAt: Date,
    banned: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: {
        values: [
          "projectManager",
          "developer",
         "staff",
          "superAdmin",
        ],
        message:
          "Role Must be projectManager, developer, staff, superAdmin",
      },
      default: "developer",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    
    emailVerificationCode: {
      type: String,
      select: false,
    },
    phoneVerificationCode: {
      type: String,
      select: false,
    },
    emailVerificationTokenExpires: {
      type: Date,
      select: false,
    },
    phoneVerificationTokenExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    
    
    status: {
      type: String,
      enum: {
        values: ["approved", "rejected", "pending", "banned", "active"],
        message: "Status Must be approved, rejected pending banned or active",
      },
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);




//pre save middleware (runs before data saved to db)
userSchema.pre("save", encryptPassword);
userSchema.pre("save", passwordChanged);
//SCHEMA METHODS
userSchema.methods.correctPassword = correctPassword;
//CHANGED_PASSWORD_AFTER
userSchema.methods.changedPasswordAfter = passwordChangedAfter;
userSchema.methods.createPasswordResetToken = async function () {
  let resetToken;
  do {
    resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  } while (
    await User.findOne({
      passwordResetToken: crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex"),
    })
  );
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.createEmailVerifyToken = async function () {
  let token;
  do {
    token = Math.floor(100000 + Math.random() * 900000).toString();
  } while (
    await User.findOne({
      emailVerificationCode: crypto
        .createHash("sha256")
        .update(token)
        .digest("hex"),
    })
  );
  this.emailVerificationCode = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.emailVerificationTokenExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

userSchema.methods.createPhoneVerifyToken = async function () {
  let token;
  do {
    token = Math.floor(100000 + Math.random() * 900000).toString();
  } while (
    await User.findOne({
      phoneVerificationCode: crypto
        .createHash("sha256")
        .update(token)
        .digest("hex"),
    })
  );
  this.phoneVerificationCode = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.phoneVerificationTokenExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

const User = mongoose.model("user", userSchema);