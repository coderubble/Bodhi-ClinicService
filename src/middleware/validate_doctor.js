const { check } = require("express-validator/check");

exports.validate_doctor = () => [
  check("first_name", "Please provide first name").exists(),
  check("last_name", "Please provide last name").exists(),
  check("address", "Please provide address").exists(),
  check("contact_no", "Please provide Contact Number").exists()
];