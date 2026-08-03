import {coerce, z} from "zod"

export const createArticleSchema = z.object({
    body:z.object({
        title:z.string().min(3,"Title too short").max(50, "Title too long"),
        description:z.string().min(5, "Description too short").max(5000,"Descption too long")
    })
})

export const updateArticleSchema= z.object({
    params:z.object({
        id:z.coerce.number().int("Must be an integer").positive("Must be positive number/greater than 0")
    }),
    body:z.object({
        title:z.string().min(3,"Title too short").max(50, "Title too long"),
        description:z.string().min(5, "Description too short").max(5000,"Descption too long")
    })
})

export const delteArticleSchema=z.object({
    params:z.object({
        id:coerce.number().int("Must be an integer").positive("Must be a positive number")
    })
})