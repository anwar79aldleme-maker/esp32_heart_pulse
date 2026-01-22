// latest.js - Vercel API endpoint
// GET: return all pulse data (no limit)

global.signalStore = global.signalStore || [];

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // إرجاع كل البيانات بدون أي LIMIT
    res.status(200).json({ signal: global.signalStore });
  } catch (error) {
    console.error("Error in latest.js:", error);
    res.status(500).json({ error: "Server error" });
  }
}
