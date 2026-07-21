import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function importReviews() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const url = new URL(dbUrl);
  const connection = await mysql.createConnection({
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: {},
  });

  console.log('Connected to database');

  // Read all chunk files
  const chunks = [];
  const tmpDir = '/tmp';
  const files = fs.readdirSync(tmpDir)
    .filter(f => f.startsWith('chunk-batch-'))
    .sort();

  // Extract all INSERT statements
  for (const file of files) {
    const content = fs.readFileSync(path.join(tmpDir, file), 'utf-8');
    const lines = content.split('\n');
    
    let currentStmt = '';
    for (const line of lines) {
      currentStmt += line;
      // Check if statement is complete (ends with semicolon)
      if (currentStmt.trim().endsWith(');')) {
        chunks.push(currentStmt.trim());
        currentStmt = '';
      }
    }
  }

  console.log(`Total statements: ${chunks.length}`);

  // Import in batches of 1 (safer for problematic statements)
  let imported = 0;
  let failed = 0;
  const failedStatements = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const stmt = chunks[i];
    
    try {
      await connection.execute(stmt);
      imported++;
      if ((i + 1) % 50 === 0) {
        console.log(`✓ Imported ${i + 1}/${chunks.length}`);
      }
    } catch (err) {
      failed++;
      failedStatements.push({ stmt: stmt.substring(0, 100), error: err.message });
      if (failed <= 10) {
        console.error(`✗ Error at ${i}: ${err.message.substring(0, 80)}`);
      }
    }
  }

  console.log(`\n✅ Import complete: ${imported}/${chunks.length} statements (${failed} failed)`);
  
  if (failedStatements.length > 0) {
    console.log('\nFailed statements (first 5):');
    failedStatements.slice(0, 5).forEach((f, idx) => {
      console.log(`${idx + 1}. ${f.stmt}...`);
      console.log(`   Error: ${f.error}`);
    });
  }

  await connection.end();
}

importReviews().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
