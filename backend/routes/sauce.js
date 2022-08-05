const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require ('../controllers/sauces');

router.get('/',auth, saucesCtrl.displayAllSauces);
router.get('/:id',auth ,saucesCtrl.displayOneSauce);
router.post('/',auth,multer, saucesCtrl.createSauce );
  router.put('/:id',auth,multer, saucesCtrl.modifySauce);
  router.delete('/:id',auth, saucesCtrl.deleteSauce);
 //router.post('/:id' ,auth, saucesCtrl.likeSysteme);


module.exports = router;