const crypto = require('crypto');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS } = require('../../constants/index');
const jwtManagement = require('../../utils/jwtManagement');
const { regex } = require('../../utils/regex');
const Email = require('../../utils/emails/transactional');
const User = require('../../models/userModel');
//Forgot Password Via Email/phone
exports.forgotPassword = 
   catchAsync(async (req, res, next) => {
        if (!req.body.email) {
            return next(
                new AppError(
                    `${ERRORS.REQUIRED.EMAIL_REQUIRED}`,
                    STATUS_CODE.BAD_REQUEST
                )
            );
        }
        let user;
        if (regex.email.test(req.body.email)) {
            user = await User.findOne({ email: req.body.email });
        } else if (regex.phone.test(req.body.phone)) {
            user = await User.findOne({ phone: req.body.phone });
        }

        if (!user) {
            return next(
                new AppError(
                    `${ERRORS.INVALID.INVALID_EMAIL}`,
                    STATUS_CODE.UNAUTHORIZED
                )
            );
        }
	   const resetToken = await user.createPasswordResetToken();

        await user.save({ validateBeforeSave: false });
        try {
            if (regex.email.test(req.body.email)) {
              //  await new Email(user, resetToken).sendPasswordResetToken();
                return res.status(STATUS_CODE.OK).json({
                    status: STATUS.SUCCESS,
					message: SUCCESS_MSG.SUCCESS_MESSAGES.TOKEN_SENT_EMAIL,
					resetToken:resetToken +" // just showing for demo.."
                });
            } else {
                // await sendSMS({
                //     body: `${resetToken}`,
                //     phone: user.phone, // Text this number
                    //from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
                //});
                return res.status(STATUS_CODE.OK).json({
                    status: STATUS.SUCCESS,
                    message: SUCCESS_MSG.SUCCESS_MESSAGES.TOKEN_SENT_PHONE,
                });
            }
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            return next(new AppError(ERRORS.RUNTIME.SENDING_TOKEN, STATUS_CODE.SERVER_ERROR));
        }
    });


//Reset Password
exports.resetPassword = 
    catchAsync(async (req, res, next) => {
        const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
        //const hashedToken = req.params.token;
        if (!(await User.findOne({ passwordResetToken: hashedToken }))) {
            return next(new AppError(ERRORS.INVALID.INVALID_CODE, STATUS_CODE.BAD_REQUEST));
        }
        if (
            !(await User.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: Date.now() },
            }))
        ) {
            return next(new AppError(ERRORS.INVALID.EXPIRED_CODE, STATUS_CODE.BAD_REQUEST));
        }
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });
      

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        res.status(STATUS_CODE.OK).json({
            status: STATUS.SUCCESS,
            message: SUCCESS_MSG.SUCCESS_MESSAGES.PASSWORD_RESET,
        });
    });


// Update Current User's Password
exports.updatePassword = (Model) => {
    return catchAsync(async (req, res, next) => {
        // Get user from user's collection
        const user = await Model.findById(req.user.id).select('+password');

        if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
            // check if current user is correct
            return next(new AppError('current password is not correct', STATUS_CODE.UNAUTHORIZED));
        }
        // if User is correct then Update Current user's password
        user.password = req.body.password;
        await user.save();
        jwtManagement.createSendJwtToken(user, STATUS_CODE.OK, req, res);
    });
};