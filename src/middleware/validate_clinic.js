const { check } = require("express-validator/check");

exports.validate_clinic = () => [
  check("name", "Please provide name of the Clinic").exists(),
  check("email_id", "Please provide email-id").exists().isEmail(),
  check("street", "Please provide Street Name/No.").exists(),
  check("city", "Please provide City").exists(),
  check("postcode", "Please provide Postal Code").exists(),
  check("contact_no", "Please provide Contact Number").exists(),
];