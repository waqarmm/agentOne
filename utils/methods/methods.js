const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const User = require('../../models/userModel');

exports.correctPassword = async function (candidatePassword, userpassword) {
    // Check Password Is Correct??
    return await bcryptjs.compare(candidatePassword, userpassword);
};

exports.passwordChangedAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

exports.createPasswordResetToken = async function () {
    let resetToken;
    do {
        resetToken = Math.floor(Math.random() * (1000 - 9999 + 1) + 9999).toString();
    } while (
        await User.findOne({
            passwordResetToken: crypto.createHash('sha256').update(resetToken).digest('hex'),
        })
    );
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

exports.random = function (length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};