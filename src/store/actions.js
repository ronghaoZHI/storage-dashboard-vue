import * as types from './mutation-types'
import { getUserInfoData } from '../components/service/Data'

export const selectBucket = ({ commit }, bucket) => bucket.Name && commit(types.SELECTED_BUCKET, bucket)
export const setUserInfo = ({ commit }, info) => info.username && commit(types.USER_INFO, info)
export const getUserInfo = async({ commit }, state) => {
    let info = await getUserInfoData()
    info.username && commit(types.USER_INFO, info)
}