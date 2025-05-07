import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { categoriesTable, conditionsTable } from "./schema";

export async function seed(db: NodePgDatabase) {
  await db.insert(categoriesTable).values([
    { id: 1, name: "Electronics" },
    { id: 2, name: "Books" },
    { id: 3, name: "Clothing" },
    { id: 4, name: "Home & Kitchen" },
    { id: 5, name: "Sports & Outdoors" },
    { id: 6, name: "Toys & Games" },
    { id: 7, name: "Health & Beauty" },
    { id: 8, name: "Automotive" },
    { id: 9, name: "Music & Movies" },
    { id: 10, name: "Pet Supplies" },
    { id: 11, name: "Office Supplies" },
    { id: 12, name: "Garden & Outdoor" },
    { id: 13, name: "Baby Products" },
    { id: 14, name: "Tools & Home Improvement" },
    { id: 15, name: "Grocery & Gourmet Food" },
    { id: 16, name: "Arts & Crafts" },
    { id: 17, name: "Jewelry & Watches" },
    { id: 18, name: "Musical Instruments" },
    { id: 19, name: "Video Games" },
    { id: 20, name: "Collectibles & Fine Art" },
  ]);
  console.log("Categories seeded successfully.");

  await db.insert(conditionsTable).values([
    { id: 1, name: "New" },
    { id: 2, name: "Like New" },
    { id: 3, name: "Very Good" },
    { id: 4, name: "Good" },
    { id: 5, name: "Acceptable" },
    { id: 6, name: "For Parts or Not Working" },
  ]);
  console.log("Conditions seeded successfully.");
}
