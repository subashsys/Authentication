import Router from "express";
import { getTodo } from "../controller/article.controller";

const router = Router()

router.get("/",getTodo)

export default router