import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_Token;

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  if (
    req.body.username === "" &&
    req.body.email === "" &&
    !req.body.avatar &&
    !req.body.password
  ) {
    return next(errorHandler(402, "You did not update anything"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Token is not valid, you have to sign-out and sign-in again."));
    req.user = user;
  });

  next();
};
