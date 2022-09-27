import mongoose from "mongoose";
mongoose.set("runValidators", true);
const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDB;
