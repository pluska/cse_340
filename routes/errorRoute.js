const express = require("express")
const errorController = require("../controllers/errorController")
const router = new express.Router()

router.get("/", errorController.error)

module.exports = router