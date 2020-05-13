const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
mongoose.set('debug', process.env.DEBUG_QUERY);
module.exports = mongoose;