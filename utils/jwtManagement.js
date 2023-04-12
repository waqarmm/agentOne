const jwt = require('jsonwebtoken');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS } = require('../constants/index');

const signToken = (user) => {
	const payload = {
		userdata: {
			id: user._id,
		},
	};
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
	});
};
exports.createSendJwtToken = (user, statuscode, req, res) => {
	const token = signToken(user);
	req.session.jwt = token;
	user.password = undefined;
	res.status(statuscode).json({
		status: STATUS.SUCCESS,
		message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
		token,
		data: {
			user,
		},
	});
};