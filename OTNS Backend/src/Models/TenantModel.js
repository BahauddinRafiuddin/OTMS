import mongoose, { Schema } from "mongoose";


const tenantSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        lastName: {
            type: String,
            required: true,
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
            required: [true, 'Password Is Reuired']
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
        rentalHistory: [
            {
                propertyId: {
                    type: Schema.Types.ObjectId,
                    ref: "Property", // Reference to Property model
                },
                startDate: {
                    type: Date,
                    required: true,
                },
                endDate: {
                    type: Date,
                },
            },
        ]
    },
    { timestamps: true }
)

export const Tenant = mongoose.model("Tenant", tenantSchema)