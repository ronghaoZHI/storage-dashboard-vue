<template>
    <div>
        <Table :columns="columns" :data="data"></Table>
    </div>
</template>
<script>
import { ACCESSKEY } from '../service/API'
import moment from 'moment'
export default {
    data() {
        return {
            columns: [
                {
                    title: 'Accesskey',
                    key: 'accesskey'
                },
                {
                    title: 'Secretkey',
                    key: 'secretkey'
                },
                {
                    title: 'Create time',
                    key: 'ts'
                }
            ],
            data: []
        }
    },
    mounted() {
        this.getKeychainList()
    },
    methods: {
        async getKeychainList() {
            this.$Loading.start()
            try {
                const res = await this.$http.get(ACCESSKEY)
                this.data = await _.forEach(res.data,(item) => {
                    item.ts = item.LastModified = moment(item.ts).format('YYYY-MM-DD HH:mm')
                })
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
                console.log(error)
            }
        }
    }
}

</script>
<style lang="less" scoped>

</style>