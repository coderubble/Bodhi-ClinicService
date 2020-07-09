const express = require("express");
const router = express.Router();
const Clinic = require("../models/clinic");
const { validationResult } = require("express-validator/check");
const { validate_clinic } = require("../middleware/validate_clinic");
const { cacheRead, cacheWrite, cacheEvict } = require("../db/cache");

router.get("/:id", (req, res) => {
  const id = req.params.id;
  console.log(`id:${id}`);
  cacheRead(id, function (err, result) {
    if (!result) {
      Clinic.findById(id).then((clinic) => {
        cacheWrite(id, JSON.stringify(clinic), function (err, reply) {
          // console.log(`cache reply:${reply}`);
          if (err) {
            console.log(`Cache error :${err}`);
          }
          res.send(clinic);
        });
      }).catch((err) => {
        res.status(400).send({ message: err.message || "Error occurred while retrieving clinic data." });
      });
    } else {
      res.send(JSON.parse(result));
    }
  });
});

router.get("/city/:city", (req, res) => {
  const city = req.params.city;
  Clinic.find({ city }).skip(0).limit(10).select({ "name": 1, "city": 1 }).then((clinic) => {
    res.send(clinic);
  }).catch((error) => {
    res.status(400).send({ message: error.message || "Error occurred while retrieving clinic data." });
  });
});

router.put("/", validate_clinic(), (req, res) => {
  const body = req.body;
  const doctors = body.doctors.map((doctor) => {
    const { _id, first_name, last_name, address, contact_no, about, schedule } = doctor;
    return {
      _id,
      first_name,
      last_name,
      address,
      contact_no,
      about,
      schedule
    };
  })

  Clinic.findByIdAndUpdate(req.body._id,
    {
      name: body.name,
      email_id: body.email_id,
      street: body.street,
      city: body.city,
      postcode: body.postcode,
      contact_no: body.contact_no,
      contact_no: body.contact_no,
      about: body.about,
      doctors
    }, {
    new: true
  }).then((clinic_details) => {
    cacheEvict(req.body._id, function (err, result) {
      res.status(201).send(clinic_details);
    })
  }).catch((error) => {
    res.status(400).send(error);
  })
})

module.exports = router;