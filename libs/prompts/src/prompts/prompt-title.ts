import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'


export const generateTitle = async (
  llm: OpenAI,
  text: string,
  template: string,
): Promise<string> => {

  console.log(`llm - generate title`)
  const prompt = new PromptTemplate({
    template,
    inputVariables: ['text'],
  })

  console.log(`llm - generate title started`)

  const chain = new LLMChain({
    llm,
    prompt,
    verbose: true,
  })

  const res: any = await chain.call({ text })

  console.log(`llm - generate title completed`)
  return res.text as string
}
