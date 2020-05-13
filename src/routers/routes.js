const express = require("express");
const router = express.Router();
const clinic = require("../controller/clinic.controller");
router.use("/clinic", clinic);
module.exports = router;