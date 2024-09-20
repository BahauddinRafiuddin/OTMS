import { Router } from 'express'
import { upload } from '../Middlewares/multer.middleware.js'
import { verifyJWTLandlord } from '../Middlewares/auth.middleware.js'
import {
    addProperty,
    deleteProperty,
    getAllProperty,
    getPropertyById,
    getPropertyByLandlordId,
    updateProperty
} from '../Controller/property.controller.js'



const router = new Router()


router.route('/').get(getAllProperty)

router.route('/add').post(verifyJWTLandlord,
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
        { name: 'image5', maxCount: 1 }
    ]),
    addProperty)

router.route('/:propertyId').get(verifyJWTLandlord, getPropertyById)
    .put(verifyJWTLandlord, updateProperty)
    .delete(verifyJWTLandlord, deleteProperty)

router.route('/landlord/:landlordId').get(verifyJWTLandlord, getPropertyByLandlordId)

export default router