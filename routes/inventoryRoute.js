// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const validate = require('../utilities/inventory-validation')
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildDetail);
router.get("/", utilities.handleErrors(invController.buildInvManagement));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassData,
  utilities.handleErrors(invController.addClassification));
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInv));
router.post(
  "/add-inventory",
  validate.inventoryRules(),
  validate.checkInvData,
  utilities.handleErrors(invController.addInv));

module.exports = router;