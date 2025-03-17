import { DocumentType } from "@typegoose/typegoose";
import { User, UserRole } from "../models/user.model";
import { signJwt } from "../utils/jwt";
import SessionModel from "../models/session.model";
import { ObjectId } from "mongoose";

export async function createSession({userId}: {userId: string}){
    return SessionModel.create({ user: userId });
}

export async function signRefreshToken({userId}: {userId: string}){
    const session = await createSession({ userId });

    const refreshToken = signJwt(
        {session: session._id},
        "refreshTokenPrivateKey"
    );

    return refreshToken;
}

export function signAccessToken(user: {userId: string, role: UserRole}){
    const payload = user;

    const accessToken = signJwt(payload, "accessTokenPrivateKey");

    return accessToken;
}