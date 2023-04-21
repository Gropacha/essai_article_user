const { Router } = require("express");
const { Article, schemaArticleJoi } = require("./model");
const { isValideIdArticle, isValideArticle, autorisation } = require("./middleware");

const routes = Router();



routes.post("/", isValideArticle, async(req, res)=>{   
    const newArticle = new Article(req.body);
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

routes.delete("/article/:id", autorisation, isValideIdArticle, async(req, res)=>{
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
    const articles = await Article.find();
    return res.json(articles);
});

// attention à l'ordre des middlewares qui a son importance
// https://www.youtube.com/watch?v=22d4_KIqBNc
// https://grafikart.fr/tutoriels/conteneur-dependance-922









module.exports = routes;