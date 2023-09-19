import express from 'express';
import { createAdmin, login, logout } from '../../controllers/admin/index.js';

const adminRoute = express.Router()

adminRoute.post('/admin/register', createAdmin)
adminRoute.post('/admin/login', login)
adminRoute.post('/admin/logout', logout)

export default adminRoute