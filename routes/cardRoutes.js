const express = require('express');
const cardController = require('../controllers/cards/cardController');
const roles = require('../constants/userRoles');
const { authenticate, restrictTo } = require('../middlewares/auth');
const router = express.Router();

router
    .route('/')
	.get(cardController.getCards);
router
	.route('/add')
	.post(cardController.createCard);
module.exports = router;