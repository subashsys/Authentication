import { Request,Response, NextFunction } from "express";
import { success, ZodType } from "zod";

export const validate=
(schema:ZodType)=>(req:Request, res: Response, next:NextFunction)=>{
    const result=schema.safeParse({
        body:req.body,
        params:req.params,
        query:req.query
    }) 
    if (!result.success){
        res.status(400).json({
            success:false,
            message:"Validation failed",
            error:result.error.issues
        })
    }
    next()
}