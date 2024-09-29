import mongoose,{Schema} from "mongoose";

const propertiesSchema=new Schema(
    {
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true,
            trim:true
        },
        landlord:{
            type:Schema.Types.ObjectId,
            ref:'Landlord',
            required:true
        },
        tenant:{
            type:Schema.Types.ObjectId,
            ref:'Tenant',
            default:null
        },
        adderess:{
            type:String,
            reuired:true
        },
        propertyType:{
            type:String,
            enum:['Apartment','House','Villa','Commercial'],
            required:true
        },
        numberOfBadrooms:{
            type:Number,
            required:true
        },
        numberOfBathrooms:{
            type:Number,
            reuired:true
        },
        amenities:{
            type:[String],
            required:true
        },
        status:{
            type:String,
            enum:['Available','Sold','Rented'],
            default:'Available'
        },
        price:{
            type:Number,
            reuired:true,
            min:0
        },
        images:{
            type:[String],
            required:true
        }
    },
    {timestamps:true}
)

export const Property=mongoose.model("Property",propertiesSchema)