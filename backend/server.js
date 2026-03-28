const express = require("express");
const cors = require("cors");
const reminderRoutes = require("./routes/reminderRoutes");
const { startReminderJob } = require("./jobs/reminderJob");
const { PORT } = require("./config/env");

const app = express();

// Reflect request Origin so deployed frontends (any HTTPS URL) are allowed
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "rentmate-backend" });
});

app.use("/api/reminders", reminderRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[backend] listening on port ${PORT}`);
  startReminderJob();
});

