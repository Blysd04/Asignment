const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

exports.createOrder = async (req, res) => {
  try {
    const { customer_id } = req.params
    const { products, shippingAddress } = req.body;
    let total_price = 0;

    const customer = await Customer.findById(customer_id)
    console.log(products);
    if (!customer) {
      res.status(404).json("Customer not found!");
    }
    const product_id = await Product.findById(products[0].product_id)
    if (!product_id) {
      res.status(404).json("Product not found!");
    }

    const productDetails = await Promise.all(products.map(async (item) => {
      const product = await Product.findById(item.product_id);
      if (!product) {
        throw new Error(`Product with id ${item.product_id} not found!`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Only ${product.stock} in stock. Don't have enough goods!`)
      } else {
        await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } },
          { new: true })
      }
      total_price += product.price * item.quantity;
      return {
        product_id: product._id,
        quantity: item.quantity,
        price: product.price // Lấy giá từ model Product
      };
    }));
    const newOrder = new Order({ customer_id, products: productDetails, total_price, shippingAddress });
    await newOrder.save();
    res.status(201).json("New order created!");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product_id', 'name');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product_id', 'name');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatusOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status: status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
