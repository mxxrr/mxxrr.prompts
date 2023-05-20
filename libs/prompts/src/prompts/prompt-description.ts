import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'


export const generateDescription = async (
  llm: OpenAI,
  text: string,
  template: string,
): Promise<string> => {

  console.log(`llm - generate description`)
  const prompt = new PromptTemplate({
    template,
    inputVariables: ['text'],
  })

  console.log(`llm - generate description started`)
  const chain = new LLMChain({ llm, prompt })
  const res: any = await chain.call({ text })

  console.log(`llm- generate description completed`)
  return res.text as string
}
