import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

import { customAlphabet } from 'nanoid';
import { CreateUserInput, ForgetPasswordInput, ResetPasswordInput, VerifyUserInput , UpdateUserInput } from "../schema/user.schema";
import { createUser, findUserByEmail, findUserById , updateUser , deleteUser , getAllUsersById , getAllUsers , getUsersByRole} from "../services/user.service";
import { UserRole } from "../models/user.model";

import log from "../utils/logger";
import sendEmail from "../utils/mailer";
import { User } from "../models/user.model";
import { generate4DigitCode } from "../utils/generateCode";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);

    const url = await sendEmail({
      from: 'test@gmail.com',
      to: user.email,
      subject: "Please verify your account",
      text: `Verification code: ${user.verificationCode}`
    });

    res.status(201).json({
      "message": `User successfully created`,
      "Preview URL": url
    });
    return;
  } catch (err: unknown) {
    log.error(err, "Error creating user");

    if (err instanceof Error) {
      if (err.message.includes("E11000")) { // Duplicate key error (MongoDB)
        res.status(409).send("Account already exists");
        return;
      }
      res.status(400).send(err.message);
      return;
    }

    res.status(500).send("Internal Server Error");
    return;
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
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
      res.status(200).send("User successfully verified");
      return;
    } else {
      res.status(400).send("Invalid verification code");
      return;
    }
  } catch (err) {
    log.error(err, "Error verifying user");
    res.status(500).send("Internal server error");
    return;
  }
}

export async function forgetPasswordHandler(
  req: Request<{}, {}, ForgetPasswordInput>,
  res: Response
) {
  const message =
    "If a user with that email is registered, you will receive a password reset email";

  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      log.debug(`User with email ${email} does not exist`);
      res.status(404).send(message);
      return;
    }

    if (!user.verified) {
      res.status(403).send("User is not verified");
      return;
    }

    const passwordResetCode = generate4DigitCode();
    user.passwordResetCode = passwordResetCode;
    await user.save();

    const url = await sendEmail({
      from: 'test@gmail.com',
      to: user.email,
      subject: "Reset your password",
      text: `Password reset code: ${user.passwordResetCode}`
    });

    log.debug(`Password reset code sent to ${email}`);
    res.status(200).json({
      "message": message,
      "Preview URL": url
    });
    
    return;
  } catch (err) {
    log.error(err, "Error in forgetPasswordHandler");
    res.status(500).send("Internal server error");
    return;
  }
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  const { email, passwordResetCode } = req.params;
  const { password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
      res.status(400).send("Could not reset user password");
      return;
    }

    user.passwordResetCode = null;
    user.password = password;
    await user.save();

    res.status(200).send("Successfully updated password");
    return;
  } catch (err) {
    log.error(err, "Error in resetPasswordHandler");
    res.status(500).send("Internal server error");
    return;
  }
}

export async function getCurrentUserHandler(
  req: Request,
  res: Response
) {
  try {
    if (!res.locals.user) {
      res.status(404).send("User not found");
      return;
    }
    res.status(200).send(res.locals.user);
    return;
  } catch (err) {
    log.error(err, "Error in getCurrentUserHandler");
    res.status(500).send("Internal server error");
    return;
  }
}

export async function updateUserHandler(
  req: Request<{}, {}, UpdateUserInput>,
  res: Response
) {
  const userId = res.locals.user._id;  
  const updateData = req.body; 

  try {
    const user = await findUserById(userId); 

    if (!user) {
      res.status(404).send("User not found");
      return;
    }
  
    const updatedUser = await updateUser(userId, updateData);

    res.status(200).send(updatedUser);
    return;
  } catch (err) {
    log.error(err, "Error updating user");
    res.status(500).send("Internal Server Error");
    return;
  }
}


export async function deleteUserHandler(
  req: Request,
  res: Response
) {
  const userId = res.locals.user._id; 

  try {
    const user = await findUserById(userId); 

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    await deleteUser(userId);

    res.status(200).send("User successfully deleted");
    return;
  } catch (err) {
    log.error(err, "Error deleting user");
    res.status(500).send("Internal Server Error");
    return;
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
    res.status(200).send(users);    
    return;
  } catch (err) {
    log.error(err, "Error fetching users by IDs");
    res.status(500).send("Internal Server Error");
    return;
  }
}


export async function getAllUsersHandler(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    log.error(err, "Error fetching all users");
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}


export async function getUsersByRoleHandler(
  req: Request,
  res: Response
) {
  const { role } = req.query as { role: UserRole };

  if (!role || !Object.values(UserRole).includes(role)) {
    res.status(400).json({
      success: false,
      message: "Invalid role. Role must be 'parent' or 'doctor'"
    });
    return;
  }

  try {
    const users = await getUsersByRole(role);
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    log.error(err, "Error fetching users by role");
    res.status(500).json({
      success: false,
      message: "Failed to fetch users by role"
    });
  }
}