
const nodemailer = require('nodemailer');
const logger = require('../middleware/winston.logger');

/**
 * Send booking status notification email (standalone, does not send HTTP response)
 * @param {Object} user - User object with email, fullName
 * @param {string} bookingStatus - The new booking status ('approved' or 'rejected')
 * @param {Object} room - Room object with room_name
 * @param {string[]} bookingDates - Array of booking date strings
 */
const sendBookingStatusEmail = async (user, bookingStatus, room, bookingDates) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const isApproved = bookingStatus === 'approved';
    const statusColor = isApproved ? '#28a745' : '#dc3545';
    const statusText = isApproved ? 'APPROVED ✅' : 'REJECTED ❌';
    const statusMessage = isApproved
      ? 'Your room booking has been confirmed! We look forward to welcoming you.'
      : 'Unfortunately, your room booking has been rejected. This may be due to payment verification failure. Please contact support or try booking again.';

    const datesFormatted = bookingDates.map((d) => {
      const dateStr = typeof d === 'string' ? d.split('T')[0] : d;
      return dateStr;
    }).join(', ');

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Beach Resort'}" <${process.env.SEND_SENDER_MAIL}>`,
      to: user.email,
      subject: `Booking ${statusText} — ${room?.room_name || 'Beach Resort'}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0;">
          <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">🏖️ Beach Resort</h1>
            <p style="color: #a0a0c0; margin: 8px 0 0;">Booking Status Update</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333;">Dear <strong>${user.fullName || user.userName}</strong>,</p>
            <div style="background: ${statusColor}15; border-left: 4px solid ${statusColor}; padding: 15px 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
              <p style="font-size: 18px; font-weight: bold; color: ${statusColor}; margin: 0;">
                Booking ${statusText}
              </p>
            </div>
            <p style="font-size: 15px; color: #555; line-height: 1.6;">${statusMessage}</p>
            <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px; color: #1a1a2e; font-size: 16px;">📋 Booking Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 14px;">Room</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600; text-align: right;">${room?.room_name || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 14px; border-top: 1px solid #f0f0f0;">Dates</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #f0f0f0;">${datesFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 14px; border-top: 1px solid #f0f0f0;">Status</td>
                  <td style="padding: 8px 0; color: ${statusColor}; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #f0f0f0;">${bookingStatus.toUpperCase()}</td>
                </tr>
              </table>
            </div>
            <p style="font-size: 13px; color: #999; margin-top: 20px;">If you have any questions, please contact our support team.</p>
          </div>
          <div style="background: #1a1a2e; padding: 15px; text-align: center;">
            <p style="color: #a0a0c0; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Beach Resort. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // LOG TO CONSOLE FOR DEVELOPMENT
    if (process.env.APP_NODE_ENV === 'development') {
      console.log('--- BOOKING EMAIL LOG ---');
      console.log(`To: ${user.email}`);
      console.log(`Subject: Booking ${statusText}`);
      console.log('-------------------------');
    }

    await transporter.sendMail(mailOptions);
    logger.info(`Booking status email sent to ${user.email} (${bookingStatus})`);
  } catch (error) {
    // Log error but don't throw — email failure shouldn't break the status update
    logger.error(`Failed to send booking email to ${user.email}: ${error.message}`);
  }
};

module.exports = sendBookingStatusEmail;
