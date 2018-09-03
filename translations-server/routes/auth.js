const express = require("express");
const passport = require("passport");
const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");
const fs = require("fs");
// const User = require("../models/user");
const fileUpload = require("express-fileupload");

router.get("/login", ensureLoggedOut(), (req, res) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  ensureLoggedOut(),
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/signup/:role", (req, res) => {
  console.log(req.params);
  if (req.params.role === "wo") {
    res.render("auth/signup", {
      // message: req.flash("error"),
      wo: true
    });
  } else if (req.params.role === "translator") {
    res.render("auth/signup", {
      // message: req.flash("error"),
      translator: true
    });
  }
});

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
  })
);

router.get("/logout", ensureLoggedIn("/login"), (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
