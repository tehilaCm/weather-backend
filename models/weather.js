const mongoose = require("mongoose");

const weatherSchema = mongoose.Schema({
  city: String,
  temp: Number,
  feelsLike: Number,
  tempMin: Number,
  tempMax: Number,
  pressure: Number,
  humidity: Number,
  wind: {
    speed: Number,
    deg: Number,
  },
  searchedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Weather", weatherSchema);
