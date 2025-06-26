import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token && req.headers.authorization) {
      // Accept both 'Bearer <token>' and 'Bearer token=<token>; ...' formats
      let authHeader = req.headers.authorization.split(" ")[1];
      if (authHeader) {
        // Remove 'token=' if present
        if (authHeader.startsWith("token=")) {
          authHeader = authHeader.replace("token=", "");
        }
        // Remove any trailing semicolon or cookie attributes
        token = authHeader.split(";")[0].trim();
      }
    }

    if (!token) {
      return next(new ErrorHandler("Authentication token required", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid token", 401));
    } else if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token expired", 401));
    } else {
      return next(new ErrorHandler("Authentication error", 401));
    }
  }
});
