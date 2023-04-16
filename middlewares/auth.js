const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const {
  ERRORS,
  STATUS_CODE,
  PERMISSIONS,
  STATUS,
} = require("../constants/index");
const roles = require("../constants/userRoles");


exports.authenticate = catchAsync(async (req, res, next) => {
  //getting token and check is it there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.session.jwt) {
    token = req.session.jwt;
  }
  if (!token) {

    return next(
      new AppError(ERRORS.UNAUTHORIZED.NOT_LOGGED_IN, STATUS_CODE.UNAUTHORIZED)
    );
  }
  //verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
   //check if user sitll exists
  const currentUser = await User.findById(decoded.userdata.id)

  if (!currentUser) {
    return next(new AppError(`User Not Found`, STATUS_CODE.NOT_FOUND));
  }
  if (currentUser.status !== STATUS.APPROVED || currentUser.banned) {
    return next(
      new AppError(
        `Your account is Banned or Inactive, Please contact the customer support`,
        STATUS_CODE.NOT_FOUND
      )
    );
  }
  //check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(ERRORS.UNAUTHORIZED.INVALID_JWT, STATUS_CODE.UNAUTHORIZED)
    );
  }
  //Grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...role) => (req, res, next) => {
  if (!role.includes(req.user.role)) {
    return next(
      new AppError(ERRORS.UNAUTHORIZED.UNAUTHORIZE, STATUS_CODE.UNAUTHORIZED)
    );
  }
  if (req.user.role === roles.admin || req.user.role === roles.staff) {
    if (
      req.method === "GET" &&
      (!req.user.access ||
        ![
          PERMISSIONS.READ,
          PERMISSIONS.READ_WRITE,
          PERMISSIONS.READ_WRITE_UPDATE,
        ].includes(req.user.access))
    ) {
      return next(
        new AppError(
          ERRORS.UNAUTHORIZED.UNAUTHORIZE,
          STATUS_CODE.UNAUTHORIZED
        )
      );
    }
    if (
      req.method === "POST" &&
      (!req.user.access ||
        ![PERMISSIONS.READ_WRITE, PERMISSIONS.READ_WRITE_UPDATE].includes(
          req.user.access
        ))
    ) {
      return next(
        new AppError(
          ERRORS.UNAUTHORIZED.UNAUTHORIZE,
          STATUS_CODE.UNAUTHORIZED
        )
      );
    }
    if (
      req.method === "PATCH" &&
      (!req.user.access ||
        ![PERMISSIONS.READ_WRITE_UPDATE].includes(req.user.access))
    ) {
      return next(
        new AppError(
          ERRORS.UNAUTHORIZED.UNAUTHORIZE,
          STATUS_CODE.UNAUTHORIZED
        )
      );
    }
    if (req.method === "DELETE") {
      return next(
        new AppError(
          ERRORS.UNAUTHORIZED.UNAUTHORIZE,
          STATUS_CODE.UNAUTHORIZED
        )
      );
    }
  }
  next();
};