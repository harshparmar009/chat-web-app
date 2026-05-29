import Sentry from "../sentry.js";

let activeRequests = 0;

const sentryMetrics = (req, res, next) => {

  activeRequests++;

  Sentry.metrics.gauge(
    "active_requests_live",
    activeRequests,
    {
      route: req.originalUrl,
      method: req.method,
    }
  );

  console.log(
    "OPEN:",
    activeRequests,
    req.method,
    req.originalUrl
  );

  res.on("finish", () => {

    activeRequests--;

    Sentry.metrics.gauge(
      "active_requests_live",
      activeRequests,
      {
        route: req.originalUrl,
        method: req.method,
      }
    );

    console.log(
      "CLOSE:",
      activeRequests,
      req.method,
      req.originalUrl
    );
  });

  next();
};

export default sentryMetrics;