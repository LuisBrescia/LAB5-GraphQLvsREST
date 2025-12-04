import mongoose from "mongoose";

export async function connectMongo() {
  await mongoose.connect("mongodb://localhost:27017/experimentdb");

  const UserSchema = new mongoose.Schema({
    name: String,
    age: Number,
  });

  return mongoose.model("User", UserSchema, "users"); // usa collection 'users'
}
