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
    password: await bcrypt.hash("Admin123@", salt),
  });

  const customer = await Customer.create({
    email: "customer@techstore.local",
    password: await bcrypt.hash("seeded-customer", salt),
    name: "Seed",
    surName: "Customer",
    balance: 0,
  });

  const customerTwo = await Customer.create({
    email: "guest@techstore.local",
    password: await bcrypt.hash("seeded-guest", salt),
    name: "Guest",
    surName: "Shopper",
    balance: 25.5,
  });

  const supplier = await Supplier.create({
    email: "supplier@techstore.local",
    name: "Seed Supplier",
    address: "Seed Street 1",
  });

  const supplierTwo = await Supplier.create({
    email: "warehouse@techstore.local",
    name: "Warehouse Supply",
    address: "Industrial Zone 12",
  });

  const pictures = await Picture.create([
    { image: Buffer.from("seed-image-1") },
    { image: Buffer.from("seed-image-2") },
    { image: Buffer.from("seed-image-3") },
    { image: Buffer.from("seed-image-4") },
    { image: Buffer.from("seed-image-5") },
    { image: Buffer.from("seed-image-6") },
    { image: Buffer.from("seed-image-7") },
    { image: Buffer.from("seed-image-8") },
  ]);

  const [
    laptopPic,
    ultrabookPic,
    cpuPic,
    gpuPic,
    storagePic,
    mousePic,
    keyboardPic,
    monitorPic,
  ] = pictures;

  const laptopsCategory = await Category.create({
    title: "Laptops",
    isMainCategory: true,
    isSpecial: true,
    showOnHomePage: true,
    imageId: laptopPic._id,
    parentList: [],
    childrenList: [],
  });

  const componentsCategory = await Category.create({
    title: "Components",
    isMainCategory: true,
    imageId: gpuPic._id,
    parentList: [],
    childrenList: [],
  });

  const accessoriesCategory = await Category.create({
    title: "Accessories",
    isMainCategory: true,
    imageId: mousePic._id,
    parentList: [],
    childrenList: [],
  });

  const gamingLaptops = await Category.create({
    title: "Gaming Laptops",
    isSecondLevelCategory: true,
    parentList: [laptopsCategory._id],
    childrenList: [],
  });

  const ultrabooks = await Category.create({
    title: "Ultrabooks",
    isSecondLevelCategory: true,
    parentList: [laptopsCategory._id],
    childrenList: [],
  });

  const processors = await Category.create({
    title: "Processors",
    isSecondLevelCategory: true,
    parentList: [componentsCategory._id],
    childrenList: [],
  });

  const graphicsCards = await Category.create({
    title: "Graphics Cards",
    isSecondLevelCategory: true,
    parentList: [componentsCategory._id],
    childrenList: [],
  });

  const storage = await Category.create({
    title: "Storage",
    isSecondLevelCategory: true,
    parentList: [componentsCategory._id],
    childrenList: [],
  });

  const peripherals = await Category.create({
    title: "Peripherals",
    isSecondLevelCategory: true,
    parentList: [accessoriesCategory._id],
    childrenList: [],
  });

  laptopsCategory.childrenList = [gamingLaptops._id, ultrabooks._id];
  await laptopsCategory.save();
  componentsCategory.childrenList = [processors._id, graphicsCards._id, storage._id];
  await componentsCategory.save();
  accessoriesCategory.childrenList = [peripherals._id];
  await accessoriesCategory.save();

  const products = await Product.create([
    {
      brand: "NovaTech",
      productNo: "NT-GLX-15",
      keyProperties: "15-inch, RTX 4060, 144Hz",
      price: 1499.99,
      stockStatus: { stockQuantity: 12, isOnOrder: false },
      category: [laptopsCategory._id, gamingLaptops._id],
      imageList: [{ imageId: laptopPic._id, isMain: true }],
      specifications: [
        { key: "CPU", value: "Intel i7-13700H" },
        { key: "GPU", value: "RTX 4060" },
        { key: "RAM", value: "16GB" },
      ],
    },
    {
      brand: "AeroLite",
      productNo: "AL-U14",
      keyProperties: "14-inch, 1.1kg, OLED",
      price: 1199.0,
      stockStatus: { stockQuantity: 18, isOnOrder: false },
      category: [laptopsCategory._id, ultrabooks._id],
      imageList: [{ imageId: ultrabookPic._id, isMain: true }],
      specifications: [
        { key: "CPU", value: "Ryzen 7 7840U" },
        { key: "RAM", value: "16GB" },
        { key: "Storage", value: "512GB NVMe" },
      ],
    },
    {
      brand: "ZenCore",
      productNo: "ZC-5700X",
      keyProperties: "8 cores, 65W",
      price: 249.99,
      stockStatus: { stockQuantity: 40, isOnOrder: false },
      category: [componentsCategory._id, processors._id],
      imageList: [{ imageId: cpuPic._id, isMain: true }],
      specifications: [
        { key: "Cores", value: "8" },
        { key: "Base Clock", value: "3.4GHz" },
      ],
    },
    {
      brand: "Vortex",
      productNo: "RTX-4070-OC",
      keyProperties: "12GB GDDR6X, Triple Fan",
      price: 689.0,
      stockStatus: { stockQuantity: 14, isOnOrder: true },
      category: [componentsCategory._id, graphicsCards._id],
      imageList: [{ imageId: gpuPic._id, isMain: true }],
      specifications: [
        { key: "Memory", value: "12GB" },
        { key: "Boost", value: "2.6GHz" },
      ],
    },
    {
      brand: "RapidStore",
      productNo: "RS-NVME-1TB",
      keyProperties: "PCIe 4.0, 7000MB/s",
      price: 129.5,
      stockStatus: { stockQuantity: 60, isOnOrder: false },
      category: [componentsCategory._id, storage._id],
      imageList: [{ imageId: storagePic._id, isMain: true }],
      specifications: [
        { key: "Capacity", value: "1TB" },
        { key: "Interface", value: "PCIe 4.0" },
      ],
    },
    {
      brand: "Pulse",
      productNo: "PX-MOUSE-X",
      keyProperties: "26K DPI, 58g",
      price: 59.0,
      stockStatus: { stockQuantity: 90, isOnOrder: false },
      category: [accessoriesCategory._id, peripherals._id],
      imageList: [{ imageId: mousePic._id, isMain: true }],
      specifications: [
        { key: "Sensor", value: "PixArt 3395" },
        { key: "Weight", value: "58g" },
      ],
    },
    {
      brand: "HexaKey",
      productNo: "HK-MECH-87",
      keyProperties: "Hot-swap, RGB",
      price: 109.0,
      stockStatus: { stockQuantity: 35, isOnOrder: false },
      category: [accessoriesCategory._id, peripherals._id],
      imageList: [{ imageId: keyboardPic._id, isMain: true }],
      specifications: [
        { key: "Switches", value: "Linear" },
        { key: "Layout", value: "TKL" },
      ],
    },
    {
      brand: "ViewCore",
      productNo: "VC-27QHD",
      keyProperties: "27-inch, 165Hz, IPS",
      price: 279.0,
      stockStatus: { stockQuantity: 22, isOnOrder: false },
      category: [accessoriesCategory._id, peripherals._id],
      imageList: [{ imageId: monitorPic._id, isMain: true }],
      specifications: [
        { key: "Resolution", value: "2560x1440" },
        { key: "Refresh", value: "165Hz" },
      ],
    },
  ]);

  const features = await Feature.create([
    {
      featureType: "product",
      productId: products[0]._id,
      imageId: laptopPic._id,
    },
    {
      featureType: "product",
      productId: products[3]._id,
      imageId: gpuPic._id,
    },
    {
      featureType: "product",
      productId: products[5]._id,
      imageId: mousePic._id,
    },
  ]);

  const order = await Order.create({
    customerId: customer._id,
    type: "sell",
    items: [
      {
        productId: products[0]._id,
        brand: products[0].brand,
        productNo: products[0].productNo,
        keyProperties: products[0].keyProperties,
        mainImageId: laptopPic._id,
        price: products[0].price,
        quantity: 1,
      },
      {
        productId: products[5]._id,
        brand: products[5].brand,
        productNo: products[5].productNo,
        keyProperties: products[5].keyProperties,
        mainImageId: mousePic._id,
        price: products[5].price,
        quantity: 2,
      },
    ],
    orderTotalPrice: products[0].price + products[5].price * 2,
    address: {
      definition: "Home",
      receiver: "Seed Customer",
      addressString: "Seed Street 1",
      city: "Seed City",
    },
  });

  const orderTwo = await Order.create({
    customerId: customerTwo._id,
    type: "sell",
    items: [
      {
        productId: products[1]._id,
        brand: products[1].brand,
        productNo: products[1].productNo,
        keyProperties: products[1].keyProperties,
        mainImageId: ultrabookPic._id,
        price: products[1].price,
        quantity: 1,
      },
      {
        productId: products[6]._id,
        brand: products[6].brand,
        productNo: products[6].productNo,
        keyProperties: products[6].keyProperties,
        mainImageId: keyboardPic._id,
        price: products[6].price,
        quantity: 1,
      },
    ],
    orderTotalPrice: products[1].price + products[6].price,
    address: {
      definition: "Office",
      receiver: "Guest Shopper",
      addressString: "Market Avenue 8",
      city: "Seed City",
    },
  });

  customer.orders = [{ orderId: order._id }];
  await customer.save();
  customerTwo.orders = [{ orderId: orderTwo._id }];
  await customerTwo.save();

  const supplierOrder = await Order.create({
    supplierId: supplier._id,
    type: "procurement",
    items: [
      {
        productId: products[2]._id,
        brand: products[2].brand,
        productNo: products[2].productNo,
        keyProperties: products[2].keyProperties,
        mainImageId: cpuPic._id,
        price: 199.99,
        quantity: 10,
      },
      {
        productId: products[4]._id,
        brand: products[4].brand,
        productNo: products[4].productNo,
        keyProperties: products[4].keyProperties,
        mainImageId: storagePic._id,
        price: 99.99,
        quantity: 25,
      },
    ],
    orderTotalPrice: 199.99 * 10 + 99.99 * 25,
    address: {
      addressString: "Supplier Warehouse",
    },
  });

  const supplierOrderTwo = await Order.create({
    supplierId: supplierTwo._id,
    type: "procurement",
    items: [
      {
        productId: products[3]._id,
        brand: products[3].brand,
        productNo: products[3].productNo,
        keyProperties: products[3].keyProperties,
        mainImageId: gpuPic._id,
        price: 549.0,
        quantity: 6,
      },
    ],
    orderTotalPrice: 549.0 * 6,
    address: {
      addressString: "Industrial Zone 12",
    },
  });

  supplier.orders = [{ orderId: supplierOrder._id }];
  await supplier.save();
  supplierTwo.orders = [{ orderId: supplierOrderTwo._id }];
  await supplierTwo.save();

  const reviews = await Review.create([
    {
      customerId: customer._id,
      productId: products[0]._id,
      rating: 5,
      comment: "Great performance for the price.",
    },
    {
      customerId: customerTwo._id,
      productId: products[5]._id,
      rating: 4,
      comment: "Lightweight and responsive.",
    },
    {
      customerId: customerTwo._id,
      productId: products[3]._id,
      rating: 5,
      comment: "Runs cool and quiet under load.",
    },
  ]);

  return {
    admin,
    customers: [customer, customerTwo],
    suppliers: [supplier, supplierTwo],
    categories: [
      laptopsCategory,
      componentsCategory,
      accessoriesCategory,
      gamingLaptops,
      ultrabooks,
      processors,
      graphicsCards,
      storage,
      peripherals,
    ],
    products,
    features,
    orders: [order, orderTwo, supplierOrder, supplierOrderTwo],
    reviews,
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
