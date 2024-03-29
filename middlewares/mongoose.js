import mongoose from "mongoose"

const connectDb = (handler) => async (req, res) => {
    console.log('Connecting', req)

  if (mongoose.connections[0].readyState) {
    console.log("Connected")
    return handler(req, res)
  }
  console.log("Connecting", mongoose.connections[0].readyState)
  await mongoose.set('strictQuery', true)
  await mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.jrjaw5z.mongodb.net/test',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    }
  )

  mongoose.connection.once('connected', () => {
    console.log('Connected to MongoDB', process.env.MONGO_URL)
  })
  console.log('Connected to MongoDB and returning handler')
  return handler(req, res)
}

export default connectDb
