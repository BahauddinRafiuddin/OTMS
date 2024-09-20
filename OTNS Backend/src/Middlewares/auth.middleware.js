import jwt from 'jsonwebtoken'
import { Landlord } from '../Models/LandlordModel.js';

export const verifyJWTLandlord = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (token == null) {
            return res.status(401).json(
                { success: false, message: 'No token provided' }
            );
        }

        const decodedToken=jwt.verify(token,process.env.JWT_SECRET)

        const landlord=await Landlord.findById(decodedToken.id).select(
            "-password"
        )

        if(!landlord){
            return res.status(400).json(
                { success: false, message: 'Invalid token provided' }
            );
        }

         // Setting Additional Req User Asign it With user...
         req.landlord = landlord
         // It s Middleware WE Need To call Next()
         next()

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}