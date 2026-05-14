import express from 'express'
import { addDoctor, allDoctors, loginAdmin, deleteDoctor } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js' 
import { changeAvailability } from '../controllers/doctorController.js'
import { adminAppointments, adminDashboard } from '../controllers/appointmentController.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.post('/delete-doctor', authAdmin, deleteDoctor)
adminRouter.get('/appointments', authAdmin, adminAppointments)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

export default adminRouter
