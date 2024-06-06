import { NextApiRequest, NextApiResponse } from 'next';
import client from "@/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'GET') {
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
     
        try {
            const product = await client.product.findUnique({
              
                where: { id: Number(id) },
            });

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
