import Router from "express";
import {  createArticle, deleteArticle, getArticle, updateArticle, } from "../controller/article.controller";
import { createArticleSchema, delteArticleSchema, updateArticleSchema } from "../validations/article.validation";
import { validate } from "../middleware/validate.middleware";
import { authenticate } from "../middleware/auth.middleware";

const router = Router()

router.get("/",getArticle)
router.post("/",authenticate,validate(createArticleSchema),createArticle)
router.put("/:id",authenticate,validate(updateArticleSchema),updateArticle)
router.delete("/:id",authenticate,validate(delteArticleSchema),deleteArticle)


   
export default router