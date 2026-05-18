const router = require("express").Router();

const { layTatCaTranh, taoTranh } = require("../controllers/tranh.controller");

router.get("/", layTatCaTranh);
router.post("/", taoTranh);

module.exports = router;
