<template>
    <div class="bsc-flex-section">
        <Spin size="bigger" fix v-if="spinShow"></Spin>
        <machine-card v-for="item in machineList" :key="item.hostname" :data="item"></machine-card>
    </div>
</template>
<script>
import { NODE } from '@/service/API'
import machineCard from './MachineCard'
export default {
    data () {
        return {
            spinShow: true,
            machineList: []
        }
    },
    created () {
        this.getMachineList()
    },
    components: {
        machineCard
    },
    methods: {
        async getMachineList () {
            this.spinShow = true
            this.$Loading.start()
            try {
                this.machineList = await this.$http.get(NODE)
                this.spinShow = false
                this.$Loading.finish()
            } catch (error) {
                this.spinShow = false
                this.$Loading.error()
            }
        }
    }
}

</script>
<style lang="less" scoped>
.@{css-prefix}flex-section {
    min-height: 100%;
    width: 100%;
    .fb(flex-start, flex-start);
    flex-wrap: wrap;
}
</style>
