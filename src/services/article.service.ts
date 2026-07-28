import {prisma} from "../config/prisma"

export const getTodos = async()=>{
    return await prisma.article.findMany();
}