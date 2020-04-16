const { check } = require("express-validator/check");

exports.validate_clinic = () => [
  check("name", "Please provide name of the Clinic").exists(),
  check("address", "Please provide address").exists(),
  check("contact_no", "Please provide Contact Number").exists()
];