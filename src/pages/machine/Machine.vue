<template>
    <div>
        <div class="bsc-flex-section">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
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
@import '../../styles/index.less';

.bsc-flex-section {
    min-height: 100%;
    width: 100%;
    .fb(flex-start, flex-start);
    flex-wrap: wrap;

    & > div {
        .wh(300px, 300px);
        margin: 0 15px 15px 0;
        padding: 16px;
        border: 1px solid #eee;
    }
}
</style>
