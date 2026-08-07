import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";
import { parse } from "csv-parse/sync";

const reviewUserOpenId = "system-reviews";
const csvPath = "/home/ubuntu/upload/herbsom-all-published-reviews-in-judgeme-format-2026-08-07-1786093184.csv";
const productMapping = {
  "erstelle-deine-creme": "creme",
  "individuelle-serum-creme": "serum",
  reinigungsgel: "cleaner-gel",
  reinigungsmilch: "cleaner-milk",
  "reinigungs-milch": "cleaner-milk",
  "bha-azelainsaeure-peeling": "peeling-bha",
  "bha-azelainsaure-peeling": "peeling-bha",
  "aha-pha-peeling": "peeling-aha",
  "sonnenschutzfluid-spf-50": "sunscreen",
  "hyaluronkomplex-serum": "serum",
  hyaluronkomplex: "serum",
  "mini-reiniger": "cleaner-gel",
  vitaminkomplex: "vitaminkomplex",
  basiscreme: "basiscreme",
  algenextrakt: "algenextrakt",
};

function toTimestamp(value) {
  const normalized = String(value ?? "").trim().replace(/ UTC$/, "");
  return normalized || new Date().toISOString().slice(0, 19).replace("T", " ");
}

function toReview(row) {
  const productHandle = String(row.product_handle ?? "").trim();
  const content = String(row.body ?? "").trim();
  if (!productHandle || !content) return null;

  const parsedRating = Number.parseInt(String(row.rating ?? "5"), 10);
  return {
    productId: productMapping[productHandle] ?? productHandle,
    rating: Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5 ? parsedRating : 5,
    title: String(row.title ?? "").trim() || "No title",
    content,
    createdAt: toTimestamp(row.review_date),
  };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL ist für den Bewertungsimport nicht verfügbar.");
  }

  const csvContent = await readFile(csvPath, "utf8");
  const rows = parse(csvContent, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
  });
  const reviews = rows.map(toReview).filter(Boolean);
  if (reviews.length === 0) {
    throw new Error("Die CSV-Datei enthält keine importierbaren Bewertungen.");
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  try {
    await connection.beginTransaction();
    await connection.execute(
      `INSERT INTO users (openId, name, loginMethod, role)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      [reviewUserOpenId, "Herbsom Kundenbewertungen", "import", "user"],
    );

    const [users] = await connection.execute(
      "SELECT id FROM users WHERE openId = ? LIMIT 1",
      [reviewUserOpenId],
    );
    const reviewUserId = users[0]?.id;
    if (!reviewUserId) {
      throw new Error("Der Importbenutzer für Kundenbewertungen konnte nicht ermittelt werden.");
    }

    await connection.execute("DELETE FROM reviews WHERE userId = ?", [reviewUserId]);

    const chunkSize = 100;
    for (let offset = 0; offset < reviews.length; offset += chunkSize) {
      const chunk = reviews.slice(offset, offset + chunkSize);
      const values = [];
      const placeholders = chunk.map(() => "(?, ?, ?, ?, ?, 'approved', 0, 0, ?, NOW())").join(", ");
      for (const review of chunk) {
        values.push(
          reviewUserId,
          review.productId,
          review.rating,
          review.title,
          review.content,
          review.createdAt,
        );
      }
      await connection.execute(
        `INSERT INTO reviews
          (userId, productId, rating, title, content, status, helpfulCount, unhelpfulCount, createdAt, updatedAt)
         VALUES ${placeholders}`,
        values,
      );
    }

    const [counts] = await connection.execute(
      "SELECT COUNT(*) AS count FROM reviews WHERE userId = ?",
      [reviewUserId],
    );
    const [productCounts] = await connection.execute(
      "SELECT productId, COUNT(*) AS count FROM reviews WHERE userId = ? GROUP BY productId ORDER BY productId",
      [reviewUserId],
    );
    await connection.commit();
    console.log(`Import abgeschlossen: ${counts[0].count} Bewertungen aus der CSV-Datei.`);
    console.log(JSON.stringify(productCounts));
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("Bewertungsimport fehlgeschlagen:", error);
  process.exitCode = 1;
});
