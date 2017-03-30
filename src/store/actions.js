import * as types from './mutation-types'

export const selectBucket = ({ commit }, bucket) => bucket.Name && commit(types.SELECTED_BUCKET, bucket)
export const setUserInfo = ({ commit }, info) => info.username && commit(types.USER_INFO, info)
export const login = ({ commit }, isLogin) => commit(types.IS_LOGIN, isLogin)