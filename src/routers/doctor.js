const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctor");
const { validationResult } = require("express-validator/check");
const { validate_doctor } = require("../middleware/validate_doctor");
router.post("/", validate_doctor(), (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
  } else {
    var doctor = new Doctor();
    doctor.first_name = req.body.first_name;
    doctor.last_name = req.body.last_name;
    doctor.address = req.body.address;
    doctor.contact_no = req.body.contact_no;
    doctor.about = req.body.about;
    doctor.save().then((doctor_details) => {
      res.status(201).send(doctor_details);
    }).catch((error) => {
      res.status(400).send(error);
    })
  }
})

router.get("/:id", (req, res) => {
  const id = req.params.id;
  Doctor.findById({ _id: id }).then((doctor) => {
    res.json({
      status: "success",
      message: "Doctor details retrieved successfully",
      data: doctor
    });
  }).catch((error) => {
    res.json({
      status: "error",
      message: error,
    });
  });
});

module.exports = router;