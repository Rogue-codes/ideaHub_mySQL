import { db } from "../../config/db/index.js";
import { genToken } from "../../utils/gentoken/index.js";

export const addMember = (req, res) => {
  const { member_name, member_email, hub_id } = req.body;

  if (!member_name) {
    return res.status(400).json({
      success: false,
      message: "Member name is required",
    });
  }
  if (!member_email) {
    return res.status(400).json({
      success: false,
      message: "Member email is required",
    });
  }
  if (!hub_id) {
    return res.status(400).json({
      success: false,
      message: "hub_id is required",
    });
  }
  //   check if email is already registered
  const q = "SELECT * FROM member WHERE member_email =? AND hub_id = ?";
  db.query(q, [member_email, hub_id], (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    if (data.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Member with this email address already exists",
      });
    }
    const insert_q =
      "INSERT INTO member (member_name, member_email, hub_id, admin_id) VALUES (?, ?, ?, ?)";
    const adminId = req.admin.admin_id;
    db.query(
      insert_q,
      [member_name, member_email, hub_id, adminId],
      (err, data) => {
        if (err)
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        res
          .status(200)
          .json({ success: true, message: "member added sucessfully", data });
      }
    );
  });
};

export const getHubMembers = (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({
      success: false,
      message: "hub ID is required",
    });

  const q = "SELECT * FROM member WHERE hub_id = ?";
  db.query(q, [id], (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    res
      .status(200)
      .json({ success: true, message: "hub members retrieved", data });
  });
};

export const removeMember = (req, res) => {
  const { hub_id, member_id } = req.body;
  if (!hub_id || !member_id) {
    return res.status(400).json({
      success: false,
      message: "Hub ID and Member ID are required",
    });
  }

  const q =
    "DELETE FROM member WHERE member_id = ? AND hub_id = ? AND admin_id = ? ";

  const adminId = req.admin.admin_id;
  db.query(q, [member_id, hub_id, adminId], (err, data) => {
    if (err)
      return res.status(500).json({
        success: false,
        messsage: err.message,
      });
    if (!data.affectedRows > 0) {
      return res.status(400).json({
        success: false,
        message: "an error occurred",
      });
    }

    res.status(200).json({
      success: true,
      message: "member removed successfully",
      data,
    });
  });
};

export const memberLogin = (req, res) => {
  const { email, hub_id } = req.body;

  if (!email || !hub_id) {
    return res.status(400).json({
      success: false,
      message: "email and hub ID is required",
    });
  }

  const q = "SELECT * FROM member WHERE member_email = ? AND hub_id = ?";

  db.query(q, [email,hub_id], (err, data) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });

    if (!data.length > 0) {
      return res.status(400).json({
        success: false,
        message: "invalid email address",
      });
    }

    const token = genToken(data[0].member_id);

    res
      .cookie("member_access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        message: "member login successful",
        data,
      });
  });
};
