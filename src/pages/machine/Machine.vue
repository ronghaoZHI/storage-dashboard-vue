<template>
    <div>
        <div class="bsc-flex-section">
            <machine-card v-for="item in machineList" :key="item.hostname" :data="item"></machine-card>
        </div>
    </div>
</template>
<script>
import { NODE } from '@/service/API'
import machineCard from './MachineCard'
export default {
    data () {
        return {
            machineList: []
        }
    },
    mounted () {
        this.getMachineList()
    },
    components: {
        machineCard
    },
    methods: {
        async getMachineList () {
            this.$Loading.start()
            try {
                const res = await this.$http.get(NODE)
                this.machineList = res.data
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

.@{css-prefix}flex-section {
    min-height: 100%;
    width: 100%;
    .fb(flex-start, flex-start);
    flex-wrap: wrap;

    & > div {
        .wh(300px, 100%);
        margin: 0 15px 15px 0;
        border: 1px solid #eee;
    }
}
</style>
