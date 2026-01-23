const express = require("express");
const router = express.Router();
// Models
const Supplier = require("../../models/Supplier");
// Middleware
const { check } = require("express-validator");
const validateRequest = require("../../middleware/validateRequest");
const authAdminMiddleware = require("../../middleware/authAdmin");



/**
 * @swagger
 * /api/supplier/supplier/:
 *   post:
 *     tags: [Suppliers]
 *     summary: Create a supplier
 *     security:
 *       - AdminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Supplier"
 *     responses:
 *       200:
 *         description: Supplier created
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
// Add a Supplier
router.post(
  '/supplier/',
  authAdminMiddleware,
  [  // Express Validator
    check("email", "Please include a valid email").isEmail(),
    check(
      "name",
      "Please enter a name"
    ).isLength({ min: 3 }),
    check(
      "address",
      "Please enter an address"
    ).isLength({ min: 3 }),
  ], // End of Express Validator
  validateRequest,
  async (req, res) => {
    try {
      console.log('supplierRouter -> addSupplier -> req.body ->', req.body)
      const {
        email,
        name,
        middleName,
        surName,
        address
      } = req.body;
      const supplier = new Supplier();
      supplier.email = email;
      supplier.name = name;
      supplier.middleName = middleName;
      supplier.surName = surName;
      supplier.address = address;
      supplier.orders = [];
      await supplier.save();
      res.status(200).json({
        msg: "Supplier has been added successfully",
        supplier,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


/**
 * @swagger
 * /api/supplier/query:
 *   get:
 *     tags: [Suppliers]
 *     summary: Query suppliers
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supplier list
 */
// Query Suppliers
router.get(
  "/query",
  authAdminMiddleware,  
  async (req, res) => {
    try {
      const search = req.query.search;
      const supplierList = await Supplier.find({
        $or : [
          {
            name: {
              $regex: new RegExp(search),
              $options: "i" // case Insensitive
            }
          },
          {
            middleName: {
              $regex: new RegExp(search),
              $options: "i" // case Insensitive
            }
          },
          {
            surName: {
              $regex: new RegExp(search),
              $options: "i" // case Insensitive
            }
          },
          {
            address: {
              $regex: new RegExp(search),
              $options: "i" // case Insensitive
            }
          },
        ]
      });

      return res.status(200).json(supplierList);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
