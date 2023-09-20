export const createCampaign = (req, res) => {
  const {
    hub_id,
    campaign_name,
    campaign_description,
    campaign_startDate,
    campaign_endDate,
  } = req.body;

  if(!hub_id){
    return res.status(400).json({
        success: false,
        message:"hub ID is required"
    })
  }

  if(!campaign_name){
    return res.status(400).json({
        success: false,
        message:"campaign_name is required"
    })
  }

  if(!campaign_description){
    return res.status(400).json({
        success: false,
        message:"campaign_description is required"
    })
  }

  if(!campaign_startDate){
    return res.status(400).json({
        success: false,
        message:"campaign_startDate is required"
    })
  }

  if(!campaign_endDate){
    return res.status(400).json({
        success: false,
        message:"campaign_endDate is required"
    })
  }

  const q = "INSERT INTO campaign (campaign_id, campaign_name, campaign_description, campaign_startDate, campaign_endDate"
};
