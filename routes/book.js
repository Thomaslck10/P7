const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/book');
const {compressImages} = require("../middleware/sharp.js");



router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestBooks);
router.get('/:id', bookCtrl.getOneBook); 
router.post('/', auth, multer, compressImages, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);
router.put('/:id', auth, multer, compressImages, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);



module.exports = router; 