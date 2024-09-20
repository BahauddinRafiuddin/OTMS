import { Router } from "express";
import { getTenant, loginTenant, tenantRegister } from "../Controller/tenant.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { verifyJWTTenant } from "../Middlewares/tenant.auth.middleware.js";
const router = Router()

router.route('/register').post(
    upload.single("avatar"),
    tenantRegister
)

router.route('/login').post(loginTenant)
router.route('/').get(verifyJWTTenant,getTenant)
export default router