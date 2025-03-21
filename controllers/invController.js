const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}
invCont.buildByCarId = async function (req, res, next) {
    const car_Id = req.params.carId
    console.log("Car ID: ", car_Id)
    const data = await invModel.getInventoryByCarId(car_Id)
    console.log("Data from Model:", data)
    const card = await utilities.buildClassificationCard([data])
    let nav = await utilities.getNav()
    const carName = data.inv_make + " " + data.inv_model;
    res.render("./inventory/carview", {
        title: carName + " Details",
        nav,
        card,
    });

}


module.exports = invCont