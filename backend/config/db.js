import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected succesfully");
  } catch (err) {
    console.err("Mongodb connection failed.", err);
    process.exit(1);
  }
};

export default connectDB;
