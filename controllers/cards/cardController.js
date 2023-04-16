const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS, ROLES, TYPES } = require('../../constants/index');
const Card = require('../../models/cardModel');
exports.createCard = catchAsync(async (req, res, next) => {
    try{
		const result = Card.create(req.body);
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
    
	}
});

exports.getCards = catchAsync(async (req, res, next) => {
    try{
		const result = Card.find();
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