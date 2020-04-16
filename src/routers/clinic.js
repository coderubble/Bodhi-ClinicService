const express = require("express");
const router = express.Router();
const Clinic = require("../models/clinic");
const { validationResult } = require("express-validator/check");
const { validate_clinic } = require("../middleware/validate_clinic");
router.post("/", validate_clinic(), (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
  } else {
    var clinic = new Clinic();
    clinic.name = req.body.name;
    clinic.address = req.body.address;
    clinic.contact_no = req.body.contact_no;
    clinic.about = req.body.about;
    clinic.save().then((clinic_details) => {
      res.status(201).send(clinic_details);
    }).catch((error) => {
      res.status(400).send(error);
    })
  }
})

router.get("/", validate_clinic(), (req, res) => {
  Clinic.find().then((clinic) => {
    res.json({
      status: "success",
      message: "Clinic details retrieved successfully",
      data: clinic
    });
  }).catch((error) => {
    res.json({
      status: "error",
      message: err,
    });
  });
});

router.put("/", (req, res) => {
  Clinic.findOneAndUpdate({ name: req.body.name }, { address: req.body.address, contact_no: req.body.contact_no, about: req.body.about }).then((clinic_details) => {
    res.status(201).send(clinic_details);
  }).catch((error) => {
    res.status(400).send(error);
  })
})
module.exports = router;