const express = require("express");
const cors = require("cors");
const reminderRoutes = require("./routes/reminderRoutes");
const { startReminderJob } = require("./jobs/reminderJob");
const { PORT } = require("./config/env");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "rentmate-backend" });
});

app.use("/api/reminders", reminderRoutes);

app.listen(PORT, () => {
  console.log(`[backend] running on http://localhost:${PORT}`);
  startReminderJob();
});

