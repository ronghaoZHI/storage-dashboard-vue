<template>
    <div class="bsc-overview">
        <Row>
            <Col span="19" class="left-section">
                <div class="storage">
                    <div class="section-separator">
                        <div class="separator-body">
                            <span class="separator-icon"></span>
                            <span class="separator-info">本月存储使用统计</span>
                        </div>
                    </div>
                    <div class="storage-card">
                        <div class="title">
                            <div class="images"></div>
                            <span class="label">
                                本月存储容量
                            </span>
                            <span class="numbers">
                                1013.023 <span>GB</span>
                            </span>
                        </div>
                        <div class="charts"></div>
                    </div>
                    <div class="storage-card">
                        <div class="title">
                            <div class="images"></div>
                            <span class="label">
                                本月存储容量
                            </span>
                            <span class="numbers">
                                1013.023 <span>GB</span>
                            </span>
                        </div>
                        <div class="charts"></div>
                    </div>
                    <div class="storage-card">
                        <div class="title">
                            <div class="images"></div>
                            <span class="label">
                                本月存储容量
                            </span>
                            <span class="numbers">
                                1013.023 <span>GB</span>
                            </span>
                        </div>
                        <div class="charts"></div>
                    </div>
                </div>
                <div class="file-ruler">
                    <div class="section-separator">
                        <div class="separator-body">
                            <span class="separator-icon"></span>
                            <span class="separator-info">文件访问规则配置</span>
                        </div>
                    </div>
                    <div class="file-ruler-card"></div>
                    <div class="file-ruler-card"></div>
                    <div class="file-ruler-card"></div>
                    <div class="file-ruler-card"></div>
                </div>
                <div class="file-handle">
                    <div class="section-separator">
                        <div class="separator-body">
                            <span class="separator-icon"></span>
                            <span class="separator-info">文件处理</span>
                        </div>
                    </div>
                    <div class="file-handle-card"></div>
                    <div class="file-handle-card"></div>
                    <div class="file-handle-card"></div>
                </div>
            </Col>
            <Col span="5" class="right-section">
                <div class="button-section">
                    button-section
                </div>
                <div class="bucket-section"></div>
                <div class="update-history"></div>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {}
    }
}
</script>
<style scoped lang="less">
.@{css-prefix}overview {
    .left-section {
        padding-right: 20px;

        & > div {
            border: @common-border;
            padding: 16px;
            margin-bottom: 20px;
        }

        .storage {
            .storage-card {
                display: inline-block;
                border: @common-border;
                width: calc(~'33% - 11px');
                height: 300px;

                .title {
                    height: 100px;
                    border-bottom: @common-border;

                    .images {
                        position: relative;
                        height: 80px;
                        width: 80px;
                        top: 10px;
                        left: 10px;
                        background-image: url('../../assets/overview/capacity.png');
                        background-size: 80px;
                    }

                    .label {
                        position: relative;
                        left: 100px;
                        top: -78px;
                        font-size: 14px;
                        color: #475669;
                    }

                    .numbers {
                        position: relative;
                        left: 12px;
                        top: -32px;
                        font-size: 26px;
                        color: #475669;

                        span {
                            font-size: 14px;
                        }
                    }
                }
            }

            .storage-card:not(:last-child) {
                margin-right: 16px;
            }
        }

        .file-ruler {
            .file-ruler-card{
                display: inline-block;
                height: 80px;
                border: @common-border;
                width: calc(~'25% - 15px');
            }

            .file-ruler-card:not(:last-child) {
                margin-right: 16px;
            }
        }

        .file-handle {
            .file-handle-card{
                display: inline-block;
                height: 80px;
                border: @common-border;
                width: calc(~'33% - 11px');
            }

            .file-handle-card:not(:last-child) {
                margin-right: 16px;
            }
        }
    }
}
</style>


