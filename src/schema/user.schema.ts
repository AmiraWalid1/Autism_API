import { z } from 'zod';
import { UserRole } from '../models/user.model';

export const createUserSchema = z.object({
    body: z
        .object({
            name: z.string({
                required_error: "Name is required",
            }),
            email: z
                .string({
                    required_error: "Email is required",
                })
                .email("Invalid Email")
                .transform((val) => val.toLowerCase()),
            password: z
                .string({
                    required_error: "Password is required",
                })
                .min(6, "Password is too short - should be min 6 chars"),
            passwordConfirmation: z.string({
                required_error: "Password confirmation is required",
            }),
            phoneNumber: z.number({
                required_error: "Phone Number is required",
            }),
            role: z.nativeEnum(UserRole),
            identityVerification: z.string().optional(),
            selfiePhoto: z
                .string()
                .optional(),
            specialization: z
                .string({
                    required_error: "Specialization is required for doctors",
                })
                .optional(),
            description: z
                .string()
                .optional(),
            clinicLocation: z
                .string()
                .optional(),
            rating: z.number().min(0).max(5).optional(),
            children: z.array(z.string()).optional(),
        })
        .refine((data) => data.password === data.passwordConfirmation, {
            message: "Passwords do not match",
            path: ["passwordConfirmation"],
        })
        
});

export const verifyUserSchema = z.object({
    params: z.object({
        email: z
            .string({
                required_error: "Email is required",
            })
            .email("Invalid Email")
            .transform((val) => val.toLowerCase()),
        verificationCode: z.string({
            required_error: "verificationCode is required",
        }),
    }),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email('Invalid Email'),
    }),
});

export const verifyResetCodeSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email('Invalid Email')
            .transform((val) => val.toLowerCase()),
        passwordResetCode: z
            .string({
                required_error: 'Reset code is required',
            })
            .length(4, 'Code must be exactly 4 digits')
            .regex(/^\d{4}$/, 'Code must be numeric'),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email('Invalid Email')
            .transform((val) => val.toLowerCase()),
        password: z
            .string({
                required_error: 'Password is required',
            })
            .min(6, 'Password is too short - should be min 6 chars'),
        passwordConfirmation: z.string({
            required_error: 'Password confirmation is required',
        }),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'Passwords do not match',
        path: ['passwordConfirmation'],
    }),
});

export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().email("Invalid Email").optional(),
        phoneNumber: z.number().optional(),
        identityVerification: z.string().optional(),
        selfiePhoto: z.string().optional(),
        specialization: z.string().optional(),
        description: z.string().optional(),
        clinicLocation: z.string().optional(),
        appointments: z.array(appointmentSchema).optional(),
        rating: z.number().min(0).max(5).optional(),
        children: z.array(z.string()).optional(),
    }),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>["body"];
export type VerifyUserInput = z.TypeOf<typeof verifyUserSchema>["params"];
export type ForgetPasswordInput = z.TypeOf<typeof forgotPasswordSchema>["body"];
export type VerifyResetCodeInput = z.TypeOf<typeof verifyResetCodeSchema>["body"];
export type ResetPasswordInput = z.TypeOf<typeof resetPasswordSchema>["body"];
export type UpdateUserInput = z.TypeOf<typeof updateUserSchema>["body"];