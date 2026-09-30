// Resets and reseeds SprintMart with demo catalog data.
// Run with: npm run seed

const { db } = require('./database');

const products = [
  // Camping
  ['2-Person Tent', 'Camping', 'Lightweight freestanding tent with rainfly.', 12999, 14, '⛺'],
  ['Sleeping Bag (20°F)', 'Camping', 'Mummy-style bag rated for cool nights.', 7499, 20, '🛌'],
  ['Compact Camp Stove', 'Camping', 'Folding stove with piezo ignition.', 4299, 18, '🔥'],
  ['LED Camp Lantern', 'Camping', 'Rechargeable lantern with 3 brightness modes.', 2599, 25, '🏮'],
  // Hiking
  ['Trail Hiking Boots', 'Hiking', 'Waterproof boots with ankle support.', 8999, 16, '🥾'],
  ['Trekking Poles (Pair)', 'Hiking', 'Adjustable aluminum poles with cork grips.', 3499, 22, '🥢'],
  ['45L Hiking Backpack', 'Hiking', 'Multi-day pack with hip belt and rain cover.', 9999, 12, '🎒'],
  ['Water Filter Bottle', 'Hiking', 'Filters up to 1000L of backcountry water.', 3999, 30, '💧'],
  // Apparel
  ['Fleece Jacket', 'Apparel', 'Midweight fleece for layering.', 4599, 24, '🧥'],
  ['Packable Rain Shell', 'Apparel', 'Waterproof shell that packs into its own pocket.', 5999, 15, '🌧️'],
  ['Merino Hiking Socks', 'Apparel', 'Cushioned socks that resist odor.', 1699, 40, '🧦'],
  ['Wide-Brim Sun Hat', 'Apparel', 'UPF-rated hat with adjustable chin strap.', 1999, 19, '👒'],
  // Accessories
  ['Rechargeable Headlamp', 'Accessories', '300-lumen headlamp with red night mode.', 2899, 27, '🔦'],
  ['15-in-1 Multi-tool', 'Accessories', 'Compact multi-tool with pliers and knife.', 2199, 21, '🛠️'],
  ['Baseplate Compass', 'Accessories', 'Map-reading compass with adjustable declination.', 1499, 17, '🧭'],
];

db.exec('DELETE FROM products');

const insertProduct = db.prepare(
  `INSERT INTO products (name, category, description, price_cents, stock, emoji)
   VALUES (?, ?, ?, ?, ?, ?)`
);

db.exec('BEGIN');
for (const row of products) insertProduct.run(...row);
db.exec('COMMIT');

console.log(`Seeded ${products.length} products.`);
