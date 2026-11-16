// Controller for /api/listings - reads req.query / req.params, validates, calls the DAL,
// sets the status code and sends JSON. No SQL here.
//
// Step 2: getListings(req, res)
//   - read neighbourhood, roomType, minPrice, maxPrice, sort, limit from req.query
//   - validate: limit (default 20, max 50), minPrice/maxPrice are numbers, sort is "price" or "rating"
//     (anything else -> 400 { error })
//   - map sort to a column name here: ORDER BY can't be a parameter
//
// Step 3: getListingById(req, res)
//   - id is not a number -> 400, no such id -> 404
//   - convert hostIsSuperhost 't' / 'f' to true / false
//
// Every controller: try/catch -> 500 { error } when the DAL throws.
const listingsDal = require("../dal/listings.dal.js");

async function getListings(req, res) {
  try {
    
    const {
      neighbourhood,
      roomType,
      minPrice,
      maxPrice,
      sort,
      limit
    } = req.query;

   
    if (minPrice !== undefined) {
      const min = Number(minPrice);

      if (Number.isNaN(min) || min < 0) {
        return res.status(400).json({
          error: "minPrice must be a non-negative number"
        });
      }
    }

    
    if (maxPrice !== undefined) {
      const max = Number(maxPrice);

      if (Number.isNaN(max) || max < 0) {
        return res.status(400).json({
          error: "maxPrice must be a non-negative number"
        });
      }
    }

    
    let parsedLimit = limit === undefined ? 20 : Number(limit);

    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
      return res.status(400).json({
        error: "limit must be a whole number greater than or equal to 1"
      });
    }

    if (parsedLimit > 50) {
      parsedLimit = 50;
    }

    
    const sortValue = sort || "price";

    if (sortValue !== "price" && sortValue !== "rating") {
      return res.status(400).json({
        error: "sort must be price or rating"
      });
    }

    
    const orderBy =
      sortValue === "rating"
        ? "review_scores_rating DESC"
        : "price ASC";

    
    const listings = await listingsDal.getListings({
      neighbourhood,
      roomType,
      minPrice: minPrice === undefined ? null : Number(minPrice),
      maxPrice: maxPrice === undefined ? null : Number(maxPrice),
      orderBy,
      limit: parsedLimit
    });

    // 8. Send response
    return res.status(200).json(listings);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Database query failed"
    });
  }
}
async function getListingById(req, res) {
  try {
    const { id } = req.params;

    
    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId < 1) {
      return res.status(400).json({
        error: "id must be a positive number"
      });
    }

    
    const listing = await listingsDal.getListingById(parsedId);

    
    if (!listing) {
      return res.status(404).json({
        error: "Listing not found"
      });
    }

   
    listing.hostIsSuperhost =
      listing.hostIsSuperhost === "t";

    return res.status(200).json(listing);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Database query failed"
    });
  }
}

module.exports = {
  getListings , getListingById
};