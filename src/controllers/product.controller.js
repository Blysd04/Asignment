const Product = require('../models/product.model');
const Category = require("../models/category.model")
const mongoose = require('mongoose')


exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, images, sizes, colors, stock } = req.body;
    const category = await Category.findById(category_id)
    if (stock <= 0) {
      return res.status(404).send({
        mess: "Stock has to be at least 1",
      });
    }
    if (!category) {
      return res.status(404).send({
        code: 1,
        mess: "Category not found",
      });
    }
    const newProduct = new Product({ name, description, price, category_id, images, sizes, colors, stock });
    await newProduct.save();
    res.status(201).json({
      code: 0,
      data: newProduct,
      mess: "Product created!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const products = await Product.find().populate("category_id", "name");
    res.status(200).send({
      code: 0,
      mess: "Get all products successfully!",
      total: totalProducts,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const skip = page * limit;

    const totalProducts = await Product.countDocuments();

    const products = await Product.find()
      .populate({
        path: "category_id",
        select: "name",
      })
      .skip(skip)
      .limit(limit);

    res.status(200).send({
      code: 0,
      total: totalProducts,
      data: products,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
      },
      mess: "Get successfully!",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error.message });
  }
}

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category_id", "name");
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).send({
      code: 0,
      data: product,
      mess: "Get successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updateData = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).send({
      code: 0,
      data: product,
      mess: "Update successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const skip = page * limit;

    const totalProducts = await Product.countDocuments(
      { name: { $regex: searchTerm, $options: "i" } }
    );

    const products = await Product.find(
      { name: { $regex: searchTerm, $options: "i" } })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "category_id",
        select: "name",
      });

    res.status(200).send({
      code: 0,
      total: totalProducts,
      data: products,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
      },
      mess: "Products found",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error.message });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      category_id,
      sortByDate,
      page = 0,
      limit = 10,
    } = req.query;
    let query = {};
    if (!await Product.find(query)) {
      return
    }
    if (minPrice) {
      const minPriceValue = parseFloat(minPrice);
      if (isNaN(minPriceValue) || minPriceValue < 0) {
        return res.status(400).send({
          code: 1,
          mess: "Minimum is a positive number",
        });
      }
      query.price = { ...query.price, $gte: minPriceValue };
    }

    if (maxPrice) {
      const maxPriceValue = parseFloat(maxPrice);
      if (isNaN(maxPriceValue) || maxPriceValue < 0) {
        return res.status(400).send({
          code: 1,
          mess: "Maximum is a positive number",
        });
      }
      query.price = { ...query.price, $lte: maxPriceValue };
    }

    if (category_id) {
      if (mongoose.Types.ObjectId.isValid(category_id)) {
        query.category_id = new mongoose.Types.ObjectId(category_id);
      } else {
        return res.status(400).send({
          code: 1,
          mess: "ID category is invalid",
        });
      }

      if (!await Category.findById(query.category_id)) {
        return res.status(400).send({
          code: 1,
          mess: "ID category not found",
        });
      }
    }

    const skip = page * limit;
    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate({
        path: "category_id",
        select: "name",
      })
      .sort(sortByDate === "newest" ? { createdAt: -1 } : { createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).send({
      code: 0,
      data: products,
      total: totalProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalProducts / limit),
      },
      mess: "Filtering successfully!",
    });
  } catch (error) {
    console.error("Error in filterProducts:", error);
    res.status(400).send({ code: 1, mess: error.message });
  }
};
