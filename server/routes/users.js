const router = require("express").Router();
const usersController = require("../controllers/users");

router.get("/", usersController.getAll);
router.post("/", usersController.taoTaiKhoan);

module.exports = router;
