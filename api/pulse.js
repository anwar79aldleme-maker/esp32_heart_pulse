import { neon } from '@neondatabase/serverless';

// اتصال Neon
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    // ======================
    // POST → استقبال الإشارة
    // ======================
    if (req.method === 'POST') {
      const { device_id, signal, time } = req.body || {};

      // تحقق من البيانات
      if (!device_id || typeof signal !== 'number') {
        return res.status(400).json({
          message: 'Invalid or missing data',
          received: req.body
        });
      }

      // إدخال البيانات في Neon
      await sql`
        INSERT INTO sensor_data (device_id, signal, time)
        VALUES (${device_id}, ${signal}, ${time || new Date().toISOString()})
      `;

      return res.status(200).json({
        message: 'Signal saved successfully',
        device_id,
        signal
      });
    }

    // ======================
    // GET → جلب آخر 200 إشارة
    // ======================
    else if (req.method === 'GET') {
      const rows = await sql`
        SELECT device_id, signal, time
        FROM sensor_data
        ORDER BY time ASC
      
      `;

      return res.status(200).json(rows);
    }

    // ======================
    // طريقة غير مدعومة
    // ======================
    else {
      return res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
}
