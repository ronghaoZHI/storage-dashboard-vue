<template>
    <div>
        <Table :columns="columns" :data="data" no-data-text="No data"></Table>
    </div>
</template>
<script>
import { NODE } from '@/service/API'
export default {
    data () {
        return {
            columns: [
                {
                    title: 'Hostname',
                    key: 'hostname'
                },
                {
                    title: 'Public ips',
                    key: 'pub_ips'
                },
                {
                    title: 'Inner ips',
                    key: 'inn_ips'
                },
                {
                    title: 'Inner ips',
                    key: 'status'
                },
                {
                    title: 'CPU load',
                    key: 'cpu.load'
                }
            ],
            data: []
        }
    },
    mounted () {
        // this.getMachineList()
    },
    methods: {
        async getMachineList () {
            this.$Loading.start()
            try {
                const res = await this.$http.get(NODE)
                this.data = res.data
                console.log(res)
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
                this.$Message.warning('Need to login again')
                this.$router.push({
                    path: '/login',
                    query: { redirect: '/keychain' }
                })
            }
        }
    }
}

</script>
<style lang="less" scoped>

</style>
