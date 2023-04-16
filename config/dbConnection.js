const mongoose = require('mongoose');

const db = process.env.NODE_ENV === 'production' ? process.env.DB_REMOTE : process.env.DB_REMOTE;

const dbConnect = async () => {
    try {
        await mongoose.connect(db, {
            useUnifiedTopology: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            autoIndex: true,
            useCreateIndex: true,
        });
        console.log('DB Connected Successfuly');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = dbConnect;