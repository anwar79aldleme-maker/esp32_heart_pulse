// api/pulse.js
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // التحقق من جسم الرسالة
    const { device_id, signal, time } = req.body || {};

    if (!device_id || typeof signal !== "number" || !time) {
      console.log("Received invalid payload:", req.body);
      return res.status(400).json({ 
        error: "Invalid payload", 
        received: req.body 
      });
    }

    // تسجيل البيانات في Logs فقط (اختبار بدون قاعدة بيانات)
    console.log(`Device: ${device_id}, Signal: ${signal}, Time: ${time}`);

    // لو تريد لاحقاً تخزينها في NeonDB:
    // import { Pool } from 'pg';
    // const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    // await pool.query('INSERT INTO sensor_data(device_id, signal, time) VALUES($1,$2,$3)', [device_id, signal, time]);

    // الرد دائماً JSON صالح
    return res.status(200).json({ success: true, device_id, signal, time });

  } catch (err) {
    console.error("Function error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
