import { Request, Response, NextFunction } from "express"
import * as articleService from "../services/article.service"
import { success } from "zod"

export const getArticle=async(req:Request,res:Response,next:NextFunction)=>{
    try{
       const article = await articleService.getArticles()

       res.status(200).json({
        success:true,
        data:article
       })
       
    }
   catch(error: any){
    next(error)
}
}

export const createArticle= async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const {title, description}=req.body
        const article= await articleService.createArticles(title,description)
        res.status(201).json({
            result:success,
            message:"Article created successfully",
            article
        })
        }
    catch(error){
        next(error)
    }
}

export const updateArticle=async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const id = Number(req.params.id);
        const {title, description}=req.body
        const article = await articleService.updateArticles(id, title, description)
        res.status(200).json({
            result:success,
            message:"Article upfated succesffully",
            article
        })
    }
    catch(error){
        next(error)
    }
}

export const deleteArticle=async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const id =Number(req.params.id)
        await articleService.deleteArticles(id)
        res.status(200).json({
            result:success,
            message:"Article deleted successfully"
        })
    }
    catch(error){
        next(error)
    }
}