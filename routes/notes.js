const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
//   obj = {
//     a: "thanos",
//     number: 34,
//   };
  res.send([]);
});

module.exports = router;
