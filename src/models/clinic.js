const mongoose = require("../db/database");
const Schema = mongoose.Schema;
const clinicSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
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
const Clinic = mongoose.model('clinic', clinicSchema);
module.exports = Clinic;