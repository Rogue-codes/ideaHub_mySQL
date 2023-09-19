import express from 'express'
import { adminMiddleware } from '../../middleware/adminMiddleware.js'
import { createHub, getHub, getHubs, updateHub } from '../../controllers/hub/index.js'

const hubRoute = express.Router()

hubRoute.post('/hub/create', adminMiddleware, createHub)
hubRoute.get('/hubs/all', adminMiddleware, getHubs)
hubRoute.get('/hubs/:id', adminMiddleware, getHub)
hubRoute.put('/hubs/update/:id', adminMiddleware, updateHub)

export default hubRoute