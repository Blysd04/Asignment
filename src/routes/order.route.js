const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateStatusOrder, deleteOrder } = require('../controllers/order.controller');
const verifyUser = require('../middleware/verify')
const authUser = require('../middleware/auth')
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: objectid
 *         customer_id:
 *           type: string
 *           format: objectid
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product_id: 
 *                 type: string
 *                 format: objectid
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: integer
 *         total_price:
 *           type: integer
 *         status:
 *           type: integer
 *         created_at:
 *           type: string
 *         shippingAddress:
 *           type: string
 *       required:
 *         - customer_id
 *         - products
 *         - total_price
 *         - status
 *         - shippingAddress
 */

/**
 * @swagger
 * /order/v1/create/{customer_id}:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: The customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id: 
 *                       type: string
 *                       format: objectid
 *                     quantity:
 *                       type: integer
 *               shippingAddress:
 *                 type: string
 *     responses:
 *       201:
 *         description: New order created!
 *       404:
 *         description: Customer or Product not found
 */
// Create a new order
router.post('/v1/create/:customer_id', verifyUser, authUser(1), createOrder);

/**
 * @swagger
 * /order/v1:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: A list of orders!
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
// Get all orders
router.get('/v1', verifyUser, authUser(0), getOrders);

/**
 * @swagger
 * /order/v1/{id}:
 *   get:
 *     summary: Get an order
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: The order ID
 *     responses:
 *       201:
 *         description: An order!
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
// Get order by ID
router.get('/v1/:id', verifyUser, authUser(0), getOrderById);

/**
 * @swagger
 * /order/v1/{id}:
 *   put:
 *     summary: Update order's status
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *     responses:
 *       201:
 *         description: An order!
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
// Update order by ID
router.put('/v1/:id', verifyUser, authUser(0), updateStatusOrder);


module.exports = router;
