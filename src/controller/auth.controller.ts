import { Request, Response } from "express";
import { CreateSessionInput } from "../schema/auth.schema";
import { findUserByEmail } from "../services/user.service";
import { signAccessToken, signRefreshToken } from "../services/auth.service";
import log from "../utils/logger";

export async function createSessionHandler(
    req: Request<{}, {}, CreateSessionInput>,
    res: Response
) {
    const message = "Invalid email or password";
    const {email, password} = req.body;

    const user = await findUserByEmail(email);
    try{
        if (!user) {
            res.status(404).send(message); // 404 Not Found
            return;
        }

        if (!user.verified) {
            res.status(403).send("Please verify your email"); // 403 Forbidden
            return;
        }

        const isValid = await user.validatePassword(password);

        if (!isValid) {
            res.status(401).send(message); // 401 Unauthorized
            return;
        }

        // sign a access token
        const accessToken = signAccessToken({userId: user._id.toString(), role: user.role});

        // sign a refresh token
        const refreshToken = await signRefreshToken({userId: user._id.toString()});
        
        // send the tokens
        res.status(200).send({ accessToken, refreshToken }); // 200 OK
        return;
    }catch (err) {
        log.error("Error in createSessionHandler:", err);
        res.status(500).send("Internal server error"); // 500 Internal Server Error
        return ;
    }
}