const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}
async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/management", {
        title: "management",
        nav,
        errors: null,
        role: res.locals.role,

    })
}

async function buildAccountUpdate(req, res, next) {

    const userId = res.locals.accountData.account_email;
    const userData = await accountModel.getAccountByEmail(userId)
    let nav = await utilities.getNav();

    res.render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_id: userData.account_id,
        firstName: userData.account_firstname,
        lastName: userData.account_lastname,
        userEmail: userData.account_email,
    });
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    console.log("Request Body:", req.body); // Log the submitted data
    const { account_email, account_password } = req.body
    console.log("Login Attempt:", { account_email, account_password }); // Log the submitted data
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            console.log("Hashed Password from DB:", accountData.account_password);
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

async function updateAccount(req, res, next) {

    console.log("Request Body:", req.body); // Log the request body
    let nav = await utilities.getNav()
    const {
        account_id,
        account_firstname,
        account_lastname,
        account_email,
    } = req.body;

    const updateResult = await accountModel.updateUser(
        account_id,
        account_firstname,
        account_lastname,
        account_email,
    )

    if (updateResult) {
        const itemName = `${account_firstname} ${account_lastname}`;
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/account/update")
    } else {
        const itemName = `${account_firstname} ${account_lastname}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("account/update", {
            title: "Edit " + itemName,
            nav,
            errors: null,
            account_id,
            account_firstname,
            account_lastname,   
            account_email,

        })
    }
}


module.exports = { updateAccount, buildAccountUpdate, buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement }