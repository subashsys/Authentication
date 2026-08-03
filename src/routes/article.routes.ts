import Router from "express";
import {  createArticle, deleteArticle, getArticle, updateArticle, } from "../controller/article.controller";
import { createArticleSchema, delteArticleSchema, updateArticleSchema } from "../validations/article.validation";
import { validate } from "../middleware/validate.middleware";

const router = Router()

router.get("/",getArticle)
router.post("/",validate(createArticleSchema),createArticle)
router.put("/:id",validate(updateArticleSchema),updateArticle)
router.delete("/:id",validate(delteArticleSchema),deleteArticle)


   
export default router