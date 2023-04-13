const bcryptjs = require('bcryptjs');
exports.encryptPassword = async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcryptjs.hash(this.password, 12);
	next();
};

exports.passwordChanged = function (next) {
	if (!this.isModified('password') || this.isNew) return next();
	this.passwordChangedAt = Date.now();
	next();
};


exports.preSaveUser = async function (next) {
	if (!this.isNew) return next();
	await Reset.create({ userId: this._id, onModel: 'user' });
	next();
};