const express = require("express");
const controllers = require("../controllers/controllers.js");

const router = express.Router();

//Authentication routes

router.post("/login", controllers.login);

router.post("/register", controllers.register);

router.get("/dashboard/:id", controllers.dashboard);

//Email routes

router.get("/mail/user/:email", controllers.getUser);

router.post("/mail/send", controllers.sendMail);

router.get("/mail/drafts/:email", controllers.getDrafts);

router.get("/mail/search/:search", controllers.searchMail);

module.exports = router;
