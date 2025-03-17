import { Request, Response } from "express";
import { CreateSessionInput } from "../schema/auth.schema";
import { findUserByEmail } from "../services/user.service";
import { signAccessToken, signRefreshToken } from "../services/auth.service";

export async function createSessionHandler(
    req: Request<{}, {}, CreateSessionInput>,
    res: Response
) {
    const message = "Invalid email or password";
    const {email, password} = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
        res.send(message);
        return;
    }

    if (!user.verified) {
        res.send("Please verify your email");
        return;
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
        res.send(message);
        return;
    }

    // sign a access token
    const accessToken = signAccessToken({userId: user._id.toString(), role: user.role});

    // sign a refresh token
    const refreshToken = await signRefreshToken({userId: user._id.toString()});
    
    // send the tokens
    res.send({accessToken, refreshToken});
    return;
}