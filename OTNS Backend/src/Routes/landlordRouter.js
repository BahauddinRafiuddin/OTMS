import { Router } from "express";
import { upload } from '../Middlewares/multer.middleware.js'
import {
    getLandlordById,
    landlordLogin,
    registerLandlord
} from "../Controller/landlord.controller.js";
import { verifyJWTLandlord } from "../Middlewares/auth.middleware.js";

const router = Router()

router.route('/register').post(
    upload.single("avatar"),
    registerLandlord
)

router.route('/login').post(landlordLogin)
router.route('/').get(verifyJWTLandlord, getLandlordById)

export default router