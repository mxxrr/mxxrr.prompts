import { schemas } from './schemas'
import { Schema, SchemaNode } from '../types'


export const getSchema = (key: string): SchemaNode | undefined => {
  return schemas.find(schema => schema.key === key)
}

export const getSchemaList = (): Schema[] => {
  return schemas.map(schema => ({
    key: schema.key,
    name: schema.name,
    description: schema.description,
    output: schema?.output || 'text',
  }))
}
