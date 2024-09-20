import mongoose from 'mongoose';

const connectDb = async (params) => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}/OTMS`)
        console.log(`\n Mongo DB Connected Successfully - DB HOST: ${connection.connection.host}`)
    } catch (error) {
        console.log("Mongo Db Connetion Failed!!!!", error)
        process.exit(1)
    }

}

export default connectDb;