const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Admin = require("../models/admin");
const Weather = require("../models/weather");
const weatherRequests = require("../aids/weatherRequests");
const mails = require("../aids/mails");

module.exports = {
  weatherByCity: async (req, res) => {
    let city = req.params.city;
    let userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User ID was'nt found" });

    try {
      let result = await weatherRequests.getWeatherByCity(city);
      result = JSON.parse(result);

      let weatherDetails = {
        city,
        temp: result.main.temp,
        feelsLike: result.main.feels_like,
        tempMin: result.main.temp_min,
        tempMax: result.main.temp_max,
        pressure: result.main.pressure,
        humidity: result.main.humidity,
        wind: { speed: result.wind.speed, deg: result.wind.deg },
        searchedBy: userId,
      };

      result = await weatherRequests.postWeatherSearch(weatherDetails);

      await User.findByIdAndUpdate(userId, {
        $push: { searches: result.body.weather._id },
      });

      res.status(200).json({ result: result.body, weatherDetails });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getSearches: async (req, res) => {
    try {
      let user = await User.findById(req.params.id).populate("searches");
      if (!user)
        return res.status(404).json({ message: "User id wasn't found" });

      res.status(200).json({ searches: user.searches });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  signIn: async (req, res) => {
    const { email, password } = req.body;

    let users = await User.find({ email });
    if (users.length === 0)
      return res.status(401).json({ message: "Authentication faild" });

    const [user] = users;

    bcrypt.compare(password, user.password, async (error, result) => {
      if (error)
        return res.status(401).json({ message: "Authentication faild" });

      if (result) {
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );
        return res
          .status(200)
          .json({ message: "Authentication succeeded!", token });
      }
      return res.status(401).json({ message: "Authentication faild" });
    });
  },
  signUp: async (req, res) => {
    const { email, password } = req.body;

    try {
      let users = await User.find({ email });

      if (users.length > 0)
        return res.status(409).json({ message: "Email exist" });

      bcrypt.hash(password, 10, async (error, hash) => {
        if (error) return res.status(500).json({ error: error.message });

        const newUser = new User({
          email,
          password: hash,
        });

        try {
          const user = await newUser.save();
          const admins = await Admin.find();
          let lowestUsersAdmin = admins[0]._id;
          let lowestValue = admins[0].users.length;

          for (let i = 0; i < admins.length; i++) {
            if (admins[i].users.length < lowestValue) {
              lowestValue = admins[i].users.length;
              lowestUsersAdmin = admins[i]._id;
            }
          }

          await Admin.findByIdAndUpdate(lowestUsersAdmin, {
            $push: { users: user._id },
          });
          await User.findByIdAndUpdate(user._id, { admin: lowestUsersAdmin });

          const token = jwt.sign(
            {
              id: user._id,
              email: user.email,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );

          // await mails.sendEmail(email);

          res.status(200).json({ message: "User created", token });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deletSearch: async (req, res) => {
    let userId = req.params.userId;
    let searchId = req.params.searchId;
    try {
      let user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: "User ID wasn't found" });
      let searchWeather = await Weather.findById(searchId);
      if (!searchWeather)
        return res.status(404).json({ message: "Weather search was'nt found" });
      await User.findByIdAndUpdate(userId, { $pull: { searches: searchId } });
      await Weather.findByIdAndRemove(searchId);
      res.status(200).json({ message: "Weather search was deleted!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deletAllSearches: async (req, res) => {
    let userId = req.params.userId;
    try {
      let user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: "User ID wasn't found" });

      const searches = user.searches;
      searches.map(async (search) => {
        try {
          await Weather.findByIdAndRemove(search);
        } catch (error) {
          console.log(error);
        }
      });

      await User.findByIdAndUpdate(userId, { searches: [] });
      res.status(200).json({ message: "History was cleared!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
