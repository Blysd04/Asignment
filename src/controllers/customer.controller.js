const Customer = require('../models/customer.model');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


exports.signIn = async (req, res) => {
  try {
    const { name, email, password, address, phone, role } = req.body;
    let customer = await Customer.findOne({ email: email });
    const error = []

    if (customer) {
      error.push("User's email has already taken!")
    }
    if (password.length < 6 || password.length > 50) {
      error.push("Password has to contain 6 to 50 leters.")
    }
    if (error.length > 0) {
      return res.status(400).json(error);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newCustomer = new Customer({ name, email, password: hashedPassword, address, phone, role });
    await newCustomer.save();
    res.status(201).send({ code: 0, data: newCustomer, mess: "New customer created!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validUser = await Customer.findOne({ email });
    if (!validUser)
      return res.status(400).send({ code: 1, mess: "Wrong email!" });

    const validPassword = bcrypt.compareSync(password, validUser.password);

    if (!validPassword)
      return res.status(400).send({ code: 1, mess: "Wrong password!" });

    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ ...rest, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const updatedFields = { name, email, address, phone };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }
    const customer = await Customer.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found!' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found!' });
    }
    res.status(200).json({ message: 'Customer deleted!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
