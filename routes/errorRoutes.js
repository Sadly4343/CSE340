const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");

router.get("/500", errorController.testError);

module.exports = router;