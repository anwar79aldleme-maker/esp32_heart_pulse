import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req,res){
  if(req.method !== 'POST')
    return res.status(405).end();

  const { device_id, signal, time } = req.body;

  if(!device_id || typeof signal !== 'number')
    return res.status(400).json({message:'Invalid'});

  await sql`
    INSERT INTO sensor_data(device_id, signal, time)
    VALUES(${device_id}, ${signal}, ${time})
  `;

  res.status(200).json({ok:true});
}
