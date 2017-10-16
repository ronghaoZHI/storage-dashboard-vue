import { handler } from '@/service/Aws'

const getBucketList = async () => {
    return await handler('listBuckets')
}

export { getBucketList }
