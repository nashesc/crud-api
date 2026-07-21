import express from 'express'
import swaggerUI from 'swagger-ui-express'
import { readFileSync } from 'fs'
import taskRouter from './routes/tasks.routes.js'
import { errorHandler } from './middleware/error-handler.js'

const app = express()
const openApiSpec = JSON.parse(readFileSync('./openapi.json', 'utf-8'))

app.use(express.json())
app.use('/docs', swaggerUI.serve, swaggerUI.setup(openApiSpec))

app.get('/', (req, res) => {
   res.json({ 
      name: "Task API", 
      version: "1.0",
      endpoints: ["/tasks"]
   })
})

app.get('/health', (req, res) => {
   res.json({ status: "ok" });
});

app.use('/tasks', taskRouter)

app.use(errorHandler)

export default app;