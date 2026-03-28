const express = require("express");
const { runDailyRemindersForUser, runDailyRemindersForAllUsers } = require("../services/reminderService");

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const result = await runDailyRemindersForUser(userId);
    const whatsappSent = result.filter((r) => r.whatsapp?.sent).length;
    return res.json({
      ok: true,
      sent: result.length,
      attempts: result.length,
      whatsappSent,
      result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Failed to send reminders" });
  }
});

router.post("/run-all", async (_req, res) => {
  try {
    const result = await runDailyRemindersForAllUsers();
    return res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Failed to run reminders" });
  }
});

module.exports = router;

