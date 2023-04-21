const { Router } = require("express");
const { User, schemaUserJoi } = require("./model");
const { compare } = require("bcrypt");
const { sign, verify } = require("jsonwebtoken");


const route = Router();

route.post("/", async (req, res)=>{
    const { body } = req;
    const { error } = schemaUserJoi.validate(body, {abortEarly:false});
    if ( error ) return res.status(400).json(error.details);
    const UserRecherche = await User.findOne({ email : body.email });
    // les méthodes User.find({conditions}) renvoie un tableau d'User qui répond aux conditions
    if(!UserRecherche) return res.status(404).json({msg : "aucun profil trouvé avec ces identifiants"});
    // User.find({email:body.email}) => [{}, {}] ou []
    // User.findOne({email:body.email}) => {} ou null
    const verif = await compare(body.password, UserRecherche.password);
    // il n'est pas possible de faire nous même la comparaison => bcrypt.compare() va s'en occuper
    if (!verif) return res.status(404).json({msg : "aucun profil trouvé avec ces identifiants"});
    // pour renvoyer un jsonwebtoken nous allons utliser un module jsonwebtoken (à installer au préalable : npm i jsonwebtoken)
    const userWithoutPassword = {
        _id : UserRecherche._id,
        email : UserRecherche.email
    };

    const token = sign(userWithoutPassword, process.env.JWT_SECRET);
    res.json({ msg: "Bienvenu", token : token }); // authentification => qui est l'utilistateur?
                                                // autorisation associé à l'utilisateur authentifié

    // jsonwebtoken : https://jwt.io
});

module.exports = route;