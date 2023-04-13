const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

exports.createCard = catchAsync(async (req, res, next) => {
    try{
   
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