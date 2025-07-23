import Dexie from 'dexie';
const db = new Dexie('ScannedProductsDB');

db.version(1).stores({
  scanned_products: '++id, dateTime',  // auto-increment id + dateTime as index
});

export default db;