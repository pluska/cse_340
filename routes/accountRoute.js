// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const validate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")

// Route to build inventory by classification view
router.get(
  '/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount));

// Account Information Update routes

router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdate));
router.post(
  "/update",
  utilities.checkLogin,
  validate.updateRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount))

// Account Password Update routes

router.post(
  "/update/password",
  utilities.checkLogin,
  validate.passwordRules(),
  validate.checkPassword,
  utilities.handleErrors(accountController.updatePassword))


// Login and Registration routes

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin))

// Register
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post(
  '/register',
  validate.registationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount))

// Logout

router.get('/logout', utilities.checkLogin, utilities.handleErrors(accountController.logout))

module.exports = router;