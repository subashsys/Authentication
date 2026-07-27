import {z} from "zod"

export const createArticleSchema = z.object({
    body:z.object({
        title:z.string().min(3,"Title too short").max(50, "Title too long"),
        description:z.string().min(300, "Description too short").max(5000,"Descption too long")
    })
})