import { db } from './server/db.ts';
import fs from 'fs';
import path from 'path';

const reviewsFile = '/tmp/reviews-import-fixed.sql';
const content = fs.readFileSync(reviewsFile, 'utf-8');

// Split by INSERT statements
const statements = content
  .split('\n')
  .filter(line => line.trim().startsWith('INSERT INTO reviews'));

console.log(`Found ${statements.length} review statements to import`);

let imported = 0;
let errors = 0;

for (const stmt of statements) {
  try {
    // Execute raw SQL
    await db.execute(stmt);
    imported++;
    
    if (imported % 50 === 0) {
      console.log(`Imported ${imported}/${statements.length} reviews...`);
    }
  } catch (err) {
    errors++;
    if (errors <= 5) {
      console.error(`Error: ${err.message}`);
      console.error(`Statement: ${stmt.substring(0, 150)}...`);
    }
  }
}

console.log(`\nImport complete: ${imported} reviews imported, ${errors} errors`);
process.exit(errors > 0 ? 1 : 0);
