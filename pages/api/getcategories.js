import connectDb from '../../middlewares/mongoose';
import category from '../../model/category';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    console.log('GET')
    let categories = await category.find().populate('products');
    console.log('categories: ', categories)
    res.status(200).json(categories);
  } else {
    res.status(404).json({ success: 'error' });
  }
};

export default connectDb(handler);
