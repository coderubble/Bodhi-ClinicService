const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctor");
const Clinic = require("../models/clinic");
const { validationResult } = require("express-validator/check");
const { validate_doctor } = require("../middleware/validate_doctor");
router.post("/:id", validate_doctor(), async (req, res) => {
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
      const clinic_id = req.params.id;
      console.log(`>>>${clinic_id}`);
      console.log(`>>>>>${doctor_details._id}`);
      Clinic.findOneAndUpdate(
        { _id: req.params.id }, { doctors: doctor_details._id }, { new: true })
        .then(function (err, success) {
          if (err) {
            res.send(err);
          }
          res.status(201);
        })
      // .catch((err) => {
      //   res.status(400).send(err);
      // })
      // res.status(201).send(doctor_details);
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