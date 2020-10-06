const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();

// Middlewares
app.use(cors());

// Routes
app.use("/api", require("./routes"));

app.listen(1802, () => console.log("server listening"));
