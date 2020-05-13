const { check } = require("express-validator/check");

exports.validate_doctor = () => [
  check("first_name", "Please provide Doctor's first name").exists(),
  check("last_name", "Please provide Doctor's last name").exists(),
  check("joining_date", "Please provide Doctor's first name").exists(),
  check("address", "Please provide Doctor's address").exists(),
  check("contact_no", "Please provide Doctor's Contact Number").exists()
];