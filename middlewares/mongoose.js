import mongoose from "mongoose"

const connectDb = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    return handler(req, res)
  }
  await mongoose.set('strictQuery', false)
  mongoose.connect('mongodb+srv://admin:admin@cluster0.jrjaw5z.mongodb.net/test', () => {
    console.log('Connected to MongoDB', process.env.MONGO_URL)
  })
  return handler(req, res)
}

export default connectDb
