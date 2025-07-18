import { Request, Response } from "express";
import { CreateUserInput, ForgetPasswordInput, ResetPasswordInput, VerifyUserInput, UpdateUserInput, VerifyResetCodeInput } from "../schema/user.schema";
import { createUser, findUserByEmail, findUserById, updateUser, deleteUser, getAllUsersById, getAllUsers, getUsersByRole } from "../services/user.service";
import { UserRole, UserModel, DoctorModel, ParentModel, privateFields } from "../models/user.model";
import log from "../utils/logger";
import sendEmail from "../utils/mailer";
import { generate4DigitCode } from "../utils/generateCode";

function getModelByRole(role: UserRole) {
    switch (role) {
        case UserRole.DOCTOR:
            return DoctorModel;
        case UserRole.PARENT:
            return ParentModel;
        default:
            throw new Error('Invalid role');
    }
}

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
    const body = req.body;

    try {
        const Model = getModelByRole(body.role);
        const user = await createUser(body, Model);

        const url = await sendEmail({
            from: 'test@gmail.com',
            to: user.email,
            subject: "Please verify your account",
            text: `Verification code: ${user.verificationCode}`,
        });

        res.status(201).json({
            message: `${body.role} successfully created`,
            PreviewURL: url,
            user: user.toJSON({ virtuals: true, transform: (_doc: any, ret: { [x: string]: any; }) => {
                privateFields.forEach((field) => delete ret[field]);
                return ret;
            } }),
        });
    } catch (err: unknown) {
        log.error(err, `Error creating ${body.role} user`);
        if (err instanceof Error) {
            if (err.message.includes("E11000")) {
                res.status(409).send(`${body.role} with this email already exists`);
                return;
            }
            res.status(400).send(err.message);
            return;
        }
        res.status(500).send("Internal Server Error");
    }
}

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
    const { email, verificationCode } = req.params;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        if (user.verified) {
            res.status(400).send("User is already verified, Please login!");
            return;
        }

        if (user.verificationCode === verificationCode) {
            user.verified = true;
            await user.save();
            res.status(200).send("User successfully verified, Please login!");
            return;
        } else {
            res.status(400).send("Invalid verification code");
            return;
        }
    } catch (err) {
        log.error(err, "Error verifying user");
        res.status(500).send("Internal server error");
    }
}

export async function forgetPasswordHandler(req: Request<{}, {}, ForgetPasswordInput>, res: Response) {
    const message = "If a user with that email is registered, you will receive a password reset email";
    const { email } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            res.status(200).json({ message });
            return;
        }

        if (!user.verified) {
            res.status(200).json({ message });
            return;
        }

        const resetCode = generate4DigitCode();
        user.passwordResetCode = resetCode;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        const url = await sendEmail({
            from: 'test@gmail.com',
            to: user.email,
            subject: "Reset your password",
            text: `Password reset code: ${user.passwordResetCode}\nThis code expires in 15 minutes.`,
        });

        log.debug(`Password reset code sent to ${email}`);
        res.status(200).json({
            message,
            PreviewURL: url,
        });
    } catch (err) {
        log.error(err, "Error in forgetPasswordHandler");
        res.status(500).send("Internal server error");
    }
}

export async function verifyResetCodeHandler(req: Request<{}, {}, VerifyResetCodeInput>, res: Response) {
    const { email, passwordResetCode } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (
            !user ||
            !user.passwordResetCode ||
            user.passwordResetCode !== passwordResetCode ||
            !user.resetPasswordExpires ||
            user.resetPasswordExpires < new Date()
        ) {
            res.status(400).send("Invalid or expired reset code");
            return;
        }

        user.passwordResetCode = null;
        await user.save();

        res.status(200).json({ message: 'Valid code' });
    } catch (err) {
        log.error(err, "Error in verifyResetCodeHandler");
        res.status(500).send("Internal server error");
    }
}

export async function resetPasswordHandler(req: Request<{}, {}, ResetPasswordInput>, res: Response) {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (
            !user ||
            user.passwordResetCode !== null ||
            !user.resetPasswordExpires ||
            user.resetPasswordExpires < new Date()
        ) {
            res.status(400).send("Reset not allowed. Please request a new code.");
            return;
        }

        user.password = password;
        await user.save();

        res.status(200).send("Password reset successful");
    } catch (err) {
        log.error(err, "Error in resetPasswordHandler");
        res.status(500).send("Internal server error");
    }
}

export async function getCurrentUserHandler(req: Request, res: Response) {
    try {
        if (!res.locals.user) {
            res.status(404).send("User not found");
            return;
        }
        res.status(200).send(res.locals.user.toJSON({ virtuals: true, transform: (_doc: any, ret: { [x: string]: any; }) => {
            privateFields.forEach((field) => delete ret[field]);
            return ret;
        } }));
    } catch (err) {
        log.error(err, "Error in getCurrentUserHandler");
        res.status(500).send("Internal server error");
    }
}

export async function updateUserHandler(req: Request<{}, {}, UpdateUserInput>, res: Response) {
    const userId = res.locals.user._id;
    const updateData = req.body;

    try {
        const user = await findUserById(userId);

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        const updatedUser = await updateUser(userId, updateData);
        if (!updatedUser) {
            res.status(404).send("Updated user not found");
            return;
        }
        res.status(200).send(updatedUser.toJSON({ virtuals: true, transform: (doc, ret) => {
            privateFields.forEach((field) => delete ret[field]);
            return ret;
        } }));
    } catch (err) {
        log.error(err, "Error updating user");
        res.status(500).send("Internal Server Error");
    }
}

export async function deleteUserHandler(req: Request, res: Response) {
    const userId = res.locals.user._id;

    try {
        const user = await findUserById(userId);

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        await deleteUser(userId);
        res.status(200).send("User successfully deleted");
    } catch (err) {
        log.error(err, "Error deleting user");
        res.status(500).send("Internal Server Error");
    }
}

export async function getAllUsersByIdHandler(req: Request, res: Response) {
    const userIds = req.body.userIds;

    if (!userIds || !Array.isArray(userIds)) {
        res.status(400).send("Invalid user IDs");
        return;
    }

    try {
        const users = await getAllUsersById(userIds);
        res.status(200).send(users.map(user => user.toJSON({ virtuals: true, transform: (doc, ret) => {
            privateFields.forEach((field) => delete ret[field]);
            return ret;
        } })));
    } catch (err) {
        log.error(err, "Error fetching users by IDs");
        res.status(500).send("Internal Server Error");
    }
}

export async function getAllUsersHandler(req: Request, res: Response) {
    try {
        const users = await getAllUsers();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users.map(user => user.toJSON({ virtuals: true, transform: (doc, ret) => {
                privateFields.forEach((field) => delete ret[field]);
                return ret;
            } })),
        });
    } catch (err) {
        log.error(err, "Error fetching all users");
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export async function getUsersByRoleHandler(req: Request, res: Response) {
    const { role } = req.query as { role: UserRole };

    if (!role || !Object.values(UserRole).includes(role)) {
        res.status(400).json({
            success: false,
            message: "Invalid role. Role must be 'doctor' or 'parent'",
        });
        return;
    }

    try {
        const users = await getUsersByRole(role);
        res.status(200).json({
            success: true,
            count: users.length,
            data: users.map(user => user.toJSON({ virtuals: true, transform: (doc, ret) => {
                privateFields.forEach((field) => delete ret[field]);
                return ret;
            } })),
        });
    } catch (err) {
        log.error(err, "Error fetching users by role");
        res.status(500).json({
            success: false,
            message: "Failed to fetch users by role",
        });
    }
}
