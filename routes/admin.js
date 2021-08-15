const router = require("express").Router();
const controller = require('../controllers/admin')

router.get("/:adminId/getUsers", controller.getUsers);
router.post('/createAdmin', controller.createAdmin)
router.delete("/:adminId/deleteUser/:id", controller.deleteUser);

module.exports = router;
