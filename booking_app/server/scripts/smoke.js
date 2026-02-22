require("dotenv").config();

require("../src/db/pool");
require("../src/db/bookingsRepo");
require("../src/routes/bookings");

console.log("smoke ok");

