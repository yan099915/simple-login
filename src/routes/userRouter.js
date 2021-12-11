const router = require("express").Router();
const middlewares = require("../middlewares/auth");
const controllers = require("../controllers/authControllers");

// USER
router.post("/register", middlewares.validation, controllers.register);
router.get("/login", controllers.login);
router.get("/", middlewares.authorization, controllers.home);

module.exports = router;
