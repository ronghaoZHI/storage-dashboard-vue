import * as types from './mutation-types'

export const selectBucket = ({ commit }, bucket) => bucket.Name && commit(types.SELECTED_BUCKET, bucket)