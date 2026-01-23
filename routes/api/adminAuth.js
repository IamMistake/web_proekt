const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
// Middleware
const { check } = require("express-validator");
const validateRequest = require("../../middleware/validateRequest");
const authAdminMiddleware = require("../../middleware/authAdmin");
// Models
const Admin = require("../../models/Admin");


/**
 * @swagger
 * /api/admin-auth/register/:
 *   post:
 *     tags: [Auth]
 *     summary: Register an admin user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AdminAuthRequest"
 *     responses:
 *       200:
 *         description: Admin registered
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
// Add Admin Account - Register Admin
router.post(
  "/register/",
  [  // Express Validator
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ], // End of Express Validator
  validateRequest,
  async (req, res) => {
    try {
      // let i = 1+1;
      // if ( i === 2 ) {
      //   return res
      //     .status(400)
      //     .json({ errors: [{ msg: "Registration as an admin is not allowed at the moment!" }] });
      // }
      // See if user username exists
      let isAdminExist = await Admin.findOne({ email: req.body.email });
      if (isAdminExist) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Admin Account already exists" }] });
      }
      console.log('adminAuth -> Register Admin -> email & password ->', req.body.email, req.body.password);

      let admin = new Admin({
        email: req.body.email,
        password: req.body.password,
      });
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(req.body.password, salt);
      await admin.save();
      // Return jsonwebtoken
      const payload = {
        user: {
          id: admin._id.toString(),
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecretAdmin"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
); // End of Add Admin Account - Register Admin


/**
 * @swagger
 * /api/admin-auth/auth:
 *   post:
 *     tags: [Auth]
 *     summary: Admin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AdminAuthRequest"
 *     responses:
 *       200:
 *         description: Login success
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
// Admin Login
router.post(
  '/auth',
  [  // Express Validator
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ], // End of Express Validator
  validateRequest,
  async (req, res) => {

    try {
      const {  email, password } = req.body;
      // Check if admin exists
      const admin = await Admin.findOne({email})
      if ( !admin ) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
      }
      // Confirm password
      const isMatch = await bcrypt.compare(password, admin.password);
      if ( !isMatch ) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
      }
      // Return jsonwebtoken
      const payload = {
        user: {
          id: admin._id.toString(),
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecretAdmin"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL
      })
      console.error(err.message)
      res.status(500).send('Server Error')       
    }
  }
);  // End of Admin Login





module.exports = router;
