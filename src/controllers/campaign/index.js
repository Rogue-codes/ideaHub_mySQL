import { db } from "../../config/db/index.js";
export const createCampaign = (req, res) => {
  const {
    hub_id,
    campaign_name,
    campaign_description,
    campaign_startDate,
    campaign_endDate,
  } = req.body;

  if (!hub_id) {
    return res.status(400).json({
      success: false,
      message: "hub ID is required",
    });
  }

  if (!campaign_name) {
    return res.status(400).json({
      success: false,
      message: "campaign_name is required",
    });
  }

  if (!campaign_description) {
    return res.status(400).json({
      success: false,
      message: "campaign_description is required",
    });
  }

  if (!campaign_startDate) {
    return res.status(400).json({
      success: false,
      message: "campaign_startDate is required",
    });
  }

  if (!campaign_endDate) {
    return res.status(400).json({
      success: false,
      message: "campaign_endDate is required",
    });
  }

  const q =
    "INSERT INTO campaign (admin_id, hub_id, campaign_name, campaign_description, campaign_startDate, campaign_endDate) VALUES (?,?,?,?,?,?)";

  const id = req.admin.admin_id;
  const startDate = new Date(campaign_startDate)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const endDate = new Date(campaign_endDate)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const values = [
    id,
    hub_id,
    campaign_name,
    campaign_description,
    startDate,
    endDate,
  ];

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    res
      .status(200)
      .json({ success: true, message: "Campaign has been created", data });
  });
};

// get campaign related to a hub
export const getCampaignByHubId = (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(404).json({
      success: false,
      message: "campaign not found hub ID is required",
    });

  const q = "SELECT * FROM campaign WHERE hub_id = ?";
  db.query(q, [id], (err, data) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No campaigns found for the provided hub ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "campaigns retrieved successfully",
      data,
    });
  });
};

// get campaign by ID

export const getCampaignById = (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({
      success: false,
      message: "campaign ID is required",
    });

  const q = "SELECT * FROM campaign WHERE campaign_id = ?";
  db.query(q, [id], (err, data) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    if (data.length < 0) {
      return res.status(404).json({
        success: false,
        message: "campaign not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "campaign retrieved successfully",
      data,
    });
  });
};

// update campaign
export const updateCampaign = (req, res) => {
  const { id } = req.params;
  const {
    campaign_name,
    campaign_description,
    campaign_startDate,
    campaign_endDate,
  } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      messsage: "campaign ID is required",
    });
  }
  if (
    !campaign_name ||
    !campaign_description ||
    !campaign_startDate ||
    !campaign_endDate
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Campaign_name, campaign_description, campaign_startDate and campaign_endDate are all required",
    });
  }
  const q =
    "UPDATE campaign SET campaign_name = ?, campaign_description = ? ,campaign_startDate = ?, campaign_endDate =? WHERE campaign_id = ? AND admin_id = ?";
  const adminId = req.admin.admin_id;
  const values = [
    campaign_name,
    campaign_description,
    campaign_startDate,
    campaign_endDate,
    id,
    adminId,
  ];
  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    if (data.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      data,
    });
  });
};

// delete campaign

export const deleteCampaign = (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({
      success: false,
      message: "Campaign ID is required",
    });

  const q = "DELETE FROM campaign WHERE campaign_id =? AND admin_id =?";
  const adminId = req.admin.admin_id;
  db.query(q, [id, adminId], (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "hub not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "campaign deleted successfully",
    });
  });
};
