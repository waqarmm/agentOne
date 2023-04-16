const sgMail = require('@sendgrid/mail');
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
sgMail.setApiKey(EMAIL_API_KEY);
// const { verify } = require('./templates/verification');
// const { password } = require('./templates/password');

const from = '"AgentOne" <info@AgentOne.com>';

module.exports = class Email {
    constructor(user, token) {
        this.to = user.email;
        this.token = token;
        this.from = from;
    }
    async send(subject, body) {
        // mail options
        const msg = {
            to: this.to, // Change to your recipient
            from: this.from, // Change to your verified sender
            subject: subject,
            text: body,
            html: body,
        };
        await sgMail.send(msg);
    }
    // async sendEmailVerificationToken() {
    //     await this.send('Your email Verification token', verify(this.token));
    // }
    // async sendPasswordResetToken() {
    //     await this.send('Your Password Reset Token(only valid for 10 minutes)', password(this.token));
    // }
 

   
};