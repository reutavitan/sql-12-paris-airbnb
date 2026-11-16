// Router for /api/hosts - only paths -> controller functions (no logic, no SQL).
//
// Step 4: GET /:hostId/listings -> all the places of one host
const express = require("express");
const router = express.Router();
router.get("/:hostId/listings",hostController.getListingsByHost);
module.exports = router;