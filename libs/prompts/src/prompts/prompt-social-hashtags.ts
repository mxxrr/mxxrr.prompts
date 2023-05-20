import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'


export const generateHashtags = async (
  llm: OpenAI,
  text: string,
  template: string,
): Promise<string> => {

  console.log(`llm - generate social hashtags`)
  const prompt = new PromptTemplate({
    template,
    inputVariables: ['text'],
  })

  console.log(`llm - generate social hashtags started`)
  const chain = new LLMChain({ llm, prompt })
  const res: any = await chain.call({ text })

  console.log(`llm - generate social hashtags completed`)
  return res.text as string
}
