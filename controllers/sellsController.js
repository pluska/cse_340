const sellsModel = require("../models/sells-model")
const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const utilities = require("../utilities/")

const sellsCont = {}

/* ***************************
 *  Build Sells Management
 * ************************** */

sellsCont.buildSellsManagement = async function (req, res, next) {
  const nav = await utilities.getNav()
  const data = await sellsModel.getSells()
  if (data.length === 0) {
    req.flash(`notice`, `Sorry, there are no sells yet.`)
    res.redirect("/account")
  } else {
    const vehicles = [];
    for (let i = 0; i < data.length; i++) {
      vehicles.push(await invModel.getInventoryById(data[i].inv_id))
    }
    const buyers = []
    for (let i = 0; i < data.length; i++) {
    buyers.push(await accountModel.getAccountById(data[i].account_id))
  }
  const table = await utilities.buildSellsTable(data, vehicles, buyers)
  res.render("./sells/manager", {
    title: "Sells Management",
    nav,
    table,
  })
  }
}

/* ***************************
 *  Add Sells
 * ************************** */

sellsCont.addSell = async function (req, res, next) {
  const { inv_id, account_id } = req.body
  const nav = await utilities.getNav()
  const data = await sellsModel.addSell(inv_id, account_id)
  if (data) {
    req.flash(`notice`, `Congrats, you bought a vehicle! We will contact you soon.`)
    res.redirect("/account")
  } else {
    req.flash(`notice`, `Sorry, something went wrong. Please try again.`)
    res.redirect("/inv/detail/" + inv_id)
  }
}

/* ***************************
 * Build Detail Sell View
 * ************************** */

sellsCont.buildDetail = async function (req, res, next) {
  const { sellId } = req.params
  const nav = await utilities.getNav()
  const data = await sellsModel.getSellById(sellId)
  if (data.length < 1) {
    req.flash(`notice`, `Sorry, we could not find that sell.`)
    res.redirect("/sells")
  } else {
    const vehicle = await invModel.getInventoryById(data.inv_id)
    const buyer = await accountModel.getAccountById(data.account_id)
    vehicle[0].inv_price = new Intl.NumberFormat('en-US').format(vehicle[0].inv_price)
    vehicle[0].inv_miles = new Intl.NumberFormat('en-US').format(vehicle[0].inv_miles)
    res.render("./sells/detail", {
      title: vehicle[0].inv_make + " " + vehicle[0].inv_model,
      nav,
      sell_id: sellId,
      account: buyer,
      vehicle: vehicle[0],
    })
  }
}

/* ***************************
 *  Build Edit Sell View
 * ************************** */

sellsCont.buildEditSell = async function (req, res, next) {
  const { sellId } = req.params
  const nav = await utilities.getNav()
  const data = await sellsModel.getSellById(sellId)
  if (data === null) {
    req.flash(`notice`, `Sorry, we could not find that sell.`)
    res.redirect("/sells")
  } else {
    const dataVehicles = await invModel.getInventory()
    const dataAccounts = await accountModel.getAccounts()
    const vehicles = await utilities.buildEditSellSelectVehicle(dataVehicles.rows, data)
    const accounts = await utilities.buildEditSellSelectBuyer(dataAccounts.rows, data)
    console.log(vehicles)
    res.render("./sells/edit", {
      title: "Updating Sell",
      nav,
      sell_id: sellId,
      vehicles,
      accounts,
      errors: null
    })
  }
}

/* **************************
 * Update Sell
 * ************************ */

sellsCont.updateSell = async function (req, res, next) {
  const { inv_id, account_id, sell_id } = req.body
  const data = await sellsModel.updateSell(sell_id, inv_id, account_id)
  if (data) {
    req.flash(`notice`, `The sell was successfully updated!`)
    res.redirect("/sells")
  } else {
    req.flash(`notice`, `Sorry, something went wrong. Please try again.`)
    res.redirect("/sells/edit/" + sell_id)
  }
}


/* **************************
 * Build Delete Sell View
 * *************************/

sellsCont.buildDeleteSell = async function (req, res, next) {
  const { sellId } = req.params
  const nav = await utilities.getNav()
  const data = await sellsModel.getSellById(sellId)
  if (data.length < 1) {
    req.flash(`notice`, `Sorry, we could not find that sell.`)
    res.redirect("/sells")
  } else {
    const vehicle = await invModel.getInventoryById(data.inv_id)
    const account = await accountModel.getAccountById(data.account_id)
    vehicle[0].inv_price = new Intl.NumberFormat('en-US').format(vehicle[0].inv_price)
    res.render("./sells/delete-confirm", {
      title: "Delete Sell " + vehicle[0].inv_make + " " + vehicle[0].inv_model,
      nav,
      sell_id: sellId,
      inv_make: vehicle[0].inv_make,
      inv_model: vehicle[0].inv_model,
      inv_price: vehicle[0].inv_price,
      account_name: account.account_firstname + " " + account.account_lastname,
      errors: null
    })
  }
}


/* ***************************
 *  Delete Sells *#06#
 * ************************** */

sellsCont.deleteSell = async function (req, res, next) {
  const { sell_id } = req.body
  const data = await sellsModel.deleteSell(sell_id)
  if (data) {
    req.flash(`notice`, `Sell was successfully deleted.`)
    res.redirect("/sells")
  } else {
    req.flash(`notice`, `Sorry, something went wrong. Please try again.`)
    res.redirect("/delete/" + sell_id)
  }
}

module.exports = sellsCont