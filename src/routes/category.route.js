const express = require('express');
const router = express.Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/category.controller');

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
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: objectid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *       required:
 *         - name
 *         - description
 */

/**
 * @swagger
 * /category/v1/create:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Technology"
 *               description:
 *                 type: string
 *                 example: "laptop, mobile,..."
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input
 */
// Create a new category
router.post('/v1/create', verifyUser, authUser(0), createCategory);

/**
 * @swagger
 * /category/v1:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: objectid
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *       400:
 *         description: Error retrieving categories
 */
// Get all categories
router.get('/v1', getCategories);

/**
 * @swagger
 * /category/v1/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input or category not found
 *       404:
 *         description: Category not found
 */
// Update category by ID
router.put('/v1/:id', verifyUser, authUser(0), updateCategory);

/**
 * @swagger
 * /category/v1/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category deleted!
 *       404:
 *         description: Category not found!
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
// Delete category by ID
router.delete('/v1/:id', verifyUser, authUser(0), deleteCategory);

module.exports = router;
