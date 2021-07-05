const express = require("express");
const dotenv = require("dotenv");

//importing the database config file
require("./dbConfig/dbConnetion");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const indexRouter = require("./route/index");
app.use("/", indexRouter);
app.listen(PORT, () => console.log(`App running on PORT ${PORT}`));
