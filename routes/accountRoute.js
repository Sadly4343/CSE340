// Needed Resources 
const express = require("express")
const utilities = require("../utilities")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/account", utilities.handleErrors(accountController.buildAccountManagement));

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.get("/", utilities.handleErrors(accountController.buildAccountManagement))

router.get("/update", utilities.handleErrors(accountController.buildAccountUpdate))

router.get("/logout", utilities.handleErrors(accountController.logout));


// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)
router.post("/update/", regValidate.updateUserRules(), regValidate.checkUserData, utilities.handleErrors(accountController.updateAccount))

router.post("/update-password", regValidate.passwordRules(), regValidate.checkPasswordData, utilities.handleErrors(accountController.updatePassword))

module.exports = router;