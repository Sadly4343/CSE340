const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .matches(/^[a-zA-z\s]+$/)
            .withMessage("Please provide a correct make"),

        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .matches(/^[a-zA-z\s]+$/)
            .withMessage("Please provide a correct model"),

        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 4, max: 4 })
            .withMessage("Year is only 4 numbers required")
            .matches(/^[0-9]+$/)
            .withMessage("Please provide a correct year"),

        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1, max: 50 })
            .withMessage("Description is maximum 50 letters")
            .matches(/^[a-zA-Z0-9\s]+$/)
            .withMessage("Please provide a correct description"),

        body("inv_image")
            .trim()
            .notEmpty()
            .matches(/^\/?images\/vehicles\/[a-zA-Z0-9_\-]+\.(jpg|jpeg|png|gif)$/)
            .withMessage("Please provide a correct image"),

        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .matches(/^\/?images\/vehicles\/[a-zA-Z0-9_\-]+\.(jpg|jpeg|png|gif)$/)
            .withMessage("Please provide a correct thumbnail"),
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isFloat({ min: 0 })
            .withMessage("Please provide a correct price"),
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isInt({ min: 0 })
            .withMessage("Please provide a correct miles"),
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .matches(/^[a-zA-z0-9]+$/)
            .withMessage("Please provide a correct color"),
    ]
}

validate.checkinventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList();
        res.render("inventory/addinventory", {
            errors,
            title: "addInventory",
            nav,
            inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classificationList
        })
        return;
    }
    next();
};

validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList();
        res.render("inventory/edit-inventory", {
            errors,
            title: "EditInventory",
            nav,
            inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classificationList, inv_id
        })
        return;
    }
    next();
};




module.exports = validate