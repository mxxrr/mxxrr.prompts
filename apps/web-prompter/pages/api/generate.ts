import { NextApiRequest, NextApiResponse } from 'next'
import { createOpenAiLlm, getSchema } from '@mxxrr/prompts'


export default async (req: NextApiRequest, res: NextApiResponse) => {

  try {
    const body = JSON.parse(req.body)
    const { schemaKey, text, ...params } = body
    const schema = getSchema(schemaKey)

    if ( ! schema) {
      throw Error(`Cannot find matching schema`)
    }

    const templateArgs: string[] = []
    const templateKeys = schema.templates.map(template => template.key)
    Object.keys(params).forEach(key => {
      const index = templateKeys.indexOf(String(key).replace('template-', ''))
      if (index > -1) {
        templateArgs[index] = params[key]
      }
    })

    const llm = createOpenAiLlm(String(process.env.OPENAI_API_KEY))
    const execute = schema.createExecutor()
    const result = await execute(llm, text, ...templateArgs)

    return res.json({
      data: {
        text: result,
      }
    })
  }
  catch (error) {
    if (error instanceof Error) {
      console.log(`Failed to generate prompt - ${error.message}`)
    }
  }

  res.json({
    data: null
  })
}
