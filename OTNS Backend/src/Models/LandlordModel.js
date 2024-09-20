import mongoose, { Schema } from "mongoose";

const landlordSchema = new Schema(
    {
        firstName: {
            type: String,
            require: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        lastName: {
            type: String,
            require: true,
            trim: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            require: [true, 'Password Is Reuired']
        },
        avatar: {
            type: String, // cloudinary Url
            required: true
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
            match: /^[+]?[0-9]{10,15}$/ // Optional: Basic validation for phone numbers
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'], // Adjust as needed
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        panCardNumber: {
            type: String,
            required: true,
            trim: true,
            match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,'Invalid Pancard Number'] // Optional: Basic validation for PAN card numbers
        }
    }, { timestamps: true })


export const Landlord = mongoose.model("Landlord", landlordSchema)