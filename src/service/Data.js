import { handler } from '@/service/Aws'
import bucket from '@/store/modules/bucket'

const getBucketList = async() => {
    let bucketListStore = bucket.state.bucketList
    if (bucketListStore > 0) {
        return bucketListStore
    } else {
        return bucket.state.bucketList = await handler('listBuckets')
    }
}

export { getBucketList }
