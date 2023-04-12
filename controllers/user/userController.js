
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/users/userModel');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS, ROLES, TYPES } = require('../../constants/index');
const jwtManagement = require('../../utils/jwtManagement');
const roles = require('../../constants/userRoles');

exports.signup = catchAsync(async (req, res, next) => {
    try{
    if (!req.body.country) {
        return next(new AppError('Country is required', STATUS_CODE.BAD_REQUEST));
    }
    req.body.status = 'approved';
    let result;

    const isEmail = await User.findOne({ email: req.body.email });
    if (isEmail) {
        return next(
            new AppError('Email Already Exists with this Name', STATUS_CODE.BAD_REQUEST)
        );
    }
 
    const isPhone = await User.findOne({ phone: req.body.phone });
    if (isPhone) {
        return next(
            new AppError('Phone Already Exists with this Name', STATUS_CODE.BAD_REQUEST)
        );
    }

    if(req.body.invite){
        const isInvite = await Invite.findOne({ code: req.body.invite });
        if (!isInvite) {
            return next(
                new AppError('Invite code is invalid', STATUS_CODE.BAD_REQUEST)
            );
        }
    }

    const session = await User.startSession();
    await session.withTransaction(async () => {
        result = await User.create([req.body], { session: session });
       
        await generateCode(result[0]);
      
    });

   
    session.endSession();
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        result: result[0],
    });
}
catch(err){
    res.status(STATUS_CODE.SERVER_ERROR).json({
        status: STATUS.ERROR,
        message: err.message,
       
    });
    
}});

exports.login = (Model, ...role) => catchAsync(async (req, res, next) => {
    try{
    const { email, password } = req.body;
    if (!email || !password) {
        // checking email or password empty?
        return next(new AppError(ERRORS.INVALID.NO_CREDENTIALS_EMAIL, STATUS_CODE.BAD_REQUEST));
    }
    // Finding user by username, phone or email
    const user = await Model.findOne({ email: email })
        .select('+password')
        .populate('customer provider');
    //
    if (!user || !(await user.correctPassword(password, user.password))) {
        //user existance and password is correct
        return next(
            new AppError(ERRORS.INVALID.INVALID_LOGIN_CREDENTIALS, STATUS_CODE.BAD_REQUEST)
        );
    }
    if (!role.includes(user.role)) {
        return next(
            new AppError(ERRORS.INVALID.INVALID_LOGIN_CREDENTIALS, STATUS_CODE.BAD_REQUEST)
        );
    }
    if (!user.isEmailVerified) {
        return next(new AppError(ERRORS.INVALID.VERIFY_EMAIL, STATUS_CODE.UNAUTHORIZED));
    }
    // Check if user is banned , if banned then Throw Error
    if (user.banned) {
        return next(new AppError(ERRORS.UNAUTHORIZED.BANNED, STATUS_CODE.UNAUTHORIZED));
    }
    // Check if user is active or not
    if (user.status !== 'approved') {
        // If no user and not active:true then return Error
        return next(new AppError(ERRORS.INVALID.NOT_APPROVED, STATUS_CODE.NOT_FOUND));
    }
    jwtManagement.createSendJwtToken(user, STATUS_CODE.OK, req, res);
}
catch(err){
    res.status(STATUS_CODE.SERVER_ERROR).json({
        status: STATUS.ERROR,
        message: err.message,
       
    });
    
}});