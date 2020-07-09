const express = require("express");
const router = express.Router();
const Clinic = require("../models/clinic");
const { validationResult } = require("express-validator/check");
const { validate_clinic } = require("../middleware/validate_clinic");
const { insertClinicDetails, getClinicDetails, getClinicDetailsByName, getSchedule, getAllClinicNames, getDoctorData } = require("../service/clinic.service");
const { cacheRead, cacheWrite, cacheEvict, cacheReadByPattern, cacheWriteAll } = require("../db/cache");
const { ObjectID } = require("mongodb");

// Insert New Clinic
router.post("/", [ validate_clinic() ], (req, res) => {
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

// View All Clinics
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

//View Clinic Details by ID & write to cache with ID as key
router.get("/id/:id", (req, res) => {
  const id = req.params.id;
  console.log(`id:${id}`);
  cacheRead(id, function (err, result) {
    if (!result) {
      Clinic.findById(id).then((clinic) => {
        cacheWrite(id, JSON.stringify(clinic), function (err, reply) {
          if (err) {
            console.log(`Cache error :${err}`);
          }
          res.send(clinic);
        });
      }).catch((err) => {
        res.status(400).send({ message: err.message || "Error occurred while retrieving clinic data." });
      });
    } else {
      // console.log(`Cache Result:${result}`);
      res.send(JSON.parse(result));
    }
  });
});

//View Dr schedule by Clinic ID  & Dr ID
router.get("/schedule/:clinic_id/:doctor_id", (req, res) => {
  getSchedule(req.params, (error, result) => {
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send(error);
    }
  })
});

/* To pre-load all Clinic Names|Postcode with value ClinicId to Redis Cache */
router.get("/loadCache/", (req, res) => {
  getAllClinicNames((err, result) => {
    if (err) res.status(400).send({ message: err.message || "Error occurred while retrieving clinic names." });
    result.map(clinic => {
      const key = clinic.name + ',' + clinic.postcode;
      cacheWriteAll(key, clinic._id.toString(), function (err, reply) {
        if (err) {
          console.log(`Cache error :${err}`);
        }
      })
    })
    res.send(result);
  });
});

/* To pre-load all ClinicNames & their corresponding Clinic ID */
router.get("/loadClinic/toCache", (req, res) => {
  getClinicDetails((err, result) => {
    if (err) res.status(400).send({ message: err.message || "Error occurred while retrieving clinic names." });
    result.map(clinic => {
      const key = clinic._id
      cacheWriteAll(ObjectID(key).toString(), clinic.name, function (err, reply) {
        if (err) {
          console.log(`Cache error :${err}`);
        }
      })
    })
    res.send(result);
  });
});

/* To pre-load all Doctor Names & their corresponding Doctor  ID */
router.get("/loadDoctor/toCache", (req, res) => {
  getDoctorData((err, result) => {
    if (err) res.status(400).send({ message: err.message || "Error occurred while retrieving clinic names." });
    result.map(doctor => {
      doctor.map(d => {
        const key = d._id;
        const value = d.first_name + ' ' + d.last_name;
        // console.log(`key:${key}>>>>${value}`);
        cacheWriteAll(ObjectID(key).toString(), value, function (err, reply) {
          if (err) {
            console.log(`Cache error :${err}`);
          }
          console.log(reply);
        })
      })
    })
    res.send(result);
  });
});

/* To read preloaded ClinicName|Postcode from Cache on Search by name (Pattern) */

router.get("/readFromCache/:clinic_name", (req, res) => {
  cacheReadByPattern(req.params.clinic_name, function (err, result) {
    if (err) res.status(400).send({ message: err.message || "Error occurred while retrieving clinic names." });
    res.send(result.map(data => {
      // console.log(`Data:${JSON.stringify(data)}`)
      return data
    }));
  })
});

/* To read preloaded ClinicName from Cache by CLinic ID */

router.get("/readClinicName/:clinic_id", (req, res) => {
  console.log(`clinic id:${req.params.clinic_id}`);
  cacheRead(req.params.clinic_id, function (err, result) {
    // console.log(`result:${JSON.stringify(result)}`)
    if (err) res.status(400).send({ message: err.message || "Error occurred while retrieving clinic names." });
    res.send(result);
  })
});

module.exports = router;