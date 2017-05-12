import axios from 'axios'
//for cros cookie
axios.defaults.withCredentials = true
axios.interceptors.request.use(function(config) {
    return config
}, function(error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function(response) {
    return response
}, function(error) {
    return Promise.reject(error.response.data.error);
});

export default axios