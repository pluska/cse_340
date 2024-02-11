const utilities = require("./")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")

const validate = {}

/* **********************************
 *  Classification Data Validation Rules
 * ********************************* */

validate.classificationRules = () => {
  return [
    // valid classification name is required
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .custom(async (classification_name) => {
        const nameExists = await invModel.checkExistingName(classification_name)
        if (/[\s~`!@#$%^&*()_+={}[\]:;'",<.>?\\\/]/.test(classification_name)) {
          throw new Error("Classification name cannot contain spaces or special characters.");
        }
        if (nameExists) {
          throw new Error ("Classification name already exists. Please use a different classification name.")
        }
        return true
      })
    ]
}

/* **********************************
 *  Inventory Data Validation Rules
 * ********************************* */

validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a make."),
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a model."),
    body("inv_year")
      .trim()
      .toInt()
      .isLength({ min: 1 })
      .withMessage("Please provide a year."),
    body("inv_description")
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage("Please provide a description of at least 1 and no more than 500 characters."),
    body("inv_price")
      .trim()
      .toInt()
      .isLength({ min: 1 })
      .withMessage("Please provide a price."),
    body("inv_miles")
      .trim()
      .toInt()
      .isLength({ min: 1 })
      .withMessage("Please provide a mileage."),
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."),
    body("classification_id")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification.")
      .custom(async (classification_id) => {
        const classificationExists = await invModel.checkExistingClassificationId(classification_id)
        if (!classificationExists) {
          throw new Error ("Classification does not exist.")
        }
      })
  ]
}

/*  **********************************
 *  Check Classification Data
 * ********************************* */

validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name
    })
    return
  }
  next()
}

/* **********************************
 *  Check Inventory Data
 * ********************************* */

validate.checkInvData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
  console.log(req.body);
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classifications = await utilities.buildAddInvSelect(classification_id)
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      classifications,
    })
    return
  }
  next()
}

module.exports = validate