import jwt from "jsonwebtoken";
import config from "config";

export function signJwt(
    object: Object,
    keyname: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
    options?: jwt.SignOptions | undefined
){
    const signingKey = Buffer.from(config.get<string>(keyname),"base64").toString("ascii");
    
    return jwt.sign(object, signingKey, {
        ...(options && options),
        
        // asymmetric algorithm that uses a private key for signing and a public key for verification.
        algorithm: "RS256"
    });
}

export function verifyJwt<T>(token: string,
    keyname: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null{
    const publicKey = Buffer.from(config.get<string>(keyname),"base64").toString("ascii");

    try{
        const decoded = jwt.verify(token, publicKey) as T;
        return decoded;
    }catch(err){
        return null;
    }
}
