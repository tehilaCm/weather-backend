const router = require("express").Router();
const controller = require("../controllers/weather");

router.get(
  "/getWeatherByCityForSystem/:cities",
  controller.getWeatherByCityForSystem
);
router.post("/postSearch", controller.postSearch);

module.exports = router;
