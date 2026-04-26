
const getDateAfterDuration = (duration) => {
  const currentDate = new Date();
  const parts = duration.match(/(\d+)([dhms])/);
  if (!parts) return null;

  const amount = parseInt(parts[1], 10);
  const unit = parts[2];
  let multiplier;

  switch (unit) {
    case 'd':
      multiplier = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      break;
    case 'h':
      multiplier = 60 * 60 * 1000; // 1 hour in milliseconds
      break;
    case 'm':
      multiplier = 60 * 1000; // 1 minute in milliseconds
      break;
    case 's':
      multiplier = 1000; // 1 second in milliseconds
      break;
    default:
      return null;
  }

  const futureDate = new Date(currentDate.getTime() + amount * multiplier);
  return futureDate;
};

module.exports = getDateAfterDuration;
