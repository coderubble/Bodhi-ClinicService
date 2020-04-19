const express = require("express");
const router = express.Router();
const clinic = require("./clinic");

router.use("/clinic", clinic);
module.exports = router;