const mongoose = require("../db/database");
const Schema = mongoose.Schema;
const doctorSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true
  },
  contact_no: {
    type: String,
    required: true
  },
  about: String
})
const Doctor = mongoose.model('doctor', doctorSchema);
module.exports = Doctor;