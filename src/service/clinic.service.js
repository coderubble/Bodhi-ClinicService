const Clinic = require("../models/clinic");
var ObjectId = require('mongodb').ObjectID;
exports.insertClinicDetails = async function ({ name, email_id, street, city, postcode, contact_no, about, doctors }, callback) {
  var clinic = new Clinic();
  clinic.name = name;
  clinic.email_id = email_id;
  clinic.street = street;
  clinic.city = city;
  clinic.postcode = postcode;
  clinic.contact_no = contact_no;
  clinic.about = about;
  clinic.doctors = doctors.map(doctor => {
    const { first_name, last_name, joining_date, address, contact_no, about, schedule } = doctor;
    return {
      first_name,
      last_name,
      joining_date,
      address,
      contact_no,
      about,
      schedule
    };
  });
  await clinic.save().then((clinic_details) => {
    callback(null, clinic_details);
  }).catch((error) => {
    callback(error);
  });
};

exports.getClinicDetails = async function (callback) {
  await Clinic.find().select({ "name": '1' }).skip(0).limit(10).exec(function (error, clinic) {
    if (error) callback(error);
    callback(null, clinic);
  });
};

exports.getAllClinicNames = async function (callback) {
  await Clinic.find().select({ "name": '1', "postcode": '1' }).exec(function (error, clinic) {
    if (error) callback(error);
    callback(null, clinic);
  })
}

exports.getClinicDetailsByName = async function (name, callback) {
  await Clinic.find({ name: { $regex: name, $options: 'i' } }).skip(0).limit(10).select({ "name": 1 }).exec(function (error, clinic) {
    if (error) callback(error);
    callback(null, clinic);
  });
};

exports.getSchedule = async function ({ clinic_id, doctor_id }, callback) {
  await Clinic.find({ "_id": ObjectId(clinic_id) }).select({ "doctors._id": 1, "doctors.schedule": 1, "doctors.joining_date": 1 }).exec(function (error, clinic) {
    if (clinic) {
      const drDetails = clinic[ 0 ].doctors.find(doctor => doctor._id == doctor_id);
      callback(null, drDetails);
    } else {
      console.log(`Error:${JSON.stringify(error)}`);
      callback({ message: `Error Retrieving Doctor Schedule: ${error}` });
    }
  });
};