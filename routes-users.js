const { Router } = require("express");
const { User, schemaUserJoi } = require("./model");
const { isValidObjectId } = require("mongoose");
const { genSalt, hash} = require("bcrypt");
// genSalt => indique la difficulté à déhasher un mot de passe
// hash => "mot de passe"=> "lshqfdshms65fsdd5fsdd5fsdsdhjkgsd"

const routes = Router();

routes.post("/", async(req, res)=>{
    const { body } = req; // récupération de la partie body de la requête POST

// on doit vérifer qu'il n'existe pas un autre user avec le même email déjà présent en BDD

// attention, lorsque l'on stocke en base de données des passwords
// => il faut les hashé (crypter)
// traitement hashage du password
// NodeJS => module crypto
// https://nodejs.org/dist/latest-v18.x/docs/api/crypto.html
// un autre module depuis npmjs.org => bcrypt

    const { error } = schemaUserJoi.validate(body, {abortEarly : false});
    //{abortEarly : false} => permet d'afficher toutes les erreur dans l'objet "error"
    if (error) return res.status(400).json(error.details); // Bad Request

    const userRecherche = await User.find({email:body.email});
    if (userRecherche.length>0) return res.status(400).json({msg : "email déjà utilisé"});

///////////////////////////////////
//// protection du mot de passe ///
///////////////////////////////////

    const salt = await genSalt(10);
    const passwordHashe = await hash(body.password, salt);
    // return res.json(passwordHashe);
    ///////////////////////////////////
    const newUser = new User({email:body.email, password:passwordHashe});
    await newUser.save(); // en utilisant MongoDB => traitement asynchrone qui nécessite des await
    return res.json(newUser);
});

routes.delete("/:userId", async(req, res)=>{
    const userId = req.params.userId;
    const userRecherche = await User.findByIdAndRemove(userId);
    if (!userRecherche) return res.status(400).json({msg:`l'Id utilisateur ${userId} n'existe pas`});
    return res.json({msg:" l'utilisateur a bien été supprimé", userSupprime:userRecherche});
});

routes.get("/all", async(req, res)=>{
    const allUser = await User.find();
    const allUserFiltre = allUser.map(user=>{return {email:user.email, _id: user._id}});
    return res.json(allUserFiltre);
})


// quelque soit la route / quelque soit la méthode => il doit y avoir une "res" retournée

module.exports = routes; // export default, lors de l'import on pourra changer son nom

// cas pratique : dans le fichier route-user.js 
// créer une nouvelle route permettant de supprimer un profil utilisateur via son id 
// créer une nouvelle route permettant de récupérer tous les profils utilisateurs sans le password (uniquement email et _id )