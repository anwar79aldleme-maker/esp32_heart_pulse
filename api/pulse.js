import { neon } from '@neondatabase/serverless';

// اتصال Neon
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {

    // ======================
    // POST → استقبال BPM
    // ======================
    if (req.method === 'POST') {

      const { device_id, bpm, time } = req.body || {};

      // تحقق من البيانات
      if (!device_id || typeof bpm !== 'number') {
        return res.status(400).json({
          message: 'Invalid or missing data',
          received: req.body
        });
      }

      // إدخال البيانات
      await sql`
        INSERT INTO sensor_data (device_id, bpm, time)
        VALUES (${device_id}, ${bpm}, ${time || new Date().toISOString()})
      `;

      return res.status(200).json({
        message: 'BPM saved',
        device_id,
        bpm
      });
    }

    // ======================
    // GET → جلب البيانات
    // ======================
    if (req.method === 'GET') {

      const rows = await sql`
        SELECT device_id, bpm, time
        FROM sensor_data
        ORDER BY time ASC
        LIMIT 200
      `;

      return res.status(200).json(rows);
    }

    // ======================
    // Method not allowed
    // ======================
    return res.status(405).json({ message: 'Method not allowed' });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
}
