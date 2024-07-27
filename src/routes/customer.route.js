const express = require('express');
const router = express.Router();
const { signIn, logIn, getCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/customer.controller');

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
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: objectid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         role:
 *           type: integer
 *         created_at:
 *           type: string
 *       required:
 *         - name
 *         - email
 *         - password
 */

/**
 * @swagger
 * /customer/v1/signin:
 *   post:
 *     summary: Register a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: New customer created!
 *       400:
 *         description: Invalid input or user already exists
 */
// Create a new customer
router.post('/v1/signin', signIn);

/**
 * @swagger
 * /customer/v1:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
// Get all customers
router.get('/v1', verifyUser, authUser(0), getCustomers);

/**
 * @swagger
 * /customer/v1/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: A customer object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 *       401:
 *         description: Unauthorized, token missing or invalid
 */

// Get customer by ID
router.get('/v1/:id', verifyUser, authUser(0), getCustomerById);

/**
 * @swagger
 * /customer/v1/login:
 *   post:
 *     summary: Login
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 address:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Lỗi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 mess:
 *                   type: string
 */

router.post('/v1/login', logIn);


/**
 * @swagger
 * /customer/v1/{id}:
 *   put:
 *     summary: Update a customer's information
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: customer updated successfully
 *       400:
 *         description: Invalid input or customer not found
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
// Update customer by ID
router.put('/v1/:id', verifyUser, authUser(0), updateCustomer);


/**
 * @swagger
 * /customer/v1/{id}:
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: Customer deleted!
 *       404:
 *         description: Customer not found!
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
// Delete customer by ID
router.delete('/v1/:id', verifyUser, authUser(0), deleteCustomer);

module.exports = router;

