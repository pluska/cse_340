const express = require("express")
const router = new express.Router()
const sellsCont = require("../controllers/sellsController")
const utilities = require("../utilities/")
const validations = require("../utilities/sells-validation")

// Route to build sells management view
router.get(
  "/",
  utilities.checkJWTAutorization,
  utilities.handleErrors(sellsCont.buildSellsManagement)
)

// Route to add sell

router.post(
  "/buy",
  utilities.checkLogin,
  utilities.handleErrors(sellsCont.addSell)
)

// View details

router.get(
  "/detail/:sellId",
  utilities.checkLogin,
  utilities.handleErrors(sellsCont.buildDetail)
)

// Edit and Delete routes

router.get(
  "/edit/:sellId",
  utilities.checkJWTAutorization,
  utilities.handleErrors(sellsCont.buildEditSell)
)
router.post(
  "/update",
  utilities.checkJWTAutorization,
  validations.sellsUpdateRules(),
  validations.checkSellsUpdate,
  utilities.handleErrors(sellsCont.updateSell)
)
router.get(
  "/delete/:sellId",
  utilities.checkJWTAutorization,
  utilities.handleErrors(sellsCont.buildDeleteSell)
)
router.post(
  "/delete",
  utilities.checkJWTAutorization,
  utilities.handleErrors(sellsCont.deleteSell)
)

module.exports = router