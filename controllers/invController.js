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

invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList()

    res.render("inventory/management", {
        title: "Management",
        nav,
        errors: null,
        classificationSelect,
    });
}

invCont.addClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("inventory/addclassification", {
        title: "Add Classification",
        nav,
        errors: null,
    });
}

invCont.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/addinventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: null,
    });
}

invCont.createClassification = async function (req, res) {
    let nav = await utilities.getNav();
    const { classification_name } = req.body

    try {
        const classResult = await invModel.addClassification(
            classification_name
        )

        if (classResult) {
            const classificationSelect = await utilities.buildClassificationList();
            req.flash(
                "notice",
                `Congratulations, new ${classification_name} classification added`
            )
            res.status(201).render("inventory/management", {
                title: "Management",
                nav,
                errors: null,
                classificationSelect,
            })
        } else {
            req.flash("notice", "Sorry, the registration failed")
            res.status(501).render("inventory/addclassification", {
                title: "Add Classification",
                nav,
                classification_name,
                errors: null,
            })
        }
    } catch (error) {
        console.error("Error in the createClassification", error)
        req.flash("notice", "Sorry, the classification failed")
        res.status(500).render("inventory/addclassification", {
            title: "Add Classification",
            nav,
            classification_name,
            errors: null,
        });
    }



}
invCont.createInventory = async function (req, res) {
    let nav = await utilities.getNav();
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body


    try {
        const inventoryResult = await invModel.addInventory(
            classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
        )

        if (inventoryResult) {
            const classificationSelect = await utilities.buildClassificationList();
            req.flash(
                "notice",
                `Congratulations, new ${inv_make} vehicle added`
            )
            res.status(201).render("inventory/management", {
                title: "Management",
                nav,
                errors: null,
                classificationSelect,
            })
        } else {
            req.flash("notice", "Sorry, the inventory failed")
            res.status(501).render("inventory/addinventory", {
                title: "Add Inventory",
                nav,
                errors: null,
                classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
            })
        }

    } catch (error) {
        console.error("Error in the createClassification", error)
        req.flash("notice", "Sorry, the inventory failed")
        res.status(500).render("inventory/addinventory", {
            title: "Add Inventory",
            nav,
            classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
            errors: null,
        });

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
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventory = async function (req, res, next) {
    console.log("Request Params:", req.params); // Log the request parameters
    const inv_id = (req.params.inv_id)
    console.log("inv_id", inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByCarId(inv_id)
    const classificationList = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {

    console.log("Request Body:", req.body); // Log the request body
    let nav = await utilities.getNav()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

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
            classification_id,

        })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    console.log("classification_id:", classification_id); // Log the classification_id

    if (isNaN(classification_id)) {
        console.error("Invalid classification_id:", req.params.classification_id); // Log the invalid ID
        return res.status(400).json({ error: "Invalid classification ID" });
    }
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

invCont.deleteView = async function (req, res, next) {
    console.log("Request Params:", req.params); // Log the request parameters
    const inv_id = (req.params.inv_id)
    console.log("inv_id", inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByCarId(inv_id)
    const classificationList = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("inventory/delete-confirm", {
        title: "Edit " + itemName,
        nav,
        classificationList,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}


invCont.deleteInventory = async function (req, res, next) {

    console.log("Request Body:", req.body); // Log the request body

    const inv_id = parseInt(req.body.inv_id)
    let nav = await utilities.getNav()
    const {
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    const deleteResult = await invModel.deleteInventoryItem(
        inv_id,
        inv_make,
        inv_model,
        inv_price,

    )

    if (deleteResult) {
        const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
        req.flash("notice", `The ${itemName} was successfully deleted.`)
        res.redirect("/inv/management")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/delete-confirm", {
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
            classification_id,

        })
    }
}






module.exports = invCont;