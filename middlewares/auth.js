import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  try {
    // Correctly access the token from cookies
    const token = req.cookies.token || 
                 req.headers.authorization?.split(" ")[1];

    console.log('Token received:', token); // Debugging line
// console.log('Current token:', cookies.getItem('token'));
    if (!token) {
      console.log('No token found in request'); // Debugging
      return next(new ErrorHandler("Authentication token required", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
