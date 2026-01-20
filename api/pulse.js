const { device_id, bpm, signal, time } = req.body;

if (
  !device_id ||
  typeof signal !== 'number'
) {
  return res.status(400).json({ message:'Invalid data' });
}

await sql`
  INSERT INTO sensor_data (device_id, bpm, signal, time)
  VALUES (${device_id}, ${bpm}, ${signal}, ${time})
`;
