const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const mockPath = path.join(__dirname, 'mock.json')

// Rota de login
app.post('/login', (req, res) => {
  const { email, password } = req.body
  const data = JSON.parse(fs.readFileSync(mockPath, 'utf-8'))
  const user = data.users.find((u) => u.email === email && u.password === password)
  if (user) {
    res.json({ success: true, message: 'Login autorizado' })
  } else {
    res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' })
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
// Teste de login
