const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
    const nav = await utilities.getNav()

    res.render("index", { title: "Home", nav, loggedin: res.locals.loggedin || false, name: res.locals.name })
}

module.exports = baseController