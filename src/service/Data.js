import { handler } from '@/service/Aws'

const getBuckets = async () => {
    return await handler('listBuckets')
}

export { getBuckets }
