import { Client } from "@neondatabase/serverless";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { device_id, signal, bpm } = req.body;

  if (!device_id || signal === undefined || bpm === undefined)
    return res.status(400).json({ error: "Missing parameters" });

  try {
    await client.connect();
    await client.query(
      `INSERT INTO pulse_data (device_id, signal, bpm) VALUES ($1, $2, $3)`,
      [device_id, signal, bpm]
    );
    await client.end();
    return res.status(200).json({ message: "Data saved" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
}
