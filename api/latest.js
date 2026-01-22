// latest.js - Vercel
globalThis.signalStore = globalThis.signalStore || [];

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Returning all signalStore data, count:", globalThis.signalStore.length);
    res.status(200).json({ signal: globalThis.signalStore });
  } catch (error) {
    console.error("Error in latest.js:", error);
    res.status(500).json({ error: "Server error" });
  }
}
