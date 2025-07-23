import db from "../utils/db";

const getScannedProductsByDate = async (date) => {
    const allItems = await db.scanned_products.toArray();
    return allItems?.filter(item => item?.dateTime.startsWith(date));
};

export default getScannedProductsByDate