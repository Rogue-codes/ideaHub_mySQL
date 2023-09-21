import express from 'express'
import { createCampaign, deleteCampaign, getCampaignByHubId, getCampaignById, updateCampaign } from '../../controllers/campaign/index.js'
import { adminMiddleware } from '../../middleware/adminMiddleware.js'

const CampaignRoute = express.Router()

CampaignRoute.post('/campaign/create', adminMiddleware, createCampaign)
CampaignRoute.get('/campaign/:id/all', getCampaignByHubId)
CampaignRoute.get('/campaign/:id', getCampaignById)
CampaignRoute.put('/campaign/update/:id', adminMiddleware, updateCampaign)
CampaignRoute.delete('/campaign/delete/:id', adminMiddleware, deleteCampaign)

export default CampaignRoute