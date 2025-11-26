import mongoose from "mongoose"


export const  ConnectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}