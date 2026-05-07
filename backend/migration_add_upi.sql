-- ============================================================
-- Migration: Add UPI Payment Columns to bookings table
-- Run this if you have an existing database and don't want to
-- re-run the full schema.sql (which drops all tables).
-- ============================================================

ALTER TABLE bookings
  ADD COLUMN upi_id VARCHAR(100) AFTER user_id,
  ADD COLUMN transaction_id VARCHAR(100) AFTER upi_id;
