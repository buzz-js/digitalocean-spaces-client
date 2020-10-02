const express = require("express");
const app = express();

// Static files
app.use(express.static('public'));

// Routes
app.use(require("./routes"));

app.listen(1802, () => console.log("server listening"));
