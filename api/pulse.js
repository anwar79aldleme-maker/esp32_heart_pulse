import { Client } from "@neondatabase/serverless";

const client = new Client({
  connectionString: process.env.DATABASE_URL, // رابط Neon
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { device_id, signal, bpm } = req.body;

    if (!device_id || signal === undefined || bpm === undefined) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    // إدخال البيانات في Neon
    await client.connect();
    await client.query(
      `INSERT INTO heart_data(device_id, signal, bpm, created_at)
       VALUES($1, $2, $3, NOW())`,
      [device_id, signal, bpm]
    );
    await client.end();

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
