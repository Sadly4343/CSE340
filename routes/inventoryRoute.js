// Needed Resources 
const utilities = require("../utilities")
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const classValidate = require('../utilities/classification-validation')
const inventoryValidate = require('../utilities/inventory-validation')
const Util = require("../utilities")



router.get("/", Util.CheckType('Client'), utilities.handleErrors(invController.buildManagement));

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:carId", invController.buildByCarId);



router.get("/addclassification", utilities.handleErrors(invController.addClassification))

router.get("/addinventory", utilities.handleErrors(invController.addInventory))



router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventory));

router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteView));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
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
router.post("/update", utilities.handleErrors(invController.updateInventory))

router.post(
    "/deleteinventory",
    utilities.handleErrors(invController.deleteInventory)
)



module.exports = router;