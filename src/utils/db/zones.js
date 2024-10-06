
import { db} from '../../utils/dbConfig'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const zones = await db.zones.findMany();
    res.status(200).json(zones);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
