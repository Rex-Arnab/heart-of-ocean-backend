const express = require("express");
const app = express.Router();
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

app.get("/", productController.fetchAllProducts);
app.get("/:id", productController.fetchProductById);
app.post(
  "/",
  authController.verifyToken,
  authController.verifyAdmin,
  productController.addNewProduct
);
app.delete(
  "/:id",
  authController.verifyToken,
  authController.verifyAdmin,
  productController.deleteProductById
);

module.exports = app;
