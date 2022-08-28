const Sauce = require('../models/Sauce');
const fs = require('fs');

//revoie un tableau de toute les sauces 
exports.displayAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json(error));
};

//renvoie la sauce avec l'id fourni
exports.displayOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json(error));
};

//capture enregistre la sauce transformée en string dans la bdd
//initialise like et dislike a 0 avec tableau vides
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl:
      `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [' '],
    usersDisliked: [' ']
  });
  sauce.save()
    .then(() => { res.status(201).json({ message: 'objet enregistré' }) })
    .catch(error => { res.status(400).json(error) });
};

//met a jour la sauce avec l'id fournis  capture image url de la sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  delete sauceObject.userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: ' not authorized' });
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'objet modifié' }))
          .catch(error => res.status(401).json(error))
      }
    })
    .catch((error) => {
      res.status(400).json({ error: error })
    })
};


//supprime une sauce avec l'id fournis
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'not authorized' });
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'objet supprimé' }))
            .catch(error => res.status(401).json(error));
        });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

//systeme de like 
exports.likeSauceSysteme = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //if like 
      if (!sauce.usersLiked.includes(req.body.userId) && req.body.like
        === 1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId }

          }
        )
          .then(() => res.status(201).json({ message: 'sauce liked' }))
          .catch((error) => res.status(400).json(error))
      }

      //if reset to no vote or no vote 
      if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId }
          }
        )
          .then(() => res.status(201).json({ message: 'aucun vote' }))
          .catch((error) => res.status(400).json(error))
      }

      //if dislike
      if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId }
          }
        )
          .then(() => res.status(201).json({ message: 'sauce disliked' }))
          .catch((error) => res.status(400).json(error))
      }

      //if user undislike or no vote
      if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId }

          }
        )
          .then(() => res.status(201).json({ message: 'aucun vote' }))
          .catch((error) => res.status(400).json(error))
      }
    })
    .catch((error) => res.status(404).json(error));
};



