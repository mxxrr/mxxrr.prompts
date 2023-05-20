import path from 'path'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Schema } from '@mxxrr/prompts'


export const getStaticProps = async () => {

  const url = path.join(String(process.env.API_URL), 'schema-list')
  const res = await fetch(url)
  const payload = await res.json()
  const schemas: Schema[] = payload.data.schemas

  return {
    props: {
      schemas,
    },
  }
}

interface Props {
  schemas: Schema[]
}

export const Prompter = ({ schemas }: Props) => {

  const router = useRouter()

  return (
    <Container
      maxWidth={'lg'}>
      <Box sx={{ my: 6 }}>
        <Typography component={'h1'} variant={'h4'}>
          Prompts
        </Typography>
        <Stack
          flexDirection={'row'}
          flexWrap={'wrap'}
          gap={3}
          sx={{ mt: 2 }}>
          {schemas.map((schema) => (
            <Card key={schema.key} sx={{ width: 368 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  {schema.key}
                </Typography>
                <Typography variant="h5" component="div">
                  {schema.name}
                </Typography>
                <Typography sx={{ mb: 1.5, minHeight: 50 }} color="text.secondary">
                  {schema.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => router.push(`/prompter/${schema.key}`)}>Explore</Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Box>
    </Container>
  )
}

export default Prompter
