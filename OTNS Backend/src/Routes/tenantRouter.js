import { Router } from "express";
import { deleteTenant, getAllTenant, getTenantById, loginTenant, tenantChangePassword, tenantRegister, updateTenantProfile } from "../Controller/tenant.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { verifyJWTTenant } from "../Middlewares/tenant.auth.middleware.js";
const router = Router()

router.route('/register').post(
    upload.single("avatar"),
    tenantRegister
)

router.route('/login').post(loginTenant)
router.route('/').get(getAllTenant) //Here You Can Add Admind Authantication Midddleware..
router.route('/:tenantId')
    .get(verifyJWTTenant, getTenantById)
    .put(verifyJWTTenant, upload.single("avatar"), updateTenantProfile)
    .delete(verifyJWTTenant, deleteTenant)

router.route('/change-password').post(verifyJWTTenant,tenantChangePassword)
export default router