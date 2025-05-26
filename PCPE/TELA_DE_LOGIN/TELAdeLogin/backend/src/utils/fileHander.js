const fs = require('fs')
const path = require('path')

const mockFilePath = path.join(__dirname, '../mock.json')

const readData = () => {
  if (!fs.existsSync(mockFilePath)) {
    return []
  }
  const data = fs.readFileSync(mockFilePath)
  return JSON.parse(data)
}

const writeData = (data) => {
  fs.writeFileSync(mockFilePath, JSON.stringify(data, null, 2))
}

module.exports = {
  readData,
  writeData,
}
