const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
    return [
        body("classification")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a correct classification"),
    ]
}

validate.checkClassData = async (req, res, next) => {
    const { classification } = req.body
    let errors = []
    errors = classificationRules(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/addClassification", {
            errors,
            title: "addClassification",
            nav,
            classification,
        })
        return
    } next()
}

module.exports = validate