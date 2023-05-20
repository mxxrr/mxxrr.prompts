

export interface Schema {
  key: string
  name: string
  description: string
}

export interface SchemaNode {
  key: string
  name: string
  description: string
  templates: PromptTemplateNode[]
  texts: SchemaText[]
  output?: 'json' | 'text'
  createExecutor: () => (...args: any[]) => Promise<string>
}

export interface PublicSchema {
  key: string
  description: string
  templates: PromptTemplate[]
  texts: SchemaText[]
  output?: 'json' | 'text'
}

export interface PromptTemplateNode {
  key: string
  name: string
  path: string
}

export interface PromptTemplate {
  key: string
  name: string
  text: string
  tokens: number
}

export interface SchemaText {
  key: string
  name: string
  filepath: string
  latest?: boolean
}
