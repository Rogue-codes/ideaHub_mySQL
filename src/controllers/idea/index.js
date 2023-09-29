import { db } from "../../config/db/index.js";

export const createIdea = (req, res) => {
  const { idea, idea_description, hub_id, campaign_id } = req.body;
  if (!idea) {
    return res.status(400).json({
      success: false,
      message: "Idea is required",
    });
  }
  if (!idea_description) {
    return res.status(400).json({
      success: false,
      message: "Idea description is required",
    });
  }
  if (!hub_id) {
    return res.status(400).json({
      success: false,
      message: "hub ID is required",
    });
  }
  if (!campaign_id) {
    return res.status(400).json({
      success: false,
      message: "Campaign ID is required",
    });
  }

  const q =
    "INSERT INTO idea (idea, idea_description,hub_id,campaign_id,member_id) VALUES (?,?,?,?,?)";

    const memberId = req.member.member_id
  db.query(
    q,
    [idea, idea_description, hub_id, campaign_id, memberId],
    (err, data) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      res.status(200).json({
        success: true,
        message: "Idea has been added",
        data,
      });
    }
  );
};

export const getCampaignIdeas = (req, res) => {
  const { id } = req.params;

  console.log(id);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "campaign ID is required",
    });
  }

  const q = "SELECT * FROM idea WHERE campaign_id = ?";

  db.query(q, [id], (err, data) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    if (!data.length) {
      return res.status(404).json({
        success: false,
        message: "idea not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "ideas retreived",
      data,
    });
  });
};

export const getIdea = (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Idea Id is required",
    });
  }

  const q = "SELECT * FROM idea WHERE idea_id = ?";
  db.query(q, [id], (err, data) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });

    if (!data.length) {
      return res.status(404).json({
        success: false,
        message: "idea not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "idea retrieved successfully",
      data,
    });
  });
};

export const updateIdea = (req, res) => {
  const { id } = req.params;
  const { idea, idea_description } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Idea ID is required",
    });
  }

  // Get the idea
  const ideaQuery = "SELECT * FROM idea WHERE idea_id = ?";

  db.query(ideaQuery, [id], (err, ideaData) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (!ideaData.length) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    const campaign_id = ideaData[0].campaign_id;

    // Get the campaign
    const campaignQuery = "SELECT * FROM campaign WHERE campaign_id = ?";

    db.query(campaignQuery, [campaign_id], (err, campaignData) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (!campaignData.length) {
        return res.status(404).json({
          success: false,
          message: "Cannot find campaign to which the idea belongs",
        });
      }

      const today = new Date();
      const campaign_exp_date = new Date(campaignData[0].campaign_endDate);

      if (today > campaign_exp_date) {
        return res.status(400).json({
          success: false,
          message: "This campaign is expired",
        });
      }

      const updateQuery =
        "UPDATE idea SET idea = ?, idea_description = ? WHERE idea_id = ? AND member_id = ?";
      const memberId = req.member.member_id;
      db.query(
        updateQuery,
        [idea, idea_description, id, memberId],
        (err, updateData) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          if (updateData.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: "Idea not found",
            });
          }

          res.status(200).json({
            success: true,
            message: "Idea updated successfully",
            data: updateData,
          });
        }
      );
    });
  });
};

export const deleteIdea = (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "idea ID is required",
    });
  }

  const q = "DELETE FROM idea WHERE idea_id = ?  and member_id = ?";
  const memberId = req.member.member_id;
  db.query(q, [id, memberId], (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (!data.affectedRows > 0) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Idea successfully deleted",
      data,
    });
  });
};
