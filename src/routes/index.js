const express = require('express')
const route = express.Router()

route.use('/category', require('./category.route'))
route.use('/product', require('./product.route'))
route.use('/customer', require('./customer.route'))
route.use('/order', require('./order.route'))

module.exports = route