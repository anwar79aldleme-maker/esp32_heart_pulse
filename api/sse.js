
import { Client } from "@neondatabase/serverless";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendData = async () => {
    try {
      await client.connect();
      const result = await client.query(
        `SELECT signal, bpm FROM heart_data ORDER BY created_at DESC LIMIT 1`
      );
      await client.end();

      if (result.rows.length > 0) {
        res.write(`data: ${JSON.stringify(result.rows[0])}\n\n`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const interval = setInterval(sendData, 200); // تحديث كل 200ms

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
}
