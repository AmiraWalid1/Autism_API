import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import shortid from 'shortid';
import { CreateUserInput, ForgetPasswordInput, ResetPasswordInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserByEmail, findUserById } from "../services/user.service";
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

    await sendEmail({
      from: 'test@gmail.com',
      to: user.email,
      subject: "Please verify your account",
      text: `Verification code: ${user.verificationCode}`
    });

    res.status(201).send("User successfully created");
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
      res.status(400).send("User is already verified");
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

    await sendEmail({
      from: 'test@gmail.com',
      to: user.email,
      subject: "Reset your password",
      text: `Password reset code: ${user.passwordResetCode}`
    });

    log.debug(`Password reset code sent to ${email}`);
    res.status(200).send(message);
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
