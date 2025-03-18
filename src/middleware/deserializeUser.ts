import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import log from "../utils/logger";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = (req.headers.authorization || "").replace(/^Bearer\s/, "");

  if (!accessToken) {
    next();
    return ;
  }

  try {
    const decoded = await verifyJwt(accessToken, "accessTokenPublicKey");

    if (decoded) {
      res.locals.user = decoded;

      log.debug("User deserialized and attached to res.locals");
    }

    next();
    return 
  } catch (err) {
    log.error(err, "Error verifying JWT");
    res.status(401).send("Invalid or expired token");
    return ;
  }
};

export default deserializeUser;