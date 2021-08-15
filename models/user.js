const mongoose = require("mongoose");
const Weather = require("./weather");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    uniqe: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
  searches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Weather",
    },
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

userSchema.pre("remove", async function (next) {
  await Weather.deleteMany({ _id: { $in: this.searches } });
  next();
});

module.exports = mongoose.model("User", userSchema);
