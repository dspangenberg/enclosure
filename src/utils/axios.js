import axios from 'axios'
import { EventEmitter } from 'events'

class AxiosLoading extends EventEmitter {
  constructor () {
    super()
    this.requestCounter = 0
    this.setupRequest()
    this.setupResponse()
  }

  setupRequest () {
    axios.interceptors.request.use(config => {
      this.requestCounter++
      console.log('start')
      this.emit('start', this.requestCounter)
      return config
    })
  }

  setupResponse () {
    const response = (response) => {
      this.requestCounter--
      if (this.requestCounter === 0) {
        this.emit('done', this.requestCounter)
      }
      return response
    }
    const error = (error) => {
      console.log(error)
      if (this.requestCounter === 0) {
        this.emit('done', this.requestCounter)
      }
      // return Promise.reject(error)
    }
    axios.interceptors.response.use(response, error)
  }
}

export default AxiosLoading
