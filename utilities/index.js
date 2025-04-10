const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}
Util.buildClassificationCard = async function (data) {
    let card = "";
    let card1 = "";
    if (data.length > 0) {
        card = '<div id="inv_card">';
        data.forEach(vehicle => {
            card += '<div>'
            card += '<a href="../../inv/detail/' + vehicle.inv_make > '></a>';
            card += '<img src="' + vehicle.inv_image
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /> '
            card1 += '<div id="inv_descrip">'
            card1 += '<h2>' + vehicle.inv_make + " " + vehicle.inv_model + " " + 'Details</h2>';
            card1 += '<p> Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>';
            card1 += '<p> Description: ' + vehicle.inv_description + '</p>';
            card1 += '<p> Color: ' + vehicle.inv_color + '</p>';
            card1 += '<p> Miles: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>';

        })
        card += '</div>'
        card += '</div>'
        card1 += '</div>'
    } else {
        card += '<p class="none"> No matches </p>'
    }
    return card + card1
}


Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<label for="classificationList">Classification: </label><select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''> Choose a Classification </option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id

        ) {
            classificationList += ' selected ';
        }
        classificationList += ">" + row.classification_name + "</option>"

    })
    classificationList += "</select>"
    return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                console.log("Decoded JWT Payload:", accountData); // Log the decoded payload
                res.locals.accountData = accountData;
                res.locals.loggedin = 1;
                res.locals.role = accountData.account_type;
                res.locals.name = accountData.account_firstname;
                res.cookie("logged", true, { maxAge: 3600 * 1000 });
                next()
            })
    } else {
        res.locals.loggedin = 0
        next()
    }
}
Util.CheckType = (checkedType) => {
    return (req, res, next) => {
        if (res.locals.role !== checkedType) {
            console.log(checkedType);
            req.flash("Notice", "No Permissions")
            return res.redirect("/account/");
        }
        next();
    }
}


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util