const Budget = require("../models/Budget");
const Product = require("../models/Product");

const addNewProduct = async (req, res) => {
  const { name, price, description, image, days } = req.body;
  const product = new Product({
    name,
    price,
    description,
    image,
    days,
  });
  return product.save((err) => {
    if (err) {
      res.json({ msg: err.message });
    } else {
      res.json({ msg: "Tour added", product });
    }
  });
};

const removeProduct = async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.send("Tour deleted");
};

const modifyProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image, days } = req.body;
  await Product.findByIdAndUpdate(id, {
    name,
    price,
    description,
    image,
    days,
  });
  res.send("Tour modified");
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({}, { _id: 1, __v: 0 });
  res.json(products);
};

const getProductById = async (id) => {
  return Product.findById(id, { _id: 1, __v: 0 });
};

module.exports = {
  addNewProduct,
  removeProduct,
  modifyProduct,
  getAllProducts,
  getProductById,
};
