import { NextApiRequest, NextApiResponse } from 'next'
import { createOpenAiLlm } from '@mxxrr/prompts'
import { loadPublicData } from '@mxxrr/data'


export default async (req: NextApiRequest, res: NextApiResponse) => {

  const { query } = req
  const filepath = query.filepath as string

  const text = await loadPublicData(filepath)

  if ( ! text) {
    return res.json({
      data: {
        text: '',
        tokens: 0,
      },
    })
  }

  const llm = createOpenAiLlm(String(process.env.OPENAI_API_KEY))
  const tokens = await llm.getNumTokens(text)

  res.json({
    data: {
      text,
      tokens,
    }
  })
}
