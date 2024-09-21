import jwt from 'jsonwebtoken';
import { Landlord } from '../Models/LandlordModel.js';
import { Tenant } from '../Models/TenantModel.js';

export const verifyJWTUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        let user;
        // Attempt to find the user as a landlord first
        user = await Landlord.findById(decodedToken.id).select('-password');
        if (!user) {
            // If not found, try to find as a tenant
            user = await Tenant.findById(decodedToken.id).select('-password');
        }

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid token provided' });
        }

        // Assign the user based on their type
        req.user = user; // This can be landlord or tenant based on the lookup
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' });
        }
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

