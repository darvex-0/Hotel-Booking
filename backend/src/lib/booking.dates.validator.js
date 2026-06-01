
/**
 * Custom validator function to check if the array is non-empty, contains valid future dates, and has no duplicates.
 *
 * @param {Array} array - The array of dates to be validated.
 * @returns {boolean} - Returns true if the array contains valid future dates without duplicates, otherwise false.
 */
// Helper to format current date in local YYYY-MM-DD format
const getLocalDateStringForCurrent = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to format booking dates in local/ISO YYYY-MM-DD format without timezone shifts
const getBookingDateString = (d) => {
  if (!d) return '';
  const formatDateObj = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (d instanceof Date) {
    return formatDateObj(d);
  }
  if (typeof d === 'string') {
    // If it's a date-only string (e.g. YYYY-MM-DD), use it directly
    if (d.length === 10 && d.indexOf('-') === 4) {
      return d;
    }
    // If it's a full ISO timestamp string, parse and format in local time
    const parsed = new Date(d);
    if (!isNaN(parsed)) {
      return formatDateObj(parsed);
    }
    return d.split('T')[0];
  }
  try {
    const parsed = new Date(d);
    if (!isNaN(parsed)) {
      return formatDateObj(parsed);
    }
  } catch (e) {
    // ignore
  }
  return '';
};

exports.validateBookingDates = (array) => {
  if (array.length === 0) return false; // Array should not be empty

  const currentDateStr = getLocalDateStringForCurrent();
  const uniqueDates = new Set();

  for (const date of array) {
    const dateStr = getBookingDateString(date);
    if (!dateStr || dateStr < currentDateStr) return false;

    // Check for duplicates
    if (uniqueDates.has(dateStr)) return false;
    uniqueDates.add(dateStr);
  }

  return true;
};

/**
 * Checks various date-related conditions for a given array of date strings.
 *
 * @param {string[]} dateArray - An array of date strings in the format 'YYYY-MM-DD'.
 * @returns {Object} An object containing various date-related conditions:
 *   - isAnyDateInPast: A boolean indicating if any date is in the past.
 *   - earliestDate: The earliest date in the array.
 *   - latestDate: The latest date in the array.
 *   - isEarliestDateOverCurrentDate: A boolean indicating if the earliest date is after the current date.
 *   - isLatestDateOverCurrentDate: A boolean indicating if the latest date is after the current date.
 */
exports.bookingDatesBeforeCurrentDate = (dateArray) => {
  const currentDateStr = getLocalDateStringForCurrent();

  // Check if any date is in the past (before today)
  const isAnyDateInPast = dateArray.some((date) => {
    const dateStr = getBookingDateString(date);
    return dateStr < currentDateStr;
  });

  // Convert dates to formatted strings
  const dateStrings = dateArray.map((date) => getBookingDateString(date)).filter(Boolean);
  
  // Find earliest and latest strings
  const earliestDateStr = dateStrings.reduce((earliest, current) => current < earliest ? current : earliest, dateStrings[0] || '');
  const latestDateStr = dateStrings.reduce((latest, current) => current > latest ? current : latest, dateStrings[0] || '');

  const earliestDate = new Date(earliestDateStr);
  const latestDate = new Date(latestDateStr);

  // Check if the earliest date is before the current date
  const isEarliestDateOverCurrentDate = earliestDateStr < currentDateStr;

  // Check if the latest date is before the current date
  const isLatestDateOverCurrentDate = latestDateStr < currentDateStr;

  return {
    isAnyDateInPast,
    earliestDate,
    latestDate,
    isEarliestDateOverCurrentDate,
    isLatestDateOverCurrentDate
  };
};
