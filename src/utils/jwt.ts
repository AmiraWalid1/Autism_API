import jwt from "jsonwebtoken";
import config from "config";
import log from "../utils/logger"; // Assuming you have a logger utility

export function signJwt<T extends object>(
  payload: T,
  keyname: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions
): string | null {
  try {
    const signingKey = Buffer.from(config.get<string>(keyname), "base64").toString("ascii");

    return jwt.sign(payload, signingKey, {
      ...(options && options),
      algorithm: "RS256", 
      expiresIn: options?.expiresIn || "15m",
    });
  } catch (err) {
    log.error(err, "Error signing JWT");
    return null; 
  }
}

export function verifyJwt<T>(
    token: string,
    keyname: "accessTokenPublicKey" | "refreshTokenPublicKey"
  ): T | null {
    try {
      const publicKey = Buffer.from(config.get<string>(keyname), "base64").toString("ascii");
  
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ["RS256"], 
      }) as T;
  
      return decoded;
    } catch (err: any) {
      log.error(err, "JWT verification failed");
  
      if (err.name === "TokenExpiredError") {
        log.warn("JWT has expired");
      } else if (err.name === "JsonWebTokenError") {
        log.warn("Invalid JWT");
      } else {
        log.warn("Unknown JWT verification error");
      }
  
      return null;
    }
  }
