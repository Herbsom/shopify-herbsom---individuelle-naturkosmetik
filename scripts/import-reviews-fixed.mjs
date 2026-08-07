#!/usr/bin/env node
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { getDb } from '../server/db.ts';
import { reviews, users } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const csvFile = process.argv[2] || '/home/ubuntu/upload/herbsom-all-published-reviews-in-judgeme-format-2026-08-07-1786093184.csv';

// Mapping von product_handle zu product_id
const PRODUCT_MAPPING = {
  'erstelle-deine-creme': 'custom-creme',
  'individuelle-serum-creme': 'custom-serum',
  'reinigungsgel': 'reinigungsgel',
  'reinigungsmilch': 'reinigungsmilch',
  'bha-azelainsaeure-peeling': 'bha-azelainsaeure-peeling',
  'aha-pha-peeling': 'aha-pha-peeling',
  'sonnenschutzfluid-spf-50': 'sonnenschutzfluid-spf-50',
  'hyaluronkomplex-serum': 'custom-serum',
  'hyaluronkomplex': 'hyaluronkomplex',
  'mini-reiniger': 'reinigungsgel',
  'vitaminkomplex': 'vitaminkomplex',
  'basiscreme': 'basiscreme',
  'algenextrakt': 'algenextrakt',
};

async function importReviews() {
  try {
    const db = await getDb();
    if (!db) {
      console.error('Database not available');
      process.exit(1);
    }

    console.log(`Reading CSV file: ${csvFile}`);
    
    // Lese CSV-Datei
    const fileContent = fs.readFileSync(csvFile, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    
    console.log(`Found ${records.length} records in CSV`);
    
    // Hole System-Benutzer oder erstelle ihn
    let systemUser = await db.query.users.findFirst({
      where: eq(users.openId, 'system-reviews'),
    });
    
    if (!systemUser) {
      console.log('Creating system user for reviews...');
      // Erstelle System-Benutzer
      await db.insert(users).values({
        openId: 'system-reviews',
        name: 'System Reviews',
        email: 'system@herbsom.de',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      systemUser = await db.query.users.findFirst({
        where: eq(users.openId, 'system-reviews'),
      });
    }
    
    console.log(`Using system user: ${systemUser.id}`);
    
    // Verarbeite Bewertungen
    let imported = 0;
    let skipped = 0;
    const productCounts = {};
    
    for (const record of records) {
      const productHandle = record.product_handle?.trim();
      
      if (!productHandle) {
        skipped++;
        continue;
      }
      
      // Map zu unserer product_id
      const productId = PRODUCT_MAPPING[productHandle] || productHandle;
      
      const title = record.title?.trim() || 'No title';
      const body = record.body?.trim();
      const rating = parseInt(record.rating || '5', 10);
      
      // Skip wenn kein body
      if (!body) {
        skipped++;
        continue;
      }
      
      // Parse date
      let reviewDate = new Date();
      if (record.review_date) {
        const dateStr = record.review_date.split(' UTC')[0];
        reviewDate = new Date(dateStr);
      }
      
      try {
        // Einfügen in Datenbank
        await db.insert(reviews).values({
          userId: systemUser.id,
          productId,
          rating,
          title,
          content: body,
          status: 'approved',
          helpfulCount: 0,
          unhelpfulCount: 0,
          createdAt: reviewDate,
          updatedAt: new Date(),
        });
        
        imported++;
        
        // Count reviews per product
        if (!productCounts[productId]) {
          productCounts[productId] = 0;
        }
        productCounts[productId]++;
        
        if (imported % 100 === 0) {
          console.log(`  Imported ${imported} reviews...`);
        }
      } catch (error) {
        console.error(`Error importing review: ${error.message}`);
        skipped++;
      }
    }
    
    console.log(`\nImport complete!`);
    console.log(`  Imported: ${imported}`);
    console.log(`  Skipped: ${skipped}`);
    console.log(`\nReviews per product:`);
    
    Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([productId, count]) => {
        console.log(`  ${productId}: ${count}`);
      });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

importReviews();
