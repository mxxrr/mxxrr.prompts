import path from 'path'
import { useCallback, useEffect, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Schema, PublicSchema } from '@mxxrr/prompts'


export const getStaticPaths = async () => {

  const url = path.join(String(process.env.API_URL), 'schema-list')
  const res = await fetch(url)
  const payload = await res.json()
  const schemas: Schema[] = payload.data.schemas
  const paths = schemas.map(schema => `/prompter/${schema.key}`)

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async ({ params }: any) => {

  const apiUrl = String(process.env.API_URL)

  const schemaUrl = path.join(apiUrl, `schema?key=${params.key}`)
  const schemaRes = await fetch(schemaUrl)
  const schemaPayload = await schemaRes.json()
  const schema: PublicSchema = schemaPayload.data.schema

  const initialDataSource = schema.texts.find(text => text.latest)

  const sourceUrl = path.join(apiUrl, `source?filepath=${initialDataSource?.filepath}`)
  const sourceRes = await fetch(sourceUrl)
  const sourcePayload = await sourceRes.json()

  return {
    props: {
      apiUrl,
      initial: {
        source: sourcePayload.data,
      },
      schema,
    },
  }
}

interface Props {
  apiUrl: string
  initial: {
    source: {
      text: string
      tokens: number
    }
  }
  schema: PublicSchema
}

export const Prompter = ({ apiUrl, initial, schema }: Props) => {

  const [submitting, setSubmitting] = useState(false)
  const [resultOutput, setResultOutput] = useState('')

  const [tab, setTab] = useState(0)

  const onChangeTab = useCallback((_: unknown, nextTab: number) => {
    setTab(nextTab)
  }, [])

  const initialDataSource = schema.texts.find(text => text.latest)
  const [dataSourceKey, setDataSourceKey] = useState(initialDataSource?.key ?? '')

  const [dataSource, setDataSource] = useState(initial.source)

  const [inputText, setInputText] = useState('')

  const onChangeDataSource = useCallback((event: SelectChangeEvent) => {
    setDataSourceKey(event.target.value as string)
  }, [])

  const onChangeInputText = useCallback((event: any) => {
    setInputText(event.target.value as string)
  }, [])

  const fetchDataSource = useCallback(async (filepath: string) => {
    const sourceUrl = `${apiUrl}/source?filepath=${filepath}`
    const sourceRes = await fetch(sourceUrl)
    const sourcePayload = await sourceRes.json()
    setDataSource(sourcePayload.data)
    setInputText(sourcePayload.data.text)
  }, [])

  useEffect(() => {

    if (dataSourceKey === 'custom') {
      setInputText('')
      return
    }

    const source = schema.texts
      .find(text => text.key === dataSourceKey)

    if (source) {
      fetchDataSource(source.filepath)
    }
  }, [dataSourceKey, schema])

  const onSubmit = useCallback(async (event: any) => {
    event.preventDefault()

    const form = document.getElementById('form')
    if ( ! form) return

    const inputList = form.getElementsByTagName('input')
    const textareaList = form.getElementsByTagName('textarea')

    const data: Record<string, string> = {}

    const addNodeValue = (node: any) => {
      if (node.id) {
        data[node.id] = node.value
      }
    }
  
    Array.from(inputList).forEach(addNodeValue)
    Array.from(textareaList).forEach(addNodeValue)

    setSubmitting(true)

    const sourceRes = await fetch(`${apiUrl}/generate`, {
      method: 'post',
      body: JSON.stringify(data),
    })

    const sourcePayload = await sourceRes.json()

    if (sourcePayload?.data?.text && schema?.output === 'json') {
      try {
        setResultOutput(JSON.stringify(sourcePayload.data.text, null, 2))
      }
      catch (error) {
        console.log(`Failed to parse json response`)
      }
    }
    else if (sourcePayload?.data?.text) {
      setResultOutput(sourcePayload.data.text)
    }

    setSubmitting(false)

  }, [])

  return (
    <Container
      maxWidth={'lg'}
      sx={{ py: 6 }}>
        <form id={'form'} method={'post'} onSubmit={onSubmit}>
          <Typography component={'h1'} variant={'h4'}>
            Prompter
          </Typography>
          <Box sx={{ mt: 2, width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tab} onChange={onChangeTab}>
                <Tab label="Template" />
                <Tab label="Text" />
                <Tab label="Run" />
              </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
              <Stack gap={6}>
                {schema.templates.map((template) => (
                  <Box key={template.key}>
                    <FormControl sx={{ width: '100%' }}>
                      <FormLabel>
                        {template.name}
                        {' '}
                        <Typography component={'span'} variant={'caption'}>
                          ({template.tokens.toLocaleString('en-US')} tokens)
                        </Typography>
                      </FormLabel>
                      <TextField
                        id={`template-${template.key}`}
                        defaultValue={template.text}
                        multiline
                        minRows={6}
                        maxRows={999999}/>
                      <FormHelperText>
                        {template.tokens} Tokens
                      </FormHelperText>
                    </FormControl>
                  </Box>
                ))}
              </Stack>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <Stack gap={6}>
                <FormControl>
                  <FormLabel>
                    Example Text
                  </FormLabel>
                  <Select
                    name={'data-source'}
                    fullWidth
                    value={dataSourceKey}
                    onChange={onChangeDataSource}>
                    {schema.texts.map((text) => (
                      <MenuItem key={text.key} value={text.key}>{text.name}</MenuItem>
                    ))}
                    <MenuItem key={'custom'} value={'custom'}>Custom</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Text{' '}
                    <Typography component={'span'} variant={'caption'}>
                      ({dataSource.tokens.toLocaleString('en-US')} tokens)
                    </Typography>
                  </FormLabel>
                  <TextField
                    id={'text'}
                    value={inputText}
                    multiline
                    minRows={6}
                    maxRows={999999}
                    onChange={onChangeInputText} />
                  <FormHelperText>
                    {dataSource.tokens.toLocaleString('en-US')} Tokens
                  </FormHelperText>
                </FormControl>
              </Stack>
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <Stack gap={3}>
                <LoadingButton
                  type={'submit'}
                  variant={'contained'}
                  loading={submitting}
                  sx={{ mt: 2, mb: 4, maxWidth: 240 }}>
                  Generate
                </LoadingButton>
                <input
                  id={'schemaKey'}
                  defaultValue={schema.key}
                  hidden />
                { ! submitting && !! resultOutput && (
                  <>
                    <Divider />
                     <TextField
                      value={resultOutput}
                      multiline
                      minRows={6}
                      maxRows={999999} />
                  </>
                )}
              </Stack>
            </TabPanel>
          </Box>
        </form>
    </Container>
  )
}

interface TabPanelProps {
  children?: React.ReactNode
  value: number
  index: number
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {

  const visible = value === index

  return (
    <div
      role={'tabpanel'}
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}>
      <Box sx={{ mt: 4, pt: 2, maxWidth: 700, display: visible ? 'block' : 'hidden' }}>
        {children}
      </Box>
    </div>
  )
}

export default Prompter
