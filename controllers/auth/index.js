const { updatePassword, forgotPassword, resetPassword } = require('./passwordController');
// const {
//     phoneVerification,
//     emailVerification,
//     sendVerificationCodetoEmail,
//     sendVerificationCodetoPhone,
// } = require('./verification');
const { login, signup, currentUser, providerRegister } = require('./authController');

module.exports = {
    updatePassword,
    login,
    signup,
    forgotPassword,
    resetPassword,
    // currentUser,
    // providerRegister,
    // phoneVerification,
    // emailVerification,
    // sendVerificationCodetoEmail,
    // sendVerificationCodetoPhone,
};