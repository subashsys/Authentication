import { Request, Response, NextFunction } from "express"
import * as todoService from "../services/article.service"
import { success } from "zod"

export const getTodo=async(req:Request,res:Response,next:NextFunction)=>{
    try{
       const todo = await todoService.getTodos()

       res.status(200).json({
        success:true,
        data:todo
       })
       
    }
   catch(error: any){
    next(error)
}


}