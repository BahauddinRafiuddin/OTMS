import { Router } from "express";
import { upload } from '../Middlewares/multer.middleware.js'
import {
    deleteLandlord,
    getAllLandlords,
    getLandlordById,
    landlordChangePassword,
    landlordLogin,
    registerLandlord,
    updateLandlordProfile
} from "../Controller/landlord.controller.js";
import { verifyJWTLandlord } from "../Middlewares/auth.middleware.js";

const router = Router()

router.route('/register').post(
    upload.single("avatar"),
    registerLandlord
)

router.route('/login').post(landlordLogin)
router.route('/').get(getAllLandlords)  // Here You Can Admin Authorization Middleware..
router.route('/:landlordId')
    .get(verifyJWTLandlord, getLandlordById)
    .put(verifyJWTLandlord, upload.single("avatar"), updateLandlordProfile)
    .delete(verifyJWTLandlord,deleteLandlord)

router.route('/change-password').post(verifyJWTLandlord,landlordChangePassword)
export default router