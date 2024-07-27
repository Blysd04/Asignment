const mongoose = require('mongoose');
const Product = require('./src/models/product.model'); // Đường dẫn tới model Product
const Customer = require('./src/models/customer.model'); // Đường dẫn tới model Category
const Order = require('./src/models/order.model'); // Đường dẫn tới model Category

const MONGO_URI = 'mongodb+srv://ngavdt125010122005:61G9ROaAki05zCKD@social-media.xt9f7s3.mongodb.net/assignment?retryWrites=true&w=majority&appName=social-media'; // Thay đổi với URI cơ sở dữ liệu của bạn

// Kết nối với cơ sở dữ liệu
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    const customers = await Customer.find();
    const products = await Product.find();

    if (customers.length === 0 || products.length === 0) {
      console.error('No customers or products found in the database');
      return mongoose.disconnect();
    }

    // Tạo 50 đơn đặt hàng mẫu
    const orders = [];
    for (let i = 1; i <= 50; i++) {
      // Chọn ngẫu nhiên khách hàng và sản phẩm
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)];

      // Tạo đơn đặt hàng
      orders.push({
        customer_id: randomCustomer._id,
        products: [
          {
            product_id: randomProduct._id,
            quantity: Math.floor(Math.random() * 10) + 1, // Số lượng từ 1 đến 10
            price: randomProduct.price
          }
        ],
        total_price: randomProduct.price * (Math.floor(Math.random() * 10) + 1),
        status: Math.floor(Math.random() * 3), // Trạng thái từ 0 đến 2
        shippingAddress: `Address ${i}`
      });
    }

    try {
      await Order.insertMany(orders);
      console.log('50 orders have been added to the database');
    } catch (error) {
      console.error('Error adding orders:', error.message);
    }

    // Ngắt kết nối
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
    mongoose.disconnect();
  });