const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ********************************
 * Constructs Select Category for Add Inventory
 * ******************************** */

Util.buildAddInvSelect = async function (classification_id) {
  let data = await invModel.getClassifications()
  let select = '<select id="classificationList" name="classification_id">'
  data.rows.forEach((row) => {
    if (row.classification_id == classification_id) {
      select += "<option value='" + row.classification_id + "' selected>"
    } else {
      select += "<option value='" + row.classification_id + "'>" + row.classification_name + "</option>"
    }
  })
  select += "</select>"
  return select
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetail = async function(data){
  let vehicle = data[0]
  vehicle.inv_price = new Intl.NumberFormat('en-US').format(vehicle.inv_price)
  vehicle.inv_miles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)

  let view = ''

  view += '<div class="main-information">'
  view += '<div class="car-photo">'
  view += '<img src="' + vehicle.inv_image + '" alt="image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors">'
  view += '</div>'
  view += '<div class="car-information">'
  view += '<div class="prominent-information">'
  view += '<p><span>Make:</span> ' + vehicle.inv_make + '</p>'
  view += '<p><span>Model:</span> ' + vehicle.inv_model + '</p>'
  view += '<p><span>Year:</span> ' + vehicle.inv_year + '</p>'
  view += '<p><span>Price:</span> $' + vehicle.inv_price + '</p>'
  view += '</div>'
  view += '<div class="other-information">'
  view += '<p><span>Mileage:</span> ' + vehicle.inv_miles + '</p>'
  view += '<p><span>Color:</span> ' + vehicle.inv_color + '</p>'
  view += '</div>'
  view += '</div>'
  view += '<div class="car-description">'
  view += '<h2>Description:</h2>'
  view += '<p>'
  view += vehicle.inv_description
  view += '</p>'
  view += '</div>'
  view += '</div>'

  return view
}

/* **************************************
* Handles errors
* ************************************ */
Util.handleErrors = function(fn){
  return async function(req, res, next){
    try {
      await fn(req, res, next)
    } catch(error){
      next(error)
    }
  }
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
      if (err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
      }
      res.locals.accountData = accountData
      res.locals.loggedin = 1
      next()
      })
    } else {
    next()
    }
  }

  /* ****************************************
 *  Check Login
 * ************************************ */
  Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
      next()
    } else {
      req.flash("notice", "Please log in.")
      return res.redirect("/account/login")
    }
  }

  /* ****************************************
 *  Check Admin or Employee JWT Autorization
 * ************************************ */

  Util.checkJWTAutorization = (req, res, next) => {
      const token = req.cookies.jwt;
      if (!token) {
        req.flash('notice', 'Please log in');
        return res.status(401).redirect('/account/login');
      }
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          req.flash('notice', 'Please log in');
          return res.status(403).redirect('/account/login');
        }
        req.user = user; // Almacena la información del usuario en req
        const account_type = req.user.account_type;
        if (account_type !== 'Admin' && account_type !== 'Employee') {
          req.flash('notice', 'Unauthorized access');
          return res.status(403).redirect('/account/login');
        } else {
          next();
        }
      });
  }


module.exports = Util