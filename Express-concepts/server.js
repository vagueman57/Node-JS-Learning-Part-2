require('dotenv').config();
const express = require("express");
const {configureCors} = require("./config/corsConfig"); 
const {requestLogger, addTimeStamp} = require("../middleware/customMiddleware");
// const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// express json middleware
app.use(requestLogger);
app.use(addTimeStamp);

app.use(configureCors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`server is now running on PORT ${PORT}`);
})