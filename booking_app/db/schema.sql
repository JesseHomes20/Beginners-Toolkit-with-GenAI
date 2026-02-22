CREATE DATABASE IF NOT EXISTS booking_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE booking_app;

CREATE TABLE IF NOT EXISTS bookings (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NULL,
  phone VARCHAR(40) NULL,
  service VARCHAR(120) NOT NULL,
  appointment_at DATETIME NOT NULL,
  notes TEXT NULL,
  status ENUM('scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_bookings_appointment_at (appointment_at),
  KEY idx_bookings_status (status),
  KEY idx_bookings_customer_name (customer_name)
);

