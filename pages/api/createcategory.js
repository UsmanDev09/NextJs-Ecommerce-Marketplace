import connectDb from "../../middlewares/mongoose"
import Category from "../../model/category"

const handler = async (req, res) => {
  if (req.method === "POST") {
    console.log(req.body.name)
    let category = new Category(req.body)
    category.save()
    res.status(200).json({ category: category })
  } else {
    res.status(404).json({ success: "error" })
  }
}

export default connectDb(handler)
