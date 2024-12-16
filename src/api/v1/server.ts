import app from './app'
import env from './env'

app.listen(env.PORT, async () => {
  console.log(`App started on port ${env.PORT}`)
})
