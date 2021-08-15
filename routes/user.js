const router = require("express").Router();
const controller = require("../controllers/user");
const checkAuth = require("../middlewares/checkAuth");

router.get("/weatherByCity/:city/:userId", checkAuth, controller.weatherByCity);
router.get("/getSearches/:id", checkAuth, controller.getSearches);
router.post("/signIn", controller.signIn);
router.post("/signUp", controller.signUp);
router.delete(
  "/deletSearch/:userId/:searchId",
  checkAuth,
  controller.deletSearch
);
router.delete(
  "/deletAllSearches/:userId/",
  checkAuth,
  controller.deletAllSearches
);

module.exports = router;
