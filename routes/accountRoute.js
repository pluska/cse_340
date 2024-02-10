// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const validate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post(
  '/register',
  validate.registationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount))
// Process the login attempt
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(
  (req, res) => {
    res.status(200).send('login process')
  }
  ))

module.exports = router;