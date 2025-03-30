// Needed Resources 
const utilities = require("../utilities")
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const classValidate = require('../utilities/classification-validation')
const inventoryValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:carId", invController.buildByCarId);

console.log(invController.buildManagement);


router.get("/management", utilities.handleErrors(invController.buildManagement))

router.get("/addclassification", utilities.handleErrors(invController.addClassification))

router.get("/addinventory", utilities.handleErrors(invController.addInventory))

router.post(
    "/addclassification",
    classValidate.classificationRules(),
    classValidate.checkClassData,
    utilities.handleErrors(invController.createClassification)
)
router.post(
    "/addinventory",
    inventoryValidate.inventoryRules(),
    inventoryValidate.checkinventoryData,
    utilities.handleErrors(invController.createInventory)
)


module.exports = router;