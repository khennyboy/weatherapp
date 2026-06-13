import z from "zod";

export const Userschema = z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string(),
    email: z.string().email(),
})