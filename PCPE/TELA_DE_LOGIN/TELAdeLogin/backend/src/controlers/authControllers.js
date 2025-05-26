class AuthController {
  constructor(fileHandler) {
    this.fileHandler = fileHandler
  }

  async register(req, res) {
    const { username, password } = req.body
    const users = await this.fileHandler.readFile()

    if (users[username]) {
      return res.status(400).json({ message: 'User already exists' })
    }

    users[username] = { password }
    await this.fileHandler.writeFile(users)
    res.status(201).json({ message: 'User registered successfully' })
  }

  async login(req, res) {
    const { username, password } = req.body
    const users = await this.fileHandler.readFile()

    if (!users[username] || users[username].password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    res.status(200).json({ message: 'Login successful' })
  }
}

module.exports = AuthController
