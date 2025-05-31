import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: "./config/config.env" });
const mongourl = process.env.MONGODB_URL;
// const mongourl = "mongodb://localhost:27017/portfolio";



mongoose.connect(mongourl, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
  }).then(() => {
    console.log("Connected to MongoDB successfully");
  }).catch(err => {
    console.error("Failetd to connect to MongoDB", err);  // Clearer error message
  });
  const db = mongoose.connection;


  db.on('error', (err) => {
    console.error("MongoDB error:", err);  // Improve the error message
  });
  
  db.on('disconnected', () => {
    console.log("MongoDB disconnected");
  });
  
export default db;  