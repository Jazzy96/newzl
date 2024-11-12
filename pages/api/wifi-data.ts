import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dataFilePath = path.join(process.cwd(), 'processedData.json');
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(jsonData);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    res.status(500).json({ error: 'Unable to fetch data' });
  }
}