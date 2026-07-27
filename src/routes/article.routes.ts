import Router from "express";
import { getTodo } from "../controller/article.controller";
import { createArticleSchema } from "../validations/article.validation";
import { validate } from "../middleware/validate.middleware";

const router = Router()

router.get("/",getTodo)
router.post("/:id",validate(createArticleSchema))



export default router