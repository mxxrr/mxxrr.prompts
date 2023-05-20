import { z } from 'zod'
import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'
import { StructuredOutputParser, OutputFixingParser } from 'langchain/output_parsers'


export const generateMapMixed = async (
  llm: OpenAI,
  text: string,
  template: string,
): Promise<any> => {

  console.log(`llm - generate map mixed`)

  const parser = StructuredOutputParser.fromZodSchema(schema)
  
  const prompt = new PromptTemplate({
    template,
    inputVariables: ['text'],
    partialVariables: {
      format_instructions: parser.getFormatInstructions(),
    },
  })

  const input = await prompt.format({ text })

  console.log(`llm - generate map mixed started`)
  const res: any = await llm.call(input)

  try {
    const payload = await parser.parse(res)

    console.log(`llm - generate map mixed completed`)
    console.log(JSON.stringify(payload, null, 2))
    return payload
  }
  catch (error) {

    if (error instanceof Error) {
      console.log(`llm - failed to parse bad output - ${error.message}`)
    }

    const fixParser = OutputFixingParser.fromLLM(llm, parser)
    const output = await fixParser.parse(res)

    console.log(`llm - successfully resolved and parsed output`)
    console.log(JSON.stringify(output, null, 2))
    return output
  }
}

const speakerSchema = z.object({
  name: z.string().describe('Speaker name'),
  label: z.string().describe('Speaker label'),
  confidence: z.number().describe('The level of confidence this is the speakers name'),
})

const schema = z.object({
  speakers: z.array(speakerSchema).describe('json array of speakers with their name and label'),
  mood: z.array(z.string().describe('Mood of the text')).describe('A list of mood words'),
  tone: z.array(z.string().describe('Tone of the text')).describe('A list of tone words'),
  theme: z.string().describe('Theme of the text'),
  type: z.string().describe('Type of the text'),
  summary: z.string().describe('Summary of the text'),
})
