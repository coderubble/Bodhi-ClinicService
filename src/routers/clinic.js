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
    clinic.email_id = req.body.email_id;
    clinic.street = req.body.street;
    clinic.city = req.body.city;
    clinic.postcode = req.body.postcode;
    clinic.contact_no = req.body.contact_no;
    clinic.about = req.body.about;
    clinic.save().then((clinic_details) => {
      res.status(201).send(clinic_details);
    }).catch((error) => {
      res.status(400).send(error);
    })
  }
})

router.get("/", (req, res) => {
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

router.get("/name/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  Clinic.find({ name }).then((clinic) => {
    res.send(clinic);
  }).catch((error) => {
    res.status(400).send({ message: error.message || "Error occurred while retrieving clinic data." });
  });
});

router.get("/street/:street", (req, res) => {
  const street = req.params.street;
  Clinic.find({ street }).then((clinic) => {
    res.send(clinic);
  }).catch((error) => {
    res.status(400).send({ message: error.message || "Error occurred while retrieving clinic data." });
  });
});

router.put("/", validate_clinic(), (req, res) => {
  Clinic.findOneAndUpdate({ name: req.body.name }, { address: req.body.address, contact_no: req.body.contact_no, about: req.body.about }).then((clinic_details) => {
    res.status(201).send(clinic_details);
  }).catch((error) => {
    res.status(400).send(error);
  })
})
module.exports = router;