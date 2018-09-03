const express = require("express");
const router = express.Router();
const Translator = require("../models/Translator");
const Meeting = require("../models/Meeting");

const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

// app.get("/settings", ensureLoggedIn("/login"), function(req, res) {
//     res.render("settings", { user: req.user });
// });


// TODO Test, if meeting-create works if logged in as WO

router.get("/meeting-create", ensureLoggedIn("/login"), function(req, res) {
    console.log("Req User " + req.user);
    if (!req.user.role) {
        // WO has no role, so if there's none, it has to be WO!
        res.render("meeting-create");
    } else {
        res.render("auth/login");
    }
});

// TODO test params that route gets, works!

router.post("/meeting-create/:id", (req, res) => {
    const { id } = req.params;
    console.log("WO ID " + id);
    const { date, time, translator_mail } = req.body;
    let translatorId;
    Translator.find({ email: translator_mail }).then(translator => {
        translatorId = translator[0]._id;

        new Meeting({
            date,
            time,
            wo: id,
            translator: translatorId
        })
            .save()
            .then(meeting => {
                res.render("meeting", { meeting, new: true });
            });
    });
});

module.exports = router;
