import { HOST } from './HOST'
import { USERINFO } from './API'
import axios from './axios-bsc'

const getUserInfoData = () => axios.get(USERINFO).then(res => res, err => console.log('get user info data fail'))

export { getUserInfoData }