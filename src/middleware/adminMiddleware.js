import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../config/db/index.js";

dotenv.config();

export const adminMiddleware = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(404).json({
      success: false,
      message: "Token not found",
    });
  }

  try {
    const admin_id = jwt.verify(accessToken, process.env.JWT_SECRET);

    const q = "SELECT * FROM admin WHERE admin_id = ?";
    db.query(q, [admin_id.id], (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (!data.length > 0) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: Invalid access token",
        });
      }

      // Attach the admin data to the request object
      req.admin = data[0];

      // Continue to the next middleware or route handler
      next();
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized: Invalid access token",
    });
  }
};

export const memberMiddleware = (req, res, next) =>{
  const accessToken = req.cookies.member_access_token

  if (!accessToken) {
    return res.status(404).json({
      success: false,
      message: "Token not found",
    });
  }

  try {
    const member_id = jwt.verify(accessToken, process.env.JWT_SECRET);

    const q = "SELECT * FROM member WHERE member_id = ?";
    db.query(q, [member_id.id], (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (!data.length > 0) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: Invalid access token",
        });
      }

      // Attach the member data to the request object
      req.member = data[0];

      // Continue to the next middleware or route handler
      next();
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized: Invalid access token",
    });
  }
}
