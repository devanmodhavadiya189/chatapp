import mongoose from "mongoose";

const connectdb = async ()=>{
    try
    {
        const connection = await mongoose.connect(process.env.mongouri);
        console.log("MongoDB Connected Successfully ",connection.connection.host);

        const db = mongoose.connection.db;
        await db.collection("vanarSena").insertOne({ name: "Sugreev", armySize: "huge" });

    }
    catch(error)
    {
        console.log("Error while connecting to mongoDB" , error);
    }
}

export default{connectdb}