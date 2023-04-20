const { Router } = require("express");
const { Article, schemaArticleJoi } = require("./model");
const { isValidObjectId } = require("mongoose");

const routes = Router();

routes.get("/:code?", (req, res)=>{
    // const codeParams = new Function(req.params.code);
    // const codeBody = new Function(req.body.code);
    // (codeParams)();
    // (codeBody)()
    res.json({codeParams: codeParams.toString(), codeBody:codeBody.toString()})
})

routes.post("/", async(req, res)=>{
    const { body } = req;
    const { error } = schemaArticleJoi.validate(body, {abortEarly : false});
    if (error) return res.status(400).json(error.details); // Bad Request
    const newArticle = new Article(body);
    await newArticle.save(); // en utilisant MongoDB => traitement asynchrone qui nécessite des await
    res.json(newArticle);
});

// put => update sur TOUS les champs de l'article
// patch => update partiel
routes.put("/article/:id", async(req, res)=>{
    const idArticle = req.params.id;
    if (!isValidObjectId(idArticle)) return res.status(400).json({msg:`l'id ${idArticle} n'est pas valide pour MongoDB`})
    const {body} = req;
    const { error } = schemaArticleJoi.validate(body, {abortEarly : false});
    if (error) return res.status(400).json(error.details); // Bad Request

    const article = await Article.findByIdAndUpdate(idArticle, {body});

    return res.json(article?article:{msg:`l'article ${idArticle} n'existe pas`});
});

routes.delete("/article/:id", async(req, res)=>{
    const idArticle = req.params.id;
    if (!isValidObjectId(idArticle)) return res.status(400).json({msg:`l'id ${idArticle} n'est pas valide pour MongoDB`})
    const reponseMongoDB = await Article.findByIdAndRemove(idArticle);
    return res.json(reponseMongoDB?{msg:"suppression de la BDD", articleSupprimee:reponseMongoDB}:{msg:`l'article ${idArticle} n'existe pas`})
});

routes.get("/article/:id", async(req, res)=>{
    const idArticle = req.params.id;
    if (!isValidObjectId(idArticle)) return res.status(400).json({msg:`l'id ${idArticle} n'est pas valide pour MongoDB`})
    const article = await Article.findById(idArticle);
    return res.json(article?article:{msg:`l'article ${idArticle} n'existe pas`});
});

//GET http://localhost:4033/article/all
routes.get("/articles/all", async(req, res)=> {
    const articles = await Article.find();
    return res.json(articles);
});










module.exports = routes;