const { connect, Schema, model } = require("mongoose") ;
const express = require("express");
const routesArticles = require("./routes-articles");
const routesUsers = require("./routes-users");
const routeLogin = requre("./routes-connexion");
require("dotenv").config();
// par défaut NODE_ENV est undefined => URI redirige vers l'URI de développement
// set NODE_ENV=production
const URI = process.env.NODE_ENV=="production"? process.env.URI_PROD : process.env.URI_DEV;

connect(URI)
    .then(()=>console.log(`${new Date().toLocaleTimeString("fr-FR")} Connexion à mongoDB en mode ${process.env.NODE_ENV?"PROD":"DEV"} réussie`))
    .catch((err)=>console.error(err))

const PORT = 4003;
const app = express();
app.use(express.json()); // middleware
app.use("/login", routeLogin);
app.use(routesArticles);
app.use("/user", routesUsers); // préfixe de route
console.log("L'application vient de commencer !") ;

// connect(process.env.URI)
//     .then(()=>console.log("connexion réussie"))
//     .catch((err)=>console.log(err));



// app.js = fichier d'entrée de notre API => chef d'orchestre
// => créer le serveur / appeler tout ce qu'il faut pour qu'il fonctionne


app.listen(PORT, ()=> console.log(`${new Date().toLocaleTimeString("fr-FR")} Express start sur port ${PORT}`));