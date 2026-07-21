import { drizzle } from "drizzle-orm/mysql2";
import fs from "fs";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const db = drizzle(dbUrl);

// Read the SQL file
const sqlFile = "/tmp/reviews-import-fixed.sql";
const content = fs.readFileSync(sqlFile, "utf-8");

// Parse INSERT statements
const statements = content
  .split("\n")
  .filter((line) => line.trim().startsWith("INSERT INTO reviews"));

console.log(`Found ${statements.length} review statements`);

let imported = 0;
let errors = 0;

// Process in batches
const batchSize = 50;
for (let i = 0; i < statements.length; i += batchSize) {
  const batch = statements.slice(i, i + batchSize);
  
  for (const stmt of batch) {
    try {
      // Use raw SQL execution
      await db.execute(stmt);
      imported++;
    } catch (err) {
      errors++;
      if (errors <= 5) {
        console.error(`Error: ${err.message}`);
      }
    }
  }

  console.log(`Progress: ${Math.min(i + batchSize, statements.length)}/${statements.length}`);
}

console.log(
  `\nImport complete: ${imported} reviews imported, ${errors} errors`
);
process.exit(errors > 0 ? 1 : 0);
