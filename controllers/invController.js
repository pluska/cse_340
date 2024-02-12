const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  if (data.length === 0) {
    req.flash(`notice`, `Sorry, there are no vehicles in this classification.`)
    res.redirect("/")
  } else {
    const grid = await utilities.buildClassificationGrid(data)
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  }
}

/* ***************************
 *  Build Detail
 * ************************** */

invCont.buildDetail = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  let nav = await utilities.getNav()
  const vehicle = await utilities.buildDetail(data)
  res.render("./inventory/detail", {
    title: data[0].inv_make + " " + data[0].inv_model,
    nav,
    vehicle,
    inv_id
  })
}

/***********************
 *  Build Inventory Management
 ***********************/

invCont.buildInvManagement = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildAddInvSelect()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
  })
}

/***********************
 *  Build Add Classification
 ***********************/

invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/***********************
 *  Add Classification
 ***********************/

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)
  if (result) {
    req.flash(`notice`, `Classification added.`)
    res.redirect("/inv")
  } else {
    req.flash(`notice`, `Sorry, there was an error processing the request.`)
    res.redirect("/inv/add-classification")
  }
}

/***********************
 *  Build Add Inventory
 ***********************/

invCont.buildAddInv = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classifications = await utilities.buildAddInvSelect()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classifications,
    errors: null,
  })
}

/***********************
 *  Add Inventory
 ***********************/

invCont.addInv = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
  const { inv_image, inv_thumbnail } = req.files || {}
  let inv_img_url = ''
  let inv_thumbnail_url = ''
  if (!inv_image) {
    inv_img_url = `/images/vehicles/no-image.png`
  } else {
    inv_img_url = `/images/vehicles/${inv_image.name}`
    await inv_img.mv(inv_img_url, function (err) {
      if (err) {
        console.log(err)
        req.flash(`notice`, `Sorry, there was an error processing the request.`)
        res.redirect("/inv/add-inventory")
      }
    })
  }

  if (!inv_thumbnail) {
    inv_thumbnail_url = `/images/vehicles/no-image-tn.png`
  } else {
    inv_thumbnail_url = `/images/vehicles/${inv_thumbnail.name}`
    await inv_thumbnail.mv(inv_thumbnail_url, function (err) {
      if (err) {
        console.log(err)
        req.flash(`notice`, `Sorry, there was an error processing the request.`)
        res.redirect("/inv/add-inventory")
      }
    })
  }
  const result = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_img_url, inv_thumbnail_url, inv_price, inv_miles, inv_color, classification_id)
  if (result) {
    req.flash(`notice`, `Inventory added.`)
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash(`notice`, `Sorry, there was an error processing the request.`)
    res.status(500).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/***********************
 *  Edit Inventory
 ***********************/

invCont.buildEditInv = async function (req, res, next) {
  const { invId } = req.params
  const nav = await utilities.getNav()
  const data = await invModel.getInventoryById(invId)
  const classificationSelect = await utilities.buildAddInvSelect(data[0].classification_id)
  const name = data[0].inv_make + " " + data[0].inv_model
  if (data.length < 1) {
    req.flash(`notice`, `Sorry, we could not find that vehicle.`)
    res.redirect("/inv")
  } else {
    res.render("./inventory/edit-inventory", {
      title: "Edit " + name,
      nav,
      classificationSelect,
      errors: null,
      inv_id: invId,
      inv_make: data[0].inv_make,
      inv_model: data[0].inv_model,
      inv_year: data[0].inv_year,
      inv_description: data[0].inv_description,
      inv_image: data[0].inv_image,
      inv_thumbnail: data[0].inv_thumbnail,
      inv_price: data[0].inv_price,
      inv_miles: data[0].inv_miles,
      inv_color: data[0].inv_color,
      classification_id: data[0].classification_id,
    })
  }
}

/***********************
 *  Update Inventory
 ***********************/

invCont.updateInv = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
  const { inv_image, inv_thumbnail } = req.files || {}
  let inv_img_url = ''
  let inv_thumbnail_url = ''
  if (!inv_image) {
    inv_img_url = `/images/vehicles/no-image.png`
  } else {
    inv_img_url = `/images/vehicles/${inv_image.name}`
    await inv_img.mv(inv_img_url, function (err) {
      if (err) {
        console.log(err)
        req.flash(`notice`, `Sorry, there was an error processing the request.`)
        res.redirect("/inv/add-inventory")
      }
    })
  }

  if (!inv_thumbnail) {
    inv_thumbnail_url = `/images/vehicles/no-image-tn.png`
  } else {
    inv_thumbnail_url = `/images/vehicles/${inv_thumbnail.name}`
    await inv_thumbnail.mv(inv_thumbnail_url, function (err) {
      if (err) {
        console.log(err)
        req.flash(`notice`, `Sorry, there was an error processing the request.`)
        res.redirect("/inv/add-inventory")
      }
    })
  }
  const updateResult = await invModel.updateInventory( inv_id, inv_make, inv_model, inv_year, inv_description, inv_img_url, inv_thumbnail_url, inv_price, inv_miles, inv_color, classification_id)
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


module.exports = invCont