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
        return res.json({ success: false, message: "Error While Geting Property" })
    }
}

// Get Property By PropertyId:...
const getPropertyById = async (req, res) => {
    try {
        const { propertyId } = req.params
        const property = await Property.findById(propertyId)

        if (!property) {
            return res.json({ success: false, message: "Property Not Found!" })
        }

        res.status(200)
            .json({ success: true, message: "Property Found Successfully!!", property })
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

// Update Property By PropertyId:...
const updateProperty = async (req, res) => {
    try {
        const { propertyId } = req.params
        const property = await Property.findByIdAndUpdate(propertyId, req.body, { new: true })

        if (!property) {
            return res.json({ success: false, message: "Property Not Found!" })
        }

        res.status(200)
            .json({ success: true, message: "Property Updated Successfully!!", property })
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: "Error While Updating Property" })
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
        console.log(error.message)
        return res.json({ success: false, message: "Error While Deleting Property" })
    }
}
export {
    addProperty,
    getAllProperty,
    getPropertyById,
    getPropertyByLandlordId,
    updateProperty,
    deleteProperty
}