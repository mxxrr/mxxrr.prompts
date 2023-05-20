import { NextApiRequest, NextApiResponse } from 'next'
import { getSchemaList } from '@mxxrr/prompts'


export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.json({
    data: {
      schemas: getSchemaList(),
    }
  })
}
