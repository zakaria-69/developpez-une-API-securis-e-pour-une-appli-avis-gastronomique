const sauces = require('../models/Sauces');
const sauce = require ('../models/Sauces');

//revoie un tableau de toute les sauces 
exports.displayAllSauces = (req, res, next) => {
    sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
   };

   //renvoie la sauce avec l'id fourni
   exports.displayOneSauce = (res,req,next) => {
    sauce.findOne({ _id : req.params.id})
    console.log(req.params)
    .then(sauce => res.status(200).json({sauce}) )
    .catch(error => res.status(404).json({error}));
  };

//capture enregistre la sauce transformée en string dans la bdd
  //initialise like et dislike a 0 avec tableau vides
exports.createSauce = (req,res,next)=>{
const sauceObject = JSON.parse(req.body.sauce);
console.log(sauceObject)
delete sauceObject._id;
delete sauceObject._userId;
const sauce = new sauces({
    ...sauceObject,
    userId:req.auth.userId,
    imageUrl:` ${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   
});
console.log(req)
sauce.save()
.then(() => {res.status(201).json({message : 'objet enregistré'})})
.catch(error => {res.status(400).json({error})});
  };

  //met a jour la sauce avec l'id fournis  capture image url de la sauce
  exports.modifySauce = (req,res,next)=>{
const sauceObject = req.file ? {
  ...JSON.parse(req.body.sauce),
  imageUrl : ` ${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

} : { ...req.body};

delete sauceObject.userId;
sauce.findOne({_id:req.params.id})
.then((sauce) => {
  if (sauce.userId != req.auth.userId){
    res.status(401).json({message :error})
  }else{
    sauce.updateOne({_id:req.params.id},{...sauceObject,_id:req.params.id})
    .then(()=> res.status(200).json({message : 'objet crée'}))
    .catch(error =>res.status(401).json({error}))
  }
})
.catch((error) => {
  res.status(400).json({error})
})

    /*sauces.updateOne({_id :req.params.id}, {...req.body, _i: req.params.id})
    .then(sauce => res.status(200).json({message : 'objet modifié'}))
 .catch(error => res.status(400).json({error}));*/
  };


    //supprime une sauce avec l'id fournis
  exports.deleteSauce = (req,res,next)=>{
    sauce.deleteOne({ _id :req.params.id})
    .then(() => res.status(200).json({message : 'objet supprimé'}))
    .catch(error => res.status(400).json({error}));
  };

  //systeme de like 
  /*exports.likeSysteme = (req,res)=>{
    
};*/


