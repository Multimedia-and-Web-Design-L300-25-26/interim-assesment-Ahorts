const express = require('express');
const cryptoController = require('../controllers/cryptoController');

const router = express.Router();

router.get('/', cryptoController.getAllCrypto);
router.get('/gainers', cryptoController.getGainers);
router.get('/new', cryptoController.getNewListings);
router.get('/:symbol', cryptoController.getCryptoBySymbol);
router.post('/', cryptoController.addCrypto);

module.exports = router;
