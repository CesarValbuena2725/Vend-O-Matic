const express = require('express');
const controller = require('../controllers/vendingController');

const router = express.Router();

router.put('/', controller.insertCoin);
router.delete('/', controller.cancel);

router.get('/inventory', controller.getInventory);
router.get('/inventory/:id', controller.getItem);
router.put('/inventory/:id', controller.purchase);

module.exports = router;