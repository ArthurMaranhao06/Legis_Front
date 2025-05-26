import axios from 'axios'

// Cria uma instância do Axios com configurações padrão
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptores para tratamento global de erros
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Erros 4xx/5xx
      const errorMessage =
        error.response.data?.message ||
        `Erro ${error.response.status}: ${error.response.statusText}`
      return Promise.reject(new Error(errorMessage))
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      return Promise.reject(new Error('Sem resposta do servidor'))
    } else {
      // Erro ao configurar a requisição
      return Promise.reject(new Error('Erro na configuração da requisição'))
    }
  },
)

export default {
  // Métodos para diferentes endpoints
  getHello() {
    return api.get('/hello')
  },

  createUser(userData) {
    return api.post('/users', userData)
  },

  // Adicione outros métodos conforme necessário
}
