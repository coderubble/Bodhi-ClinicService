const express = require("express");
const router = express.Router();
const clinic = require("./clinic");
const doctor = require("./doctor");

router.use("/clinic", clinic);
router.use("/doctor", doctor);
module.exports = router;