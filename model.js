const { Schema, model }=require("mongoose");
const Joi = require("joi"); // librairie qui permet de réaliser des vérifications = super if

const schemaArticleJoi = Joi.object({ // 19 vérifications && vérification de l'encodage utf-8
    titre : Joi.string().min(5).max(255).required(),
    contenu : Joi.string().min(5).max(10000).required(),
    like : Joi.number().min(0).required(),
    auteur : Joi.string().min(5).max(255).required()
})

const articleSchema = new Schema ({
    titre : String,
    contenu : String,
    like : Number,
    auteur : String
})

const Article = model("articles", articleSchema);

module.exports.Article = Article;
module.exports.schemaArticleJoi = schemaArticleJoi;

const userSchema = new Schema({
    email:String,
    password:String
});

const schemaUserJoi = Joi.object({
    email : Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required() // réviser les regex !!!
});

const User = model("users", userSchema)

module.exports.User = User; // export simple
module.exports.schemaUserJoi = schemaUserJoi;

