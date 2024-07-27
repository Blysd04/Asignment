const Category = require('../models/category.model');

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const errors = []
    if (name.length < 2 || name.length > 20) {
      errors.push("Name has to contain 2 to 20 letters!")
    }
    if (description.length < 2 || description.length > 50) {
      errors.push("Description has to contain 2 to 50 letters!")
    }
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const categoryFind = await Category.findById(req.params.id)
    if (!categoryFind) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const errors = []
    if (req.body.hasOwnProperty("name")) {
      if (name.length < 2 || name.length > 20) {
        errors.push("Name has to contain 2 to 20 letters!")
      }
    }
    if (req.body.hasOwnProperty("description")) {
      if (description.length < 2 || description.length > 50) {
        errors.push("Description has to contain 2 to 50 letters!")
      }
    }

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }
    const category = await Category.findByIdAndUpdate(req.params.id, { name, description }, { new: true });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};