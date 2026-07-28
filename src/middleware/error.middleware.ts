import {Request, Response, NextFunction } from "express"

export const errorHandler=(error:any,req:Request,res:Response, next:NextFunction)=>{

    const statusCode = error.statusCode || 500;

    const message= error.message || "Enternal server error"

    res.status(statusCode).json({
        message

    })
}