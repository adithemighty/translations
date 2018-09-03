const express = require("express");
const router = express.Router();
const Translator = require("../models/Translator");

router.get("/meeting-create", (req, res) => {
    res.render("meeting-create");
});

// router.get("/update-book/:id", (req, res) => {
//     const { id } = req.params;
//     Book.findById(id).then(book => {
//         res.render("update-book", { book });
//     });
// });

// router.get("/book/:id", (req, res) => {
//     Book.findById(req.params.id)
//         .then(book => {
//             res.render("book-details", { book });
//         })
//         .catch(console.error);
// });

router.post("/meeting-create/:id", (req, res) => {
    const { id } = req.params;
    const { date, time, translator_mail } = req.body;
    const translatorID = Translator.find({ email: translator_mail }).then(translator => {});
    console.log(translatorID);
    new Meeting({
        date,
        time,
        wo: id
    })
        .save()
        .then(meeting => {
            res.render("meeting", { meeting, new: true });
        });
});

module.exports = router;
