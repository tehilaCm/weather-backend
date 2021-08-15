const request = require("request");

const getWeatherByCity = (city) => {
  return new Promise((resolve, reject) => {
    let options = {
      method: "GET",
      url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`,
    };

    request(options, (err, res, body) => {
      if (err) reject(err);
      else resolve(body);
    });
  });
};

const postWeatherSearch = (weatherDetails) => {
  return new Promise((resolve, reject) => {
    let options = {
      method: "POST",
      url: "https://weather-app-tehila.herokuapp.com/weather/postSearch",
      json: weatherDetails,
    };

    request(options, (err, body, res) => {
      if (err) reject(err);
      else resolve(body);
    });
  });
};

module.exports = { getWeatherByCity, postWeatherSearch };
