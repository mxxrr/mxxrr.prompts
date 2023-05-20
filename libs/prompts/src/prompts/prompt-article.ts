import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'
import { loadSummarizationChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'


export const generateArticle = async (
  llm: OpenAI,
  text: string,
  template: string,
): Promise<string> => {

  console.log(`llm - generate article`)
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 8000, chunkOverlap: 200 })
  const docs = await textSplitter.createDocuments([text])
  console.log(`llm - generate article split into ${docs.length} docs`)

  const prompt = new PromptTemplate({
    template,
    inputVariables: ['text'],
  })

  console.log(`llm - generate article started`)

  const chain = new LLMChain({
    llm,
    prompt,
  })

  let output = ''

  for (let i = 0; i < 2; i ++) {
    console.log('call prompt for doc ', i)

    try {
      const res: any = await chain.call({ text: docs[i].pageContent })
      output += i > 0 ? '\n' : ''
      output += res.text
    }
    catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      }
      throw error
    }
  }

  console.log(`llm - generate article completed`)
  console.log('output: ', output)
  return output
}
