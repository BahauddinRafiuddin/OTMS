import { uploadOnCloudinary } from '../Db/Cloudinary.js'
import { Landlord } from '../Models/LandlordModel.js'
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

// Register Landlord
const registerLandlord = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, gender, dateOfBirth, panCardNumber } = req.body
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

        const existLandlord = await Landlord.findOne({ email })
        if (existLandlord) {
            return res.status(400).json(
                { success: false, message: "Landlord Already Exists!!" }
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
        const newLandlord = await Landlord.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            phoneNumber,
            gender,
            dateOfBirth,
            panCardNumber,
            avatar: avatar?.url
        })

        if (!newLandlord) {
            return res.status(500).json(
                { success: false, message: "Error While Creating Landlord!!" }
            )
        }

        const token = createToken(newLandlord._id)

        // Respond with success message
        return res.status(201).json({
            success: true,
            message: "Landlord registered successfully!",
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json(
            { success: false, message: error.message }
        )
    }
}

// Landlord Login
const landlordLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        const existUser = await Landlord.findOne({ email })

        if (!existUser) {
            return res.status(404).json(
                { success: false, message: "Landlord Does Not Exists" }
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
            res.json({ success: true, message: "Landlord LogedIn Succesfully", token, landlord: existUser })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json(
            { success: false, message: error.message }
        )
    }


}

// get Landlord By Landlord Id
const getLandlordById = async (req, res) => {
    try {
        const { landlordId } = req.params
        const landlord = await Landlord.findById(landlordId).select("-password")

        if (!landlord) {
            return res.json({ success: false, message: "Landlord Not Found" })
        }
        // console.log(landlord)
        res.json({ success: true, message: "Landlord Details ", landlord })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Get All Landlords..
const getAllLandlords = async (req, res) => {
    try {
        const landlords = await Landlord.find()
        if (!landlords) {
            return res.json({ success: false, message: "Landlords Not Found!!" })
        }

        res.status(200)
            .json({ success: true, message: "Landlord Found Successfully!!", landlords })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Update Landlord Details...
const updateLandlordProfile = async (req, res) => {
    try {
        const { landlordId } = req.params
        const update = req.body

        if (req.file) {
            const avatarLocalPath = req.file.path
            const avatar = await uploadOnCloudinary(avatarLocalPath)
            update.avatar = avatar.url
        }

        const updatedLandlord = await Landlord.findByIdAndUpdate(landlordId, update, { new: true }).select("-password")
        if (!updatedLandlord) {
            return res.status(404)
                .json({ success: false, message: "Landlord Doses Not Exist!!" })
        }

        res.json({ success: true, message: "Landlord Details Updated Successfully", landlord: updatedLandlord })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Delete Landlord.....
const deleteLandlord = async (req, res) => {
    try {
        const { landlordId } = req.params

        const deletedLandlord = await Landlord.findByIdAndDelete(landlordId)
        if (!deletedLandlord) {
            return res.status(404)
                .json({ success: false, message: "landlord Doses Not Exist!!" })
        }

        res.json({ success: true, message: "Landlord Deleted Successfully", landlord: deletedLandlord })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Chnage Landlord Change Password..
const landlordChangePassword = async (req, res) => {
    const landlordId = req.landlord._id
    const { oldPassword, newPassword } = req.body

    try {
        const landlord = await Landlord.findById(landlordId)
        if (!landlord) {
            return res.status(404).json({ success: false, message: "Landlord not found." });
        }

        const validPassword = await bcrypt.compare(oldPassword, landlord.password)
        if (!validPassword) {
            return res.status(400).json({ success: false, message: "Invalid Creadentials!!" })
        }

        const hashPassword = await bcrypt.hash(newPassword, 10)
        landlord.password = hashPassword
        await landlord.save()

        return res.status(200).json({ success: true, message: "Password updated successfully!" });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: error.message })
    }

}
export {
    registerLandlord,
    landlordLogin,
    getLandlordById,
    getAllLandlords,
    updateLandlordProfile,
    deleteLandlord,
    landlordChangePassword
}