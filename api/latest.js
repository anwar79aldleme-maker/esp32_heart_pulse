export default function handler(req, res) {
  try {
    res.status(200).json({
      signal: global.signalStore || []
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
}
