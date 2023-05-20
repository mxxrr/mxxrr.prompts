import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { loadSummarizationChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'


export const generateSummary = async (
  llm: OpenAI,
  text: string,
  combineTemplate: string,
  summizeTemplate: string,
): Promise<string> => {

  console.log(`llm - generate summary`)
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 10000, chunkOverlap: 200 })
  const docs = await textSplitter.createDocuments([text])
  console.log(`llm - generate summary split into ${docs.length} docs`)

  const combineMapPrompt = new PromptTemplate({
    template: summizeTemplate,
    inputVariables: ['text'],
  })

  const combinePrompt = new PromptTemplate({
    template: combineTemplate,
    inputVariables: ['text'],
  })

  const chain = loadSummarizationChain(llm, {
    type: 'map_reduce',
    combineMapPrompt,
    combinePrompt,
    verbose: true,
  })

  console.log(`llm - generate summary started`)

  const res: any = await chain.call({
    input_documents: docs,
  })

  console.log(`llm- generate summary completed`)
  return res.text as string
}
