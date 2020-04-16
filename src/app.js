const express = require("express");
const routes=require("./routers/routes")
const app = express();
require("dotenv").config();
const PORT=process.env.PORT;
app.use(express.json());

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
app.use('/',routes);

app.listen(PORT, function () {
  console.log("Server is running at Port " + PORT);
});