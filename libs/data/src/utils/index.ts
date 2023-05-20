import fs from 'fs/promises'
import path from 'path'


export const loadData = async (source: string): Promise<string> => {
  const uri = path.join(__dirname, '../', source)
  let data = await fs.readFile(uri, 'utf8')
  return data
}

export const loadPublicData = async (source: string): Promise<string> => {
  const uri = path.join(__dirname, '../../../../public/data', source)
  let data = await fs.readFile(uri, 'utf8')
  return data
}
