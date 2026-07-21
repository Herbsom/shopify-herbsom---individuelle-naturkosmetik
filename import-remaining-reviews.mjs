import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

async function importReviews() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  // Parse connection string
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

  console.log(`Found ${files.length} chunk files`);

  // Extract all INSERT statements
  let totalStatements = 0;
  for (const file of files) {
    const content = fs.readFileSync(path.join(tmpDir, file), 'utf-8');
    const statements = content
      .split('\n')
      .filter(line => line.trim().startsWith('INSERT'))
      .map(line => line.trim());
    
    chunks.push(...statements);
    totalStatements += statements.length;
    console.log(`${file}: ${statements.length} statements`);
  }

  console.log(`\nTotal statements to import: ${totalStatements}`);

  // Import in batches of 5
  let imported = 0;
  let failed = 0;
  
  for (let i = 0; i < chunks.length; i += 5) {
    const batch = chunks.slice(i, i + 5);
    
    try {
      for (const stmt of batch) {
        await connection.execute(stmt);
      }
      imported += batch.length;
      if (imported % 50 === 0) {
        console.log(`✓ Imported ${imported}/${totalStatements}`);
      }
    } catch (err) {
      failed++;
      if (failed <= 5) {
        console.error(`✗ Error at statement ${i}:`, err.message);
      }
    }
  }

  console.log(`\n✅ Import complete: ${imported}/${totalStatements} statements (${failed} failed)`);
  await connection.end();
}

importReviews().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
