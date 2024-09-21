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
            res.json({ success: true, message: "Tenant LogedIn Succesfully", token, tenant: existUser })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json(
            { success: false, message: error.message }
        )
    }
}

// Get All Tenants........
const getAllTenant = async (req, res) => {
    try {
        const allTenants = await Tenant.find().select("-password")

        if (!allTenants) {
            return res.json({ success: false, message: "tenant Not Found" })
        }
        // console.log(tenant)
        res.json({ success: true, message: "All Tenants Details ", allTenants })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Get Tenant By ID.....
const getTenantById = async (req, res) => {
    try {
        const { tenantId } = req.params

        const tenant = await Tenant.findById(tenantId).select("-password")
        if (!tenant) {
            return res.json({ success: false, message: "Tenant Not Found" })
        }

        res.json({ success: true, message: "Tenant Details ", tenant })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Update Tenant Profile......
const updateTenantProfile = async (req, res) => {
    try {
        const { tenantId } = req.params
        const update = req.body

        if (req.file) {
            const avatarLocalPath = req.file.path
            const avatar = await uploadOnCloudinary(avatarLocalPath)
            update.avatar = avatar.url
        }

        const updatedTenant = await Tenant.findByIdAndUpdate(tenantId, req.body, { new: true })
        if (!updatedTenant) {
            return res.status(404)
                .json({ success: false, message: "Tenant Doses Not Exist!!" })
        }

        res.json({ success: true, message: "Tenant Details Updated Successfully", tenant: updatedTenant })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Delete Tenant...
const deleteTenant = async (req, result) => {
    try {
        const { tenantId } = req.params

        const deletedTenant = await Tenant.findByIdAndDelete(tenantId)
        if (!deletedTenant) {
            return res.status(404)
                .json({ success: false, message: "Tenant Doses Not Exist!!" })
        }

        res.json({ success: true, message: "Tenant Deleted Successfully", tenant: deletedTenant })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Chnage Tenant Change Password..
const tenantChangePassword = async (req, res) => {
    const tenantId = req.tenant._id
    const { oldPassword, newPassword } = req.body

    try {
        const tenant = await Tenant.findById(tenantId)
        if (!tenant) {
            return res.status(404).json({ success: false, message: "Tenant not found." });
        }

        const validPassword = await bcrypt.compare(oldPassword, tenant.password)
        if (!validPassword) {
            return res.status(400).json({ success: false, message: "Invalid Creadentials!!" })
        }

        const hashPassword = await bcrypt.hash(newPassword, 10)
        tenant.password = hashPassword
        await tenant.save()

        return res.status(200).json({ success: true, message: "Password updated successfully!" });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: error.message })
    }

}
export {
    tenantRegister,
    loginTenant,
    getAllTenant,
    getTenantById,
    updateTenantProfile,
    deleteTenant,
    tenantChangePassword
}