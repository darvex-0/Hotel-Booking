const Booking = require('../models/booking.model');
const Room = require('../models/room.model');
const Review = require('../models/review.modal');
const { bookingDatesBeforeCurrentDate } = require('./booking.dates.validator');
const logger = require('../middleware/winston.logger');

/**
 * Automatically checks all 'approved' bookings. If the booking dates have passed
 * (i.e. the checkout date has arrived/passed), updates the booking status to 'in-reviews'
 * or 'completed' and sets the room status back to 'available'.
 */
const autoCheckoutBookings = async () => {
  try {
    const approvedBookings = await Booking.find({ booking_status: 'approved' });
    let checkoutCount = 0;

    for (const booking of approvedBookings) {
      if (!booking.booking_dates || booking.booking_dates.length === 0) continue;

      const { isLatestDateOverCurrentDate } = bookingDatesBeforeCurrentDate(booking.booking_dates);

      if (isLatestDateOverCurrentDate) {
        // Check if the user has already submitted a review for this room
        const userId = booking.user_id || booking.booking_by;
        const existingReview = await Review.findOne({
          user_id: userId,
          room_id: booking.room_id
        });

        if (existingReview) {
          booking.booking_status = 'completed';
        } else {
          // 1. Update booking status to 'in-reviews'
          booking.booking_status = 'in-reviews';
        }
        await booking.save({ validateBeforeSave: false });

        // 2. Revert the room status to 'available'
        const room = await Room.findById(booking.room_id);
        if (room) {
          room.room_status = 'available';
          await room.save({ validateBeforeSave: false });
        }

        checkoutCount++;
        logger.info(`Auto-checkout: Booking ID ${booking.id} has been checked out. Room '${room?.room_name}' is now available.`);
      }
    }

    if (checkoutCount > 0) {
      logger.info(`Auto-checkout process complete: ${checkoutCount} bookings checked out.`);
    }
  } catch (error) {
    logger.error('Error during auto-checkout process:', error);
  }
};

module.exports = autoCheckoutBookings;
