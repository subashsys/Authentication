import {prisma} from "../config/prisma"

export const getArticles = async()=>{
    return await prisma.article.findMany();
}


export  const createArticles= async(title:string, description:string, userId:number)=>{
    const article= await prisma.article.create({
        data:{
            title,
            description,
            userId

        }
    })
    return article
 }


export const updateArticles=async(id:number,title:string, description:string,userId:number)=>{
    const article = await prisma.article.findFirst({
        where:{
            id,
            userId
        }
     })
     if(!article){
        throw{
            statusCode:404,
            message:"Article not found"
        }
     }
     const updatedArticles= await prisma.article.update({
        where:{
            id
        },
        data:{
            title,
            description
        }

     })
     return updatedArticles
 }


export const deleteArticles= async(id:number,userId:number)=>{
    const article = await prisma.article.findUnique({
        where:{
            id,
            userId
        }
    })
    if(!article){
        throw{
            statusCode:404,
            message:"Article do not exist"
        }
    }
     await prisma.article.delete({
        where:{
            id
        }
    })
    
}
