<template>
    <div class="bsc-flex-section">
        <machine-card v-for="item in machineList" :key="item.hostname" :data="item"></machine-card>
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
    created () {
        this.getMachineList()
    },
    components: {
        machineCard
    },
    methods: {
        async getMachineList () {
            this.$Loading.start()
            try {
                this.machineList = await this.$http.get(NODE)
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
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
}
</style>
