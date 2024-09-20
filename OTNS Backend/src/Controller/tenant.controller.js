import { Tenant } from "../Models/TenantModel.js"
import { uploadOnCloudinary } from '../Db/Cloudinary.js'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import moment from 'moment'

const createToken = (id) => {
    try {
        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5h' }); // Adjust expiration as needed
    } catch (error) {
        console.error('Error creating token:', error);
        throw new Error('Token creation failed');
    }
};

// Register Tenant....
const tenantRegister = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, gender, dateOfBirth } = req.body
        const avatarLocalPath = req.file?.path

        if (!avatarLocalPath) {
            return res.status(400).json({ success: false, message: "Avatar Is Reuired!!" })
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        if (!avatar.url) {
            return res.status(500).json(
                { success: false, message: "Error While Uploading Avatar On Cloudinary!!" }
            )
        }

        const existTenant = await Tenant.findOne({ email })

        if (existTenant) {
            return res.status(400).json(
                { success: false, message: "Tenant Already Exists!!" }
            )
        }

        // Validate Email  Fromate Strone Password!!

        if (!validator.isEmail(email)) {
            return res.json(
                { success: false, message: "Inavalid Email!!" }
            )
        }

        // Validate password strength
        if (password.length < 8) {
            return res.json(
                { success: false, message: "Please Enter Strong Password!!" }
            )
        }

        // Calculate age and check if it is at least 18
        const birthDate = moment(dateOfBirth);
        const age = moment().diff(birthDate, 'years');
        if (age < 18) {
            return res.status(400).json({ success: false, message: "Landlord must be at least 18 years old!" });
        }

        // Hasing User Password!!
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        // creating landlord...
        const newTenant = await Tenant.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            phoneNumber,
            gender,
            dateOfBirth,
            avatar: avatar?.url
        })

        if (!newTenant) {
            return res.status(500).json(
                { success: false, message: "Error While Creating Tenant!!" }
            )
        }

        const token = createToken(newTenant._id)

        // Respond with success message
        return res.status(201).json({
            success: true,
            message: "Tenant registered successfully!",
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json(
            { success: false, message: error.message }
        )
    }
}

// Login Tenant..........
const loginTenant = async (req, res) => {
    try {
        const { email, password } = req.body

        const existUser = await Tenant.findOne({ email })

        if (!existUser) {
            return res.status(404).json(
                { success: false, message: "Tenant Does Not Exists" }
            )
        }

        // Checing Password Correct Or Not
        const validPassword = await bcrypt.compare(password, existUser.password)
        if (!validPassword) {
            return res.status(400).json(
                { success: false, message: "Invalid Creadentials!!" }
            )
        } else {
            const token = createToken(existUser._id)
            res.json({ success: true, message: "Tenant LogedIn Succesfully", token })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json(
            { success: false, message: error.message }
        )
    }
}

// Get Tenant By TenantId........
const getTenant=async (req,res) => {
    try {
        const tenant = req.tenant
        if (!tenant) {
            return res.json({ success: false, message: "tenant Not Found" })
        }
        // console.log(tenant)
        res.json({ success: true, message: "tenant Details ", tenant })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: "Error While Geting tenant!!" })
    }
}
export {
    tenantRegister,
    loginTenant,
    getTenant
}