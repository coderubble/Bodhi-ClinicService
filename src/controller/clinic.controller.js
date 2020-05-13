const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator/check");
const { validate_clinic } = require("../middleware/validate_clinic");
const { insertClinicDetails, getClinicDetails, getClinicDetailsByName, getSchedule } = require("../service/clinic.service");
//const { cacheRead, cacheWrite, cacheEvict } = require("../db/cache");

router.post("/", [validate_clinic()], (req, res) => {
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
  } else {
    insertClinicDetails(req.body, (error, result) => {
      if (result) {
        res.status(201).send(result);
      } else {
        res.status(400).send(error);
      }
    })
  }
});

router.get("/", (req, res) => {
  getClinicDetails((error, result) => {
    if (result) {
      res.json({
        status: "success",
        message: "Clinic details retrieved successfully",
        data: result
      });
    } else {
      res.json({
        status: 400,
        message: error,
      });
    }
  })
});

router.get("/name/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  getClinicDetailsByName(name, (error, result) => {
    if (result) {
      res.json({
        status: 200,
        message: "Clinic details retrieved successfully",
        data: result
      });
    } else {
      res.json({
        status: 400,
        message: error,
      });
    }
  })
});

router.get("/schedule/:clinic_id/:doctor_id", (req, res) => {
  getSchedule(req.params, (error, result) => {
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send(error);
    }
  })
});

module.exports = router;