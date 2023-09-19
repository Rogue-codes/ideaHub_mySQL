import { db } from "../../config/db/index.js";

export const createHub = (req, res) => {
  const { hub_name, description } = req.body;
  if (!hub_name) {
    return res.status(400).json({
      success: false,
      message: "hub_name is required",
    });
  }
  if (!description) {
    return res.status(400).json({
      success: false,
      message: "description is required",
    });
  }
  // check for potential duplicate of hub_name
  const q = "SELECT * FROM hub WHERE admin_id = ? AND hub_name = ? ";
  const admin = req.admin;
  const admin_id = admin.admin_id;
  db.query(q, [admin_id, hub_name], (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    if (data.length > 0) {
      return res.status(400).json({
        success: false,
        message: "hub name already exists, please enter a new name",
      });
    }
    const insert_q =
      "INSERT INTO hub (admin_id,hub_name,description) VALUES (?,?,?)";
    db.query(insert_q, [admin_id, hub_name, description], (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
      res.status(200).json({
        sucess: true,
        message: "hub created successfully",
        data,
      });
    });
  });
};

// get hubs
export const getHubs = (req, res) => {
  const q = "SELECT * FROM hub WHERE admin_id = ?";

  const admin = req.admin;
  const admin_id = admin.admin_id;
  db.query(q, [admin_id], (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "hubs retrieved successfully",
      data,
    });
  });
};
// get hub
export const getHub = (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "hub ID is required",
    });
  }
  const q = "SELECT * FROM hub WHERE admin_id = ? AND hub_id = ?";

  const admin = req.admin;
  const admin_id = admin.admin_id;
  db.query(q, [admin_id, id], (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    if (!data.length > 0) {
      return res.status(404).json({
        success: false,
        message: "hub not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "hub retrieved successfully",
      data,
    });
  });
};

// update hub
export const updateHub = (req, res) => {
  const { hub_name, description } = req.body;
  const hubId = req.params.id; // Corrected variable name

  if (!hubId) {
    return res.status(400).json({
      success: false,
      message: "Hub ID is required",
    });
  }

  const adminId = req.admin.admin_id; // Simplified variable assignment

  // Build the SQL query for updating the hub
  const q =
    "UPDATE hub SET hub_name = ?, description = ? WHERE admin_id = ? AND hub_id = ?";

  // Execute the update query
  db.query(q, [hub_name, description, adminId, hubId], (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (data.affectedRows === 0) {
      // Checking affectedRows for successful update
      return res.status(404).json({
        success: false,
        message: "Hub not found or you don't have permission to update it",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hub updated successfully",
      data,
    });
  });
};

// delete hub
export const deleteHub = (req, res) => {
  const hub_id = req.params.id; // Improved variable name

  if (!hub_id) {
    return res.status(400).json({
      success: false,
      message: "Hub ID is required",
    });
  }

  const adminId = req.admin.admin_id;

  const q = "DELETE FROM hub WHERE hub_id = ? AND admin_id = ?";

  db.query(q, [hub_id, adminId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Hub not found or you don't have permission to delete it",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hub deleted successfully",
    });
  });
};
