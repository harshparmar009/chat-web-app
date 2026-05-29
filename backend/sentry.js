import * as Sentry from "@sentry/node";
import dotenv from "dotenv";

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  enableLogs: true,
  // debug: true,

   integrations: [
    Sentry.httpIntegration(),
    Sentry.expressIntegration(),
  ],

   sendDefaultPii: true,
});

// TEST METRICS
// setInterval(() => {
//   console.log("Sending test metrics...");

//   Sentry.metrics.count("test_requests", 1);

//   Sentry.metrics.gauge(
//     "test_memory_usage",
//     Math.floor(Math.random() * 100)
//   );

//   Sentry.metrics.distribution(
//     "test_response_time",
//     Math.random() * 500
//   );

// }, 5000);

// Sentry.metrics.count('button_click', 1);
// Sentry.metrics.gauge('page_load_time', 150);
// Sentry.metrics.distribution('response_time', 200);
//check if Sentry is configured correctly
// console.log("SENTRY DSN:", process.env.SENTRY_DSN);

export default Sentry;