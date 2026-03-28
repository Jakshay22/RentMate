const cron = require("node-cron");
const { runDailyRemindersForAllUsers } = require("../services/reminderService");

const startReminderJob = () => {
  // Runs every day at 09:00 local server time
  cron.schedule("0 9 * * *", async () => {
    try {
      const result = await runDailyRemindersForAllUsers();
      console.log("[cron] reminders completed", result);
    } catch (error) {
      console.error("[cron] reminder job failed", error);
    }
  });
};

module.exports = { startReminderJob };

