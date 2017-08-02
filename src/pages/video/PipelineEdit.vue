<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/video/pipeline">管道管理</Breadcrumb-item>
                <Breadcrumb-item>新建管道</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="separator-line"></div>
    </div>
</template>

<script>
import { transcoder } from '@/service/Aws'
export default {
    data () {
        return {
        }
    },
    computed: {
        pipelineId () {
            return this.$route.params.id
        }
    },
    mounted () {
        this.readPipeline()
    },
    methods: {
        async readPipeline () {
            if (this.pipelineId !== 'none') {
                try {
                    this.$Loading.start()
                    await transcoder('readPipeline', {Id: this.pipelineId})
                    this.$Loading.finish()
                } catch (error) {
                    this.$Loading.error()
                }
            }
        }
    }
}
</script>

<style lang="less" scope>
@import '../../styles/index.less';

@edit-styles-border-color: #d7dde4;

.separator-line {
    border-bottom: 1px solid @edit-styles-border-color;
}
</style>
