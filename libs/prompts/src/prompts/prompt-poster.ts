import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'


export const generateImagePoster = async (
  llm: OpenAI,
  text: string,
  template: string,
): Promise<string> => {

  console.log(`llm - generate image poster`)
  const prompt = new PromptTemplate({
    template,
    inputVariables: ['text'],
  })

  console.log(`llm - generate image poster started`)
  const chain = new LLMChain({ llm, prompt })
  const res: any = await chain.call({ text })

  console.log(`llm - generate image poster completed`)
  return res.text as string
}
