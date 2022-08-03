const mongoose = require ('mongoose');

const saucesSchema = mongoose.Schema({
name : { type:String, required: true},
manufacturer: {type:String, required: true},
description :{type:String, required: true},
mainPepper : {type:String, required: true },
imageUrl: { type:String, required: true},
heat: { type :Number},
likes : {type :Number },
dislikes : {type :Number },
userLiked : {type :String },
userDisliked : {type : String}


})

module.exports = mongoose.model('sauces' ,saucesSchema );