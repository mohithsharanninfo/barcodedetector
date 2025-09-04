import db from "../utils/db";

// date format: "YYYY-MM-DD"
const getScannedProductsByRange = async (startDate, endDate) => {
  return db.scanned_products
    .where("dateTime")
    .between(startDate, endDate, true, true) // inclusive range
    .toArray();
};

export default getScannedProductsByRange;
