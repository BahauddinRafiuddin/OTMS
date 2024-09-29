import { Router } from 'express'
import { upload } from '../Middlewares/multer.middleware.js'
import { verifyJWTLandlord } from '../Middlewares/auth.middleware.js'
// Following Middleware Is Created For Such Routes That Can Be Access By Both Landlord And Tenant....
import { verifyJWTUser } from '../Middlewares/shared.auth.middleware.js'
import {
    addProperty,
    changePropertyStatus,
    deleteProperty,
    editPropertyDetails,
    getAllProperty,
    getPropertyById,
    getPropertyByLandlordId,
    getPropertyByTenantId,
    getResentlyAddProperty,
} from '../Controller/property.controller.js'
import { verifyJWTTenant } from '../Middlewares/tenant.auth.middleware.js'



const router = new Router()


router.route('/').get(getAllProperty)
router.route('/best-properties').get(getResentlyAddProperty)

router.route('/add').post(verifyJWTLandlord,
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
        { name: 'image5', maxCount: 1 }
    ]),
    addProperty)

router.route('/:propertyId').get(getPropertyById)
    .put(verifyJWTLandlord,
        upload.fields([
            { name: 'image1', maxCount: 1 },
            { name: 'image2', maxCount: 1 },
            { name: 'image3', maxCount: 1 },
            { name: 'image4', maxCount: 1 },
            { name: 'image5', maxCount: 1 }
        ]), editPropertyDetails)
    .delete(verifyJWTLandlord, deleteProperty)

router.route('/landlord/:landlordId').get(verifyJWTLandlord, getPropertyByLandlordId)
router.route('/tenant/:tenantId').get(verifyJWTTenant, getPropertyByTenantId)
router.route('/change-status/:propertyId').put(verifyJWTUser, changePropertyStatus)



export default router
