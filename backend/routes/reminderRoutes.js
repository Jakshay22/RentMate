const express = require("express");
const { runDailyRemindersForUser, runDailyRemindersForAllUsers } = require("../services/reminderService");

const router = express.Router();

router.post("/send", async (req, res) => {
  return res.status(403).json({
    error: "Temporarily removed because of security reason"
  });
});

router.post("/run-all", async (_req, res) => {
  return res.status(403).json({
    error: "Temporarily removed because of security reason"
  });
});

module.exports = router;

