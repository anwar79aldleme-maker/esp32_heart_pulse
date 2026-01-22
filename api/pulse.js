import { Client } from "@neondatabase/serverless";

const client = new Client({
  connectionString: process.env.NEON_DB_URL
});

// لتخزين النبضات مؤقتًا للرسوم
global.signalStore = global.signalStore || [];

export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { device_id, bpm, time } = req.body;

    // تأكد من وجود القيم
    if(!device_id || bpm === undefined || !time) return res.status(400).json({ error: "Invalid data" });

    // إضافة مؤقتًا للرسوم
    global.signalStore.push({ device_id, bpm, time });
    if(global.signalStore.length > 1000) global.signalStore.shift(); // حافظ على آخر 1000 قيمة

    // إدخال في NeonDB
    await client.connect();
    await client.query(
      `INSERT INTO sensor_data(device_id, bpm, time) VALUES($1,$2,$3)`,
      [device_id, bpm, time]
    );
    await client.end();

    res.status(200).json({ success: true, bpm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
