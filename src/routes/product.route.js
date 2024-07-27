const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductById, getProductPagination, updateProduct, deleteProduct, searchProducts, filterProducts } = require('../controllers/product.controller');

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
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: objectid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: integer
 *         category_id:
 *           type: string
 *           format: objectid
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *         colors:
 *           type: array
 *           items:
 *             type: string
 *         stock: 
 *           type: integer
 *         created_at:
 *           type: string
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category_id
 *         - images
 *         - sizes
 *         - colors
 */

/**
 * @swagger
 * /product/v1/filter:
 *   get:
 *     summary: Filter products by price, category, and date
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         description: Minimum price of the product 
 *         schema:
 *           type: number
 *           format: float
 *       - in: query
 *         name: maxPrice
 *         description: Maximum price of the product 
 *         schema:
 *           type: number
 *           format: float
 *       - in: query
 *         name: category_id
 *         description: ID of the category to filter products
 *         schema:
 *           type: string
 *           format: objectid
 *       - in: query
 *         name: sortByDate
 *         description: Sort products by date, either "newest" or "oldest"
 *         schema:
 *           type: string
 *           enum:
 *             - newest
 *             - oldest
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: limit
 *         description: Number of products per page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: A list of filtered products with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 0
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                 mess:
 *                   type: string
 *                   example: "Filtering successfully!"
 *       400:
 *         description: Error filtering products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 mess:
 *                   type: string
 *                   example: "Minimum or maximum is a positive number"
 *       404:
 *         description: No products found, Id category is invalid or not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 mess:
 *                   type: string
 *                   example: "No products"
 */
router.get("/v1/filter", filterProducts)
/**
 * @swagger
 * /product/v1/search:
 *   get:
 *     summary: Search products by name or keywords with pagination
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         description: The search term to find products
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         description: The page number for pagination
 *         schema:
 *           type: integer
 *           example: 0
 *       - in: query
 *         name: limit
 *         description: The number of results per page
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A list of products matching the search criteria with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                 mess:
 *                   type: string
 *                   example: "Products found"
 *       400:
 *         description: Error searching products
 */
router.get("/v1/search", searchProducts);

/**
 * @swagger
 * /product/v1/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
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
 *                 example: "Electronics"
 *               description:
 *                 type: string
 *                 example: "This is a description."
 *               price:
 *                 type: number
 *                 example: 20000
 *               category_id:
 *                 type: string
 *                 example: "669b84dc9bbab51c306e128a"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "image1.jpg"
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "30x50"
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "red"
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 mess:
 *                   type: string
 *                   example: "Product created successfully"
 *       400:
 *         description: Invalid input
 */
// Create a new product
router.post('/v1/create', verifyUser, authUser(0), createProduct);

/**
 * @swagger
 * /product/v1:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 mess:
 *                   type: string
 *                   example: "Get all products successfully!"
 *       400:
 *         description: Error retrieving products
 */
// Get all products
router.get('/v1', getProducts);

/**
 * @swagger
 * /product/v1/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 mess:
 *                   type: string
 *                   example: "Get successfully"
 *       400:
 *         description: Error retrieving product
 *       404:
 *         description: Product not found
 */
// Get product by ID
router.get('/v1/:id', getProductById);


/**
 * @swagger
 * /product/v1/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Product"
 *               description:
 *                 type: string
 *                 example: "Updated description."
 *               price:
 *                 type: intger
 *                 example: 20000
 *               category_id:
 *                 type: string
 *                 example: "60d4b5f67a4b2c001f9d6a5d"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "updatedImage.jpg"
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "updated sizes"
 *               colors:
 *                 type: number
 *                 example: "updated colors"
 *     responses:
 *       200:
 *         description: Update successfully!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 mess:
 *                   type: string
 *                   example: "Update successfully!"
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 */
// Update product by ID
router.put('/v1/:id', verifyUser, authUser(0), updateProduct);

/**
 * @swagger
 * /product/v1/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted!
 *       404:
 *         description: Product not found!
 */
// Delete product by ID
router.delete('/v1/:id', verifyUser, authUser(0), deleteProduct);

module.exports = router;
