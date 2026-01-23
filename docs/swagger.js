const path = require("path");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tech Store API",
      version: "1.0.0",
      description: "Backend API documentation for the tech store",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication" },
      { name: "Users", description: "Customer operations" },
      { name: "Products", description: "Product management" },
      { name: "Categories", description: "Category management" },
      { name: "Orders", description: "Order management" },
      { name: "Suppliers", description: "Supplier management" },
      { name: "Features", description: "Feature management" },
      { name: "Statistics", description: "Analytics endpoints" },
      { name: "DB", description: "Database maintenance" },
    ],
    components: {
      securitySchemes: {
        AdminToken: {
          type: "apiKey",
          in: "header",
          name: "token",
        },
        CustomerToken: {
          type: "apiKey",
          in: "header",
          name: "token",
        },
        DbAdminToken: {
          type: "apiKey",
          in: "header",
          name: "x-db-admin-token",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                message: { type: "string" },
                code: { type: "string" },
                details: { type: "array", items: { type: "object" } },
              },
            },
          },
        },
        AdminAuthRequest: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
          required: ["email", "password"],
        },
        CustomerAuthRequest: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
          required: ["email", "password"],
        },
        Category: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            isMainCategory: { type: "boolean" },
            isSecondLevelCategory: { type: "boolean" },
            isThirdLevelCategory: { type: "boolean" },
            isSpecial: { type: "boolean" },
            showOnHomePage: { type: "boolean" },
            parentList: { type: "array", items: { type: "string" } },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string" },
            brand: { type: "string" },
            productNo: { type: "string" },
            keyProperties: { type: "string" },
            price: { type: "number" },
            category: { type: "array", items: { type: "string" } },
          },
        },
        OrderItem: {
          type: "object",
          properties: {
            productId: { type: "string" },
            price: { type: "number" },
            quantity: { type: "number" },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string" },
            type: { type: "string" },
            items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
            orderTotalPrice: { type: "number" },
          },
        },
        Supplier: {
          type: "object",
          properties: {
            _id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
            address: { type: "string" },
          },
        },
        Feature: {
          type: "object",
          properties: {
            _id: { type: "string" },
            featureType: { type: "string" },
            categoryId: { type: "string" },
            productId: { type: "string" },
          },
        },
        Review: {
          type: "object",
          properties: {
            _id: { type: "string" },
            customerId: { type: "string" },
            productId: { type: "string" },
            rating: { type: "number" },
            comment: { type: "string" },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "..", "routes", "api", "*.js"),
    path.join(__dirname, "..", "routes", "dbRouter.js"),
  ],
};

module.exports = swaggerOptions;
