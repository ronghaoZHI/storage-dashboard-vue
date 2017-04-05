<template>
    <div class="layout-header">
        <div class="layout-header-left">
            <a>CDN-X</a>
            <a>CWN-X</a>
            <a>CLN-X</a>
        </div>
        <div class="layout-header-right">
            <Dropdown style="margin-left: 20px"
                      placement="bottom-end">
                <a class="dropdown-link"
                   href="javascript:void(0)">{{username}}</a>
                <Dropdown-menu slot="list">
                    <Dropdown-item disabled>Change password</Dropdown-item>
                    <Dropdown-item divided>Logout</Dropdown-item>
                </Dropdown-menu>
            </Dropdown>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    mounted() {

    },
    props: ['username'],
    methods: {

    }
}

</script>
<style lang="less" scoped>
.layout-header {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    .layout-header-right {
        margin-right: 16px;
    }
    .dropdown-link {
        color: #657180;
        font-size: 14px;
        font-weight: bolder;
    }
}

.layout-header-left{
    a {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        width: 90px;
    }
}
</style>