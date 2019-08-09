const express = require('express');
const router= express.Router();
//const cryptr = new Cryptr('myTotalySecretKey');
const userController=require('../controllers/userController')
//const checkAuth=require('../middelware/check-auth');
const multer=require('multer')
var Jimp = require('jimp');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      let filename =new Date().toISOString() + file.originalname+".png"
     
      cb(null, filename);
    }
  });
 
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
     
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  

 

  const upload = multer({
    storage: storage,
    limits: { fieldSize: 250 * 1024 * 1024 },
    fileFilter: fileFilter
  });
  




router.post('/signup',upload.single('profiePic'),userController.signUp)

router.post('/getusers',userController.getMultipleUsers)

router.delete('/:userId',userController.deleteUser);
router.get('/:userId',userController.getUser);


router.post('/login',userController.login);
router.post('/getotp',userController.getOTP);
router.post('/resetpassword',userController.resetPassword);



// router.post('/forgetpassword',controller.forgertPassword)
// router.post('/resetpassword',controller.resetPassword)


// router.post('/',(req,res,next)=>{
//     console.log('decrypting id' ,req.body.id)
//    // const id = cryptr.decrypt(req.params.id)
//    var decipher = Crypto.createDecipher('aes256', 'KEY');
// var decrypted = decipher.update(req.body.id, 'hex', 'utf8') + decipher.final('utf8');
//    // console.log(id);

//     User.findById({_id:decrypted}).exec().then(result=>{
//         res.status(201).json({result})
//     }).catch(err=>{
//         res.status(404).json({message:'Not Found user'})
//     });
// });
// router.post('/auth',checkAuth,(req,res,next)=>{

//     res.status(201).json({Message:'Success'})
// });





module.exports = router;