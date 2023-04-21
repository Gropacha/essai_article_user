const { isValidObjectId } = require("mongoose");
const { schemaArticleJoi } = require("./model");
const { verify } = require("jsonwebtoken");

const isValideIdArticle = (req, res, next) => {
    const idArticle = req.params.id;
    if (!isValidObjectId(idArticle)) return res.status(400).json({msg:`l'id ${idArticle} n'est pas valide pour MongoDB`, whrere:"middleware"});
    next(); 
}

const isValideArticle = (req, res, next) => {
    const { body } = req;
    const { error } = schemaArticleJoi.validate(body, {abortEarly : false});
    if (error) return res.status(400).json(error.details); // Bad Request
    next(); 
}

const autorisation = (req, res, next) => {
    const token = req.header("x-token");
    // récuperer une information envoyée dans les headers de la requête http
   if (!token) return res.status(401).json({msg : "vous devez avoir un token pour réaliser cette opération"});
   // si elle est absente => erreur 401 // Unauthorized
   try {
       verify(token, process.env.JWT_SECRET);
       next();
   } catch (ex) {
        res.status(400).json({msg : "JWT invalid"})
   }
   // si elle est présente, mais qui a un problème dans la signature (3ème partie) 400
}




module.exports.isValideIdArticle = isValideIdArticle;
module.exports.isValideArticle = isValideArticle;
module.exports.autorisation = autorisation;
// une fonction middleware prend TOUJOURS 3 paramètres
// req : intercepter la requête
// res : retourne une réponse si le traitement est faux
// next : permet de passer au traitement suivant

// const middleware1 = (req, res, next) => {
//     console.log("je suis le middleware1");
//     next();
// }
// const middleware2 = (req, res, next) => {
//     console.log("je suis le middleware2");
//     next();
// }


// module.exports.middleware1 = middleware1;
// module.exports.middleware2 = middleware2;