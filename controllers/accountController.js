const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    errors: null,
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    errors: null,
    nav,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      errors: null,
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      errors: null,
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      req.flash("notice", "You are now logged in.")
      return res.redirect("/account/")
    }
  } catch (error) {
   new Error('Access Forbidden')
   res.status(500).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
  });
  return;
  }
 }

/* ****************************************
 *  Build account view
 * ************************************ */

async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  const title = "Welcome back " + res.locals.accountData.account_firstname
  res.render("account/account", {
    title,
    nav,
  })
}

/* ****************************************
 *  Build Update Information view
 * ************************************ */

async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id } = req.params
  const data = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData: data,
    account_id
  })
}

/* ****************************************
 *  Update Account
 * ************************************ */

async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const result = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
  if (result) {
    res.locals.accountData = await accountModel.getAccountById(account_id)
    req.flash("notice", "Account information updated.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.redirect("/account/update/" + account_id)
  }
}

/* ****************************************
 *  Update Password
 * ************************************ */

async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body
  const hashedPassword = await bcrypt.hashSync(account_password, 10)
  const result = await accountModel.updatePassword(account_id, hashedPassword)
  if (result) {
    req.flash("notice", "Password updated.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
  }
}

/* ****************************************
 *  Logout
 * ************************************ */

async function logout(req, res, next) {
  res.clearCookie("jwt")
  res.redirect("/")
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, buildUpdate, updateAccount, updatePassword, logout }