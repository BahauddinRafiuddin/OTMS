import { uploadOnCloudinary } from "../Db/Cloudinary.js"
import { Property } from "../Models/Properties.Model.js"

// Add Property...
const addProperty = async (req, res) => {
    try {

        const { title, description, adderess, propertyType, numberOfBadrooms, numberOfBathrooms, amenities, status, price } = req.body
        const landlord = req.landlord._id

        if (!landlord) {
            return res.json({ success: false, message: "Unauthorized Request" })
        }
        // taking images From req.Files.Name[0].............
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        const image5 = req.files.image5 && req.files.image5[0]

        // Storing All Image That In Images Arrays That Does Not Undefine...........
        const images = [image1, image2, image3, image4, image5].filter((item) => item !== undefined)

        if (images.length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required." });
        }
        // console.log(images)


        // Now Mapping Images Array And Upload Images On Cloudinary And Storing URL.....
        let imageUrl = await Promise.all(
            images.map(async (item) => {
                let result = await uploadOnCloudinary(item.path)
                return result.url
            })
        )

        // console.log(imageUrl)

        const propery = await Property.create({
            title,
            description,
            adderess,
            propertyType,
            numberOfBadrooms,
            numberOfBathrooms,
            amenities,
            status,
            price,
            landlord: landlord,
            images: imageUrl
        })
        return res.status(201).json({ success: true, message: "Property Added Successfully", propery })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: "Error While Adding Property" })
    }
}

// Get All Property:..
const getAllProperty = async (req, res) => {
    try {
        const property = await Property.find()
        if (!property) {
            return res.json({ success: false, message: "Property Not Found!!" })
        }

        res.status(200)
            .json({ success: true, message: "Property Found Successfully!!", property })

    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}

// Get Best Resently Added Properties..
const getResentlyAddProperty = async (req, res) => {
    try {
        const resentlyAddedPropeties = await Property.find({ status: 'Available' })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('landlord')
            .exec()

        res.status(200)
            .json({ success: true, message: "Property Found Successfully!!", resentlyAddedPropeties })
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}

// Get Property By PropertyId:...
const getPropertyById = async (req, res) => {
    try {
        const { propertyId } = req.params
        const property = await Property.findById(propertyId).populate('landlord')

        if (!property) {
            return res.json({ success: false, message: "Property Not Found!" })
        }

        // Extract important landlord details
        const landlordDetails = {
            id: property.landlord._id,
            firstName: property.landlord.firstName, // Adjust this according to your Landlord schema
            lastName: property.landlord.lastName, // Adjust as needed
            contact: property.landlord.phoneNumber,
            email:property.landlord.email,
            avatar:property.landlord.avatar
            // Add other important fields as necessary
        };

        // Create a response object with only necessary property details
        const responseData = {
            success: true,
            message: "Property Found Successfully!!",
            property: {
                _id: property._id,
                title: property.title,
                description: property.description,
                address: property.adderess,
                propertyType: property.propertyType,
                numberOfBedrooms: property.numberOfBadrooms,
                numberOfBathrooms: property.numberOfBathrooms,
                amenities: property.amenities,
                status: property.status,
                price: property.price,
                images: property.images,
            },
            landlord: landlordDetails
        };

        res.status(200)
            .json({ responseData })
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: "Error While Getting Property" })
    }
}

// Get Property By LandlordID:.....
const getPropertyByLandlordId = async (req, res) => {
    try {
        const properties = await Property.find({ landlord: req.params.landlordId })
            .populate({
                path: "landlord",
                select: "firstName lastName"
            })

        res.json({ success: true, properties });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error retrieving properties" });
    }
}

// Get Property By Tenant Id....
const getPropertyByTenantId = async (req, res) => {
    try {
        const properties = await Property.find({ tenant: req.params.tenantId })
            .populate({
                path: "tenant",
                select: "firstName lastName"
            })

        if (!properties) {
            return res.status(404)
                .json({ success: false, message: "No Properties Found!!" })
        }

        res.json({ success: true, properties });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error retrieving properties" });
    }
}

// Delete Property By PropertyId:...
const deleteProperty = async (req, res) => {
    try {
        const { propertyId } = req.params
        const property = await Property.findByIdAndDelete(propertyId)

        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        res.json({ success: true, message: "Property deleted successfully" });
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "Error While Deleting Property" })
    }
}

// Chnage Property Status.....
const changePropertyStatus = async (req, res) => {
    const { propertyId } = req.params
    const status = req.body

    try {
        const property = await Property.findByIdAndUpdate(propertyId, status, { new: true })
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        res.json({ success: true, message: "Property Status Updated successfully", property });
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "Error While Deleting Property" })
    }
}

// Edit Property Details...
const editPropertyDetails = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { title, description, adderess, propertyType, numberOfBadrooms, numberOfBathrooms, amenities, status, price } = req.body;
        const landlordId = req.landlord._id;
        // console.log(landlordId)
        // Check if the property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found." });
        }

        // Ensure the landlord owns the property
        // console.log(property.landlord)
        if (property.landlord.toString() !== landlordId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized request." });
        }

        // Handle image uploads if new images are provided
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        const image5 = req.files.image5 && req.files.image5[0]

        let imageUrl = [...property.images]; // Keep the existing images by default
        const newImages = [image1, image2, image3, image4, image5].filter(item => item !== undefined);

        if (newImages.length > 0) {
            const uploadedImages = await Promise.all(
                newImages.map(async (item) => {
                    const result = await uploadOnCloudinary(item.path);
                    return result.url;
                })
            );

            // Concatenate new images with existing ones
            imageUrl = [...imageUrl, ...uploadedImages];
        }

        // Update property details
        const updatedProperty = await Property.findByIdAndUpdate(
            propertyId,
            {
                title,
                description,
                adderess,
                propertyType,
                numberOfBadrooms,
                numberOfBathrooms,
                amenities,
                status,
                price,
                images: imageUrl // Update images, keeping existing ones if necessary
            },
            { new: true }
        );

        return res.status(200).json({ success: true, message: "Property updated successfully", updatedProperty });
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}
export {
    addProperty,
    getAllProperty,
    getResentlyAddProperty,
    getPropertyById,
    getPropertyByLandlordId,
    getPropertyByTenantId,
    deleteProperty,
    changePropertyStatus,
    editPropertyDetails
}