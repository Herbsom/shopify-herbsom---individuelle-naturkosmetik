import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.ts';
import { reviews as reviewsTable } from '../drizzle/schema.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importReviews() {
  try {
    // Read the JSON file
    const reviewsFile = path.join(__dirname, '../reviews-for-import.json');
    const reviewsData = JSON.parse(fs.readFileSync(reviewsFile, 'utf-8'));

    console.log(`Starting import of ${reviewsData.length} reviews...`);

    let imported = 0;
    let skipped = 0;

    for (const review of reviewsData) {
      try {
        // Map product IDs to database product IDs
        const productIdMap = {
          'cleaner': 'cleaner',
          'cleaner-milk': 'cleaner-milk',
          'peeling': 'peeling',
          'peeling-aha': 'peeling-aha',
          'sunscreen': 'sunscreen',
          'serum': 'serum',
          'creme': 'creme',
        };

        const dbProductId = productIdMap[review.productId];
        if (!dbProductId) {
          console.log(`  Skipping review: unknown product ID ${review.productId}`);
          skipped++;
          continue;
        }

        // Insert review
        await db.insert(reviewsTable).values({
          productId: dbProductId,
          rating: review.rating,
          title: review.title,
          text: review.text,
          authorName: review.authorName,
          authorEmail: review.authorEmail,
          status: 'approved',
          createdAt: new Date(review.createdAt),
          helpfulCount: 0,
          unhelpfulCount: 0,
        });

        imported++;
        if (imported % 100 === 0) {
          console.log(`  Imported ${imported} reviews...`);
        }
      } catch (error) {
        console.error(`  Error importing review:`, error.message);
        skipped++;
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`  Imported: ${imported}`);
    console.log(`  Skipped: ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

importReviews();
