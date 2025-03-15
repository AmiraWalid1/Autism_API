import {z} from 'zod';
import { UserRole } from '../models/user.model';


export const createUserSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: "Name is required"
        }),

        email: z.string({
            required_error: "Email is required"
        })
        .email("Invalid Email")
        .transform((val) => val.toLowerCase()),

        password: z.string({
            required_error: "Password is required"
        })
        .min(6, "Password is too short - should be min 6 chars"),

        phoneNumber: z.number({
            required_error: "Phone Number is required"
        }),

        role: z.nativeEnum(UserRole)
    })
})

export const verifyUserSchema = z.object({
    params: z.object({
        id: z.string(),
        verificationCode: z.string()
    })
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>["body"];
export type VerifyUserInput = z.TypeOf<typeof verifyUserSchema>["params"];