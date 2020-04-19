const mongoose = require("../db/database");
const uuid=require
const Schema = mongoose.Schema;
const clinicSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  email_id: {
    type: String,
    required: true
  },
  street: {
    type: String,
    lowercase: true,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  postcode: {
    type: Number,
    required: true
  },
  contact_no: {
    type: String,
    required: true
  },
  about: String,
  doctors: [{
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
  }]
})
const Clinic = mongoose.model('clinic', clinicSchema);
module.exports = Clinic;