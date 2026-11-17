// Controller for /api/hosts
//
// Step 4: getHostListings(req, res)
//   - hostId is not a number -> 400, no places found -> 404
//   - try/catch -> 500 { error }
// Controller for /api/hosts
// Step 4: getHostListings(req, res)

const hostsDal = require("../dal/hosts.dal.js");

async function getHostListings(req, res) {
  try {
    // Get hostId from URL
    const { hostId } = req.params;

    // Validate hostId
    const parsedHostId = Number(hostId);

    if (!Number.isInteger(parsedHostId) || parsedHostId < 1) {
      return res.status(400).json({
        error: "hostId must be a positive number"
      });
    }

    // Get host listings from DAL
    const listings = await hostsDal.getListingsByHost(parsedHostId);

    // Check if host has listings
    if (listings.length === 0) {
      return res.status(404).json({
        error: "No listings found for this host"
      });
    }

    // Send response
    return res.status(200).json(listings);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Database query failed"
    });
  }
}

module.exports = {
  getHostListings
};