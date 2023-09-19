import { db } from "../../config/db/index.js";
import bcrypt from "bcrypt";
import { genToken } from "../../utils/gentoken/index.js";

export const createAdmin = (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  // validate presence of req.body
  if (!first_name) {
    return res.status(400).json({
      success: false,
      message: "first_name is required",
    });
  }
  if (!last_name) {
    return res.status(400).json({
      success: false,
      message: "last_name is required",
    });
  }
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "email is required",
    });
  }
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "password is required",
    });
  }
  const q = `SELECT * FROM admin WHERE email = ?`;
  db.query(q, [email], (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    if (data.length) {
      return res.status(400).json({
        success: false,
        message: "user with this email already exists",
      });
    }
    // hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const insert_q =
      "INSERT INTO admin (first_name, last_name, email, password) VALUES (?)";
    const values = [first_name, last_name, email, hashedPassword];
    db.query(insert_q, [values], (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "registration successful",
      });
    });
  });
};

// login
export const login = (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({
      success: false,
      message: "email is required",
    });
  }
  if (!req.body.password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  const q = "SELECT * FROM admin where email = ?";
  db.query(q, [req.body.email], (err, data) => {
    if (err)
      return res.status(err).json({
        success: false,
        message: err.message,
      });
    if (!data.length > 0)
      return res.status(400).json({
        success: false,
        message: "email not found",
      });
    // compare password
    const passwordMatch = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
    const token = genToken(data[0].admin_id);
    const { password, ...others } = data[0];
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        message: "login successfull",
        data: others,
      });
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({
      success: true,
      message: "logout successful",
    });
};
