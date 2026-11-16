// Router for /api/listings - only paths -> controller functions (no logic, no SQL).
//
// Step 2: GET /      -> the cards (filters, sort, limit)
// Step 3: GET /:id   -> one place with host details
//
const express = require("express");
const listingsController = require("../controllers/listings.controller.js");
console.log("Controller:", listingsController);
console.log("getListings:", typeof listingsController.getListings);
const router = express.Router();

router.get("/", listingsController.getListings);
router.get("/:id", listingsController.getListingById);
module.exports = router;
