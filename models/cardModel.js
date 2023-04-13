const mongoose = require('mongoose');
const { ERRORS } = require('../../constants/index');

const cardSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        assignee: {
            type: String,
		},
		attachment: {
		type: String,	
		},
		comments: {
			type: String,
		},
		status{
			type: String,
		}
    },
    {
        timestamps: true,
    }
);

cardSchema.pre('save', function (next) {
    this.slug = this.title.replace(/\s/g, '').toLowerCase();
    next();
});

const Category = mongoose.model('card', cardSchema);
module.exports = Category;