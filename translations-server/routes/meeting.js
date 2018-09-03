const express = require("express");
const router = express.Router();

router.get("/meeting-create", (req, res) => {
    res.render("meeting-create");
});

module.exports = router;
