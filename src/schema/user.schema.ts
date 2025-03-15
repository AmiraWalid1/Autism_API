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
        
        passwordConfirmation: z.string({
            required_error: "Password confirmation is required",
        }),

        phoneNumber: z.number({
            required_error: "Phone Number is required"
        }),

        role: z.nativeEnum(UserRole)
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    }),
})

export const verifyUserSchema = z.object({
    params: z.object({
        id: z.string({
            required_error: "id is required"
        }),
        verificationCode: z.string({
            required_error: "verificationCode is required"
        })
    })
});

export const forgetPasswordSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: "Email is required"
        })
        .email("Invalid Email")

    })
});

export const resetPasswordSchema = z.object({
    params: z.object({
        id: z.string({ required_error: "id is required" }),
        passwordResetCode: z.string({ 
            required_error: "passwordResetCode is required" 
        })
    }),
    body: z.object({
        password: z.string({
            required_error: "Password is required"
        })
        .min(6, "Password is too short - should be min 6 chars"),
        passwordConfirmation: z.string({
            required_error: "Password confirmation is required",
        }),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    }),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>["body"];
export type VerifyUserInput = z.TypeOf<typeof verifyUserSchema>["params"];
export type ForgetPasswordInput = z.TypeOf<typeof forgetPasswordSchema>["body"];
export type ResetPasswordInput = z.TypeOf<typeof resetPasswordSchema>;
