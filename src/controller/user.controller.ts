import { Request, Response } from "express";
import { CreateUserInput, VerifyUserInput  } from "../schema/user.schema";
import { createUser, findUserById } from "../services/user.service";
import log from "../utils/logger";
import sendEmail from "../utils/mailer";
import { User } from "../models/user.model";

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
      text: `Verification code: ${user.verificationCode}, ID: ${user._id}`
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
  const { id, verificationCode } = req.params;

  try {
    const user = await findUserById(id);

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
    }

    res.status(400).send("Invalid verification code");
    return; 
  } catch (err) {
    log.error(err, "Error verifying user");
    res.status(500).send("Internal server error");
    return; 
  }
}