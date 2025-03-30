const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .matches(/^[a-zA-z0-9\s]+$/)
            .withMessage("Please provide a correct classification"),
    ]
}

validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/addclassification", {
            errors,
            title: "addClassification",
            nav,
            classification_name,
        })
        return;
    }
    next();
};

module.exports = validate