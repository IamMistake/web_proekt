const express = require("express");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Category = require("../models/Category");
const Customer = require("../models/Customer");
const Feature = require("../models/Feature");
const Order = require("../models/Order");
const Picture = require("../models/Picture");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const Review = require("../models/Review");
const { createError } = require("../middleware/errorHandler");

const router = express.Router();

const isDbAccessAllowed = (req) => {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }
  const token = req.header("x-db-admin-token");
  return token && process.env.DB_ADMIN_TOKEN && token === process.env.DB_ADMIN_TOKEN;
};

const dbAccessMiddleware = (req, res, next) => {
  if (!isDbAccessAllowed(req)) {
    return next(
      createError(403, "DB access is forbidden", "FORBIDDEN")
    );
  }
  return next();
};

const seedDatabase = async () => {
  const salt = await bcrypt.genSalt(10);
  const admin = await Admin.create({
    email: "admin@techstore.local",
    password: await bcrypt.hash("seeded-admin", salt),
  });

  const customer = await Customer.create({
    email: "customer@techstore.local",
    password: await bcrypt.hash("seeded-customer", salt),
    name: "Seed",
    surName: "Customer",
    balance: 0,
  });

  const supplier = await Supplier.create({
    email: "supplier@techstore.local",
    name: "Seed Supplier",
    address: "Seed Street 1",
  });

  const picture = await Picture.create({
    image: Buffer.from("seed-image"),
  });

  const mainCategory = await Category.create({
    title: "Laptops",
    isMainCategory: true,
    imageId: picture._id,
    parentList: [],
    childrenList: [],
  });

  const subCategory = await Category.create({
    title: "Gaming Laptops",
    isSecondLevelCategory: true,
    parentList: [mainCategory._id],
    childrenList: [],
  });

  const product = await Product.create({
    brand: "NovaTech",
    productNo: "NT-GLX-15",
    keyProperties: "15-inch, RTX",
    price: 1499.99,
    stockStatus: { stockQuantity: 12, isOnOrder: false },
    category: [mainCategory._id, subCategory._id],
    imageList: [{ imageId: picture._id, isMain: true }],
  });

  const feature = await Feature.create({
    featureType: "product",
    productId: product._id,
    imageId: picture._id,
  });

  const order = await Order.create({
    customerId: customer._id,
    type: "sell",
    items: [
      {
        productId: product._id,
        brand: product.brand,
        productNo: product.productNo,
        keyProperties: product.keyProperties,
        mainImageId: picture._id,
        price: product.price,
        quantity: 1,
      },
    ],
    orderTotalPrice: product.price,
    address: {
      definition: "Home",
      receiver: "Seed Customer",
      addressString: "Seed Street 1",
      city: "Seed City",
    },
  });

  customer.orders = [{ orderId: order._id }];
  await customer.save();

  const supplierOrder = await Order.create({
    supplierId: supplier._id,
    type: "procurement",
    items: [
      {
        productId: product._id,
        brand: product.brand,
        productNo: product.productNo,
        keyProperties: product.keyProperties,
        mainImageId: picture._id,
        price: 999.99,
        quantity: 5,
      },
    ],
    orderTotalPrice: 4999.95,
    address: {
      addressString: "Supplier Warehouse",
    },
  });

  supplier.orders = [{ orderId: supplierOrder._id }];
  await supplier.save();

  const review = await Review.create({
    customerId: customer._id,
    productId: product._id,
    rating: 5,
    comment: "Great performance for the price.",
  });

  return {
    admin,
    customer,
    supplier,
    mainCategory,
    subCategory,
    product,
    feature,
    order,
    review,
  };
};

/**
 * @swagger
 * /db:
 *   get:
 *     tags: [DB]
 *     summary: DB maintenance page
 *     security:
 *       - DbAdminToken: []
 *     responses:
 *       200:
 *         description: HTML page with clear/seed actions
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/", dbAccessMiddleware, (req, res) => {
  res.set("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DB Maintenance</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; background: #f5f7fb; }
      h1 { margin-bottom: 12px; }
      form { display: inline-block; margin-right: 16px; }
      button { padding: 10px 16px; border: 0; border-radius: 4px; cursor: pointer; }
      .clear { background: #e55353; color: #fff; }
      .seed { background: #2f855a; color: #fff; }
    </style>
  </head>
  <body>
    <h1>Database Maintenance</h1>
    <p>Use the buttons below to clear or seed the database.</p>
    <form method="post" action="/db/clear">
      <button class="clear" type="submit">Clear DB</button>
    </form>
    <form method="post" action="/db/seed">
      <button class="seed" type="submit">Seed DB</button>
    </form>
  </body>
</html>`);
});

/**
 * @swagger
 * /db/clear:
 *   post:
 *     tags: [DB]
 *     summary: Clear all collections
 *     security:
 *       - DbAdminToken: []
 *     responses:
 *       200:
 *         description: Database cleared
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/clear", dbAccessMiddleware, async (req, res, next) => {
  try {
    await Promise.all([
      Admin.deleteMany({}),
      Category.deleteMany({}),
      Customer.deleteMany({}),
      Feature.deleteMany({}),
      Order.deleteMany({}),
      Picture.deleteMany({}),
      Product.deleteMany({}),
      Supplier.deleteMany({}),
      Review.deleteMany({}),
    ]);
    return res.status(200).json({ message: "Database cleared" });
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * /db/seed:
 *   post:
 *     tags: [DB]
 *     summary: Seed demo data
 *     security:
 *       - DbAdminToken: []
 *     responses:
 *       200:
 *         description: Demo data inserted
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/seed", dbAccessMiddleware, async (req, res, next) => {
  try {
    const data = await seedDatabase();
    return res.status(200).json({
      message: "Database seeded",
      data,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
