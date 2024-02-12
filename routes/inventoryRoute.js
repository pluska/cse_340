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

  router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

  /* Edit Routes */

  router.get("/edit/:invId", utilities.handleErrors(invController.buildEditInv));
  router.post("/update/",
    validate.inventoryRules(),
    validate.checkUpdateData,
    utilities.handleErrors(invController.updateInv));
  router.get("delete/:invId", utilities.handleErrors(invController.buildDeleteInv));
  router.post("delete/:invId", utilities.handleErrors(invController.deleteInv));

module.exports = router;