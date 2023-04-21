const { Router } = require("express");
const { Article, schemaArticleJoi } = require("./model");
const { isValideIdArticle, isValideArticle, autorisation, isAdmin } = require("./middleware");

const routes = Router();



routes.post("/", autorisation, isValideArticle, async(req, res)=>{   
    const userId = req.user._id;
    console.log(userId);
    const newArticle = new Article({...req.body, auteur:userId});
    await newArticle.save(); // en utilisant MongoDB => traitement asynchrone qui nécessite des await
    res.json(newArticle);
});

// put => update sur TOUS les champs de l'article
// patch => update partiel
routes.put("/article/:id", autorisation, isValideIdArticle, isValideArticle, async(req, res)=>{
    const article = await Article.findByIdAndUpdate(req.params.id, req.body);
    if (!article) return res.status(404).json({erreur: `L'article à l'id ${req.params.id} n'existe pas !`})
    return res.json({articleModifie : article});
});

routes.delete("/article/:id", autorisation, isAdmin, isValideIdArticle, async(req, res)=>{
    const reponseMongoDB = await Article.findByIdAndRemove(req.params.id);
    return res.json(reponseMongoDB?{msg:"suppression de la BDD", articleSupprimee:reponseMongoDB}:{msg:`l'article ${req.params.id} n'existe pas`})
});

routes.get("/article/:id", isValideIdArticle, async(req, res)=>{
    const idArticle = req.params.id;
    const article = await Article.findById(idArticle);
    return res.json(article?article:{msg:`l'article ${idArticle} n'existe pas`});
});

//GET http://localhost:4033/article/all
routes.get("/articles/all" , async(req, res)=> {
    const articles = await Article.find().populate("auteur", "email -_id role");
    return res.json(articles);
});

routes.get("/articles-of-user/:userId" , async(req, res)=> {
    const userId = req.params.userId;
    const tousLesArticles = await Article.find({auteur : userId}).populate("auteur", "email -_id role");
    return res.json(tousLesArticles);
});
// attention à l'ordre des middlewares qui a son importance
// https://www.youtube.com/watch?v=22d4_KIqBNc
// https://grafikart.fr/tutoriels/conteneur-dependance-922









module.exports = routes;