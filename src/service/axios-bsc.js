import axios from 'axios'
// for cros cookie
axios.defaults.withCredentials = true
axios.interceptors.request.use(config => config, error => Promise.reject(error))
axios.interceptors.response.use(response => response, error => Promise.reject(error.response.data.error))

export default axios
