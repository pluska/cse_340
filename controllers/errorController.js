const utilities = require("../utilities")

const errorController = {}

errorController.error = async function (req, res, next) {
  try {
    throw new Error('Sorry, something went wrong.');
  } catch (error) {
    next(error);
  }
}

module.exports = errorController