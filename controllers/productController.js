const Product = require("../models/Product");

const { uploadFileToS3 } = require("../services/mockS3Uploader");
// controllers/cartController.js
const Cart = require("../models/Cart");

const isJSONString = (value) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return Array.isArray(value) ? value : [];
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, ingredients, benefits } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadFileToS3(req.file, "product-images");
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = new Product({
      name,
      description,
      price,

      stock,
      imageUrl,
      status:
        stock === 0 ? "Out of Stock" : stock < 10 ? "Low Stock" : "In Stock",
      ingredients: isJSONString(ingredients),
      benefits: isJSONString(benefits),
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    console.error("Error uploading product:", err);
    res.status(500).json({ message: "Product upload failed", error: err });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // newest first
    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({
        message: "Product deleted successfully",
        product: deletedProduct,
      });
  } catch (err) {
    console.error("Error deleting product:", err);
    res
      .status(500)
      .json({ message: "Failed to delete product", error: err.message });
  }
};
