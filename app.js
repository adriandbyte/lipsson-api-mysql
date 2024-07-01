import express, { json } from 'express' // require -> commonJS
import { createUserRouter } from './routes/user.js'

export const createApp = ({ userModel }) => {
  const app = express()
  app.use(json())
  app.disable('x-powered-by')

  const userRouter = createUserRouter({ userModel })
  app.use('/users', userRouter)

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}
