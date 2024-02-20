const utilities = require(".")
const { body, validationResult } = require("express-validator")
const sellsModel = require("../models/sells-model")
const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")

const validate = {}

/* **********************************
 *  Sells Data Validation Rules
 * ********************************* */

validate.sellsUpdateRules = () => {
  return [
    body("account_id")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an account.")
      .custom(async (account_id) => {
        const accountExists = await accountModel.getAccountById(account_id)
        if (!accountExists) {
          throw new Error("Account does not exist.")
        }
      }),
    body("inv_id")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an vehicle.")
      .custom(async (inv_id) => {
        const invExists = await invModel.getInventoryById(inv_id)
        if (!invExists) {
          throw new Error("Vehicle does not exist.")
        }
      }),
      body("sell_id")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide an sell.")
        .custom(async (sell_id) => {
          const sellExists = await sellsModel.getSellById(sell_id)
          if (!sellExists) {
            throw new Error("Sell does not exist.")
          }
        })
  ]
}

validate.sellsDeleteRules = () => {
  return [
    body("sell_id")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide an sell.")
    .custom(async (sell_id) => {
      const sellExists = await sellsModel.getSellById(sell_id)
      if (!sellExists) {
        throw new Error("Sell does not exist.")
      }
    })
  ]
}

validate.checkSellsUpdate = async (req, res, next) => {
  const { account_id, inv_id, sell_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const dataVehicles = await invModel.getInventory()
    const dataAccounts = await accountModel.getAccounts()
    const vehicles = await utilities.buildEditSellSelectVehicle(dataVehicles.rows, inv_id)
    const accounts = await utilities.buildEditSellSelectBuyer(dataAccounts.rows, account_id)
    res.render("./sells/edit", {
      title: "Edit Sell",
      nav,
      errors,
      sell_id,
      vehicles,
      accounts
    })
    return
  }
  next()
}

module.exports = validate