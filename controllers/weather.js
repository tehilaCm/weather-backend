const Weather = require("../models/weather");

const weatherRequests = require("../aids/weatherRequests");

module.exports = {
  postSearch: async (req, res) => {
    let search = new Weather(req.body);

    try {
      await search.save();
      res.status(200).json({ weather: search });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getWeatherByCityForSystem: async (req, res) => {
    let cities = req.params.cities;
    cities = cities.split(",");
    let result = null;

    try {
      let resultAllCities = [];
      cities.map(async (city) => {
        result = await weatherRequests.getWeatherByCity(city);
        result = JSON.parse(result);

        let weatherDetails = {
          city,
          temp: result.main.temp,
        };

        resultAllCities.push(weatherDetails);
        if (resultAllCities.length === cities.length)
          res.status(200).json({ resultAllCities });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
