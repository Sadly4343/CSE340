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
    if (data.length > 0 && data[0].classification_name != undefined) {
        const className = data[0].classification_name;
        res.render("./inventory/classification", {
            title: className + " vehicles",
            nav,
            grid,
        })
    }
    else {
        next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
    }

}

invCont.buildByCarId = async function (req, res, next) {
    const car_Id = req.params.carId
    const data = await invModel.getInventoryByCarId(car_Id)

    if (data != null || data != undefined) {
        const carName = data.inv_year + " " + data.inv_make + " " + data.inv_model;
        const card = await utilities.buildClassificationCard([data])
        let nav = await utilities.getNav()
        res.render("./inventory/carview", {
            title: carName,
            nav,
            card,
        })
    } else {
        next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
    }

}


module.exports = invCont