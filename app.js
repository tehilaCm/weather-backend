const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const weatherRoutes = require("./routes/weather");
const userRoutes = require("./routes/user");

const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json());

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.DB_CONNECTION, connectionParams)
  .then(() => {
    app.listen(4000, () => console.log("App is up and running on port 4000"));
  })
  .catch((err) => {
    console.log(err);
  });

mongoose.set("useFindAndModify", false);

app.use("/admin", adminRoutes);
app.use("/weather", weatherRoutes);
app.use("/user", userRoutes);
