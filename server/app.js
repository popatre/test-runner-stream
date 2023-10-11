const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
app.use(cors());
const apiRouter = require("./routes/api-router");

const {
    notARoute,
    errors400,
    psqlErrors,
    methodNotAllowed,
} = require("./controllers/errors.controller");

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", notARoute);
app.use(psqlErrors);
app.use(errors400);
app.use(methodNotAllowed);
module.exports = app;
