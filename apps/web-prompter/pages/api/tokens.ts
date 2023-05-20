import { NextApiRequest, NextApiResponse } from 'next'
import { createOpenAiLlm } from '@mxxrr/prompts'


export default async (req: NextApiRequest, res: NextApiResponse) => {

  const text = req.body.text as string

  const llm = createOpenAiLlm(String(process.env.OPENAI_API_KEY))
  const tokens = await llm.getNumTokens(text)

  res.json({
    data: {
      tokens,
    }
  })
}
