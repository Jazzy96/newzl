import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const colorsPath = path.join(process.cwd(), 'deviceColors.json');
    const colors = await fs.readFile(colorsPath, 'utf8');
    res.status(200).json(JSON.parse(colors));
  } catch (error) {
    res.status(500).json({ error: 'Error loading device colors' });
  }
} 