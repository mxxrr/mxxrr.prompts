import { NextApiRequest, NextApiResponse } from 'next'
import { loadPublicData } from '@mxxrr/data'
import { getSchema, createOpenAiLlm } from '@mxxrr/prompts'


export default async (req: NextApiRequest, res: NextApiResponse) => {

  const { query } = req
  const key = query.key as string
  const schema = getSchema(key)

  if ( ! schema) {
    return res.json({
      data: null,
    })
  }

  const llm = createOpenAiLlm(String(process.env.OPENAI_API_KEY))
  const templates = []

  for (const template of schema.templates) {

    const text = await loadPublicData(template.path)
    const tokens = await llm.getNumTokens(text)

    templates.push({
      key: template.key,
      name: template.name,
      text,
      tokens,
    })
  }

  res.json({
    data: {
      key,
      schema: {
        ...schema,
        templates,
      },
    }
  })
}
