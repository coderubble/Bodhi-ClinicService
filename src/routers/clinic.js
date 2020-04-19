const express = require("express");
const router = express.Router();
const Clinic = require("../models/clinic");
const { validationResult } = require("express-validator/check");
const { validate_clinic } = require("../middleware/validate_clinic");
const redis = require("redis");
router.post("/", validate_clinic(), (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
  } else {
    var clinic = new Clinic();
    const body = req.body;
    clinic.name = body.name;
    clinic.email_id = body.email_id;
    clinic.street = body.street;
    clinic.city = body.city;
    clinic.postcode = body.postcode;
    clinic.contact_no = body.contact_no;
    clinic.about = body.about;
    clinic.doctors = body.doctors.map(doctor => {
      const { first_name, last_name, address, contact_no, about } = doctor;
      return {
        first_name,
        last_name,
        address,
        contact_no,
        about
      };
    });
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
      message: error,
    });
  });
});

router.get("/name/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  Clinic.find({ name }).skip(0).limit(10).select({ "name": 1 }).then((clinic) => {
    res.send(clinic);
  }).catch((error) => {
    res.status(400).send({ message: error.message || "Error occurred while retrieving clinic data." });
  });
});

router.get("/city/:city", (req, res) => {
  const city = req.params.city;
  // Clinic.find({ city }).skip(0).limit(10).select({ "name": 1, "city": 1 }).then((clinic) => {
  let client = redis.createClient({ port: 6379, host: "192.168.99.100" });
  client.on('connect', function () {
    console.log("Connected to Redis");
  })

  client.get("clinic", function (err, obj) {
    if (!obj) {
      console.log('Data not in Redis cache');
      client.set("clinic", '', function () {
        console.log('Set key');
      })
      Clinic.find({ city }).skip(0).limit(10).select({ "name": 1, "city": 1 }).then((clinic) => {
        Object.entries(clinic).forEach(([key, value]) => console.log(`>>>>>>${key}: ${value}`));
        client.set("clinic", JSON.stringify(clinic), function (err, reply) {
          if (err) {
            console.log(`Redis set error:${err}`);
          }
          console.log(`Redis data saved:${reply}`);
        })
        res.send(clinic);
      }).catch((error) => {
        res.status(400).send({ message: error.message || "Error occurred while retrieving clinic data." });
      });
    }
    else {
      console.log("From redis cache");
      res.send(JSON.parse(obj));
    }
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