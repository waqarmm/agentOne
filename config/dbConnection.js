const mongoose = require('mongoose');

const db =  process.env.DB_REMOTE;

const dbConnect = async () => {
	try {
		console.log("DB____", db);
        await mongoose.connect(db, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            autoIndex: true,
            
        });
        console.log('DB Connected Successfuly');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = dbConnect;