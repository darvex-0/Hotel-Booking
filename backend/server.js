
// imports modules & dependencies
const app = require('./src/app');
const logger = require('./src/middleware/winston.logger');

// app listens to .env defined port or fallback 5000
const PORT = process.env.APP_PORT || 5000;
const BASE_URL = process.env.APP_BASE_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  logger.info(`App server running on: ${BASE_URL}`);
  
  // Run auto-checkout on startup
  const autoCheckoutBookings = require('./src/lib/auto.checkout');
  autoCheckoutBookings();

  // Run auto-checkout every 10 minutes
  setInterval(autoCheckoutBookings, 10 * 60 * 1000);
});

