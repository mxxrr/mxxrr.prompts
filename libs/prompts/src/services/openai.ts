import { OpenAI } from 'langchain/llms/openai'


export const createOpenAiLlm = (openAIApiKey: string, temperature = 0.9) => {
  return new OpenAI({
    openAIApiKey,
    temperature,
  })
}
