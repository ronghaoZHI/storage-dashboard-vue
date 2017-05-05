<template>
    <div>
        <div class="layout-header">
            <div class="layout-header-left">
                <a>CDN-X</a>
                <a class="active">CWN-X</a>
                <a>CLN-X</a>
            </div>
            <div class="layout-header-right">
                <div class="button-document" @click="openDoc">
                    <Icon type="help-circled" :size="18"></Icon>
                </div>
                <Dropdown style="margin-left: 3px"
                          @on-click="menuClick"
                          placement="bottom-end">
                    <a class="dropdown-link"
                       href="javascript:void(0)">{{username}}</a>
                    <Icon type="chevron-down"
                          class="icon-top-down"></Icon>
                    <Dropdown-menu slot="list">
                        <Dropdown-item name="rePasssword">Change password</Dropdown-item>
                        <Dropdown-item name="logout">Logout</Dropdown-item>
                    </Dropdown-menu>
                </Dropdown>
            </div>
        </div>
        <Modal v-model="rePasswordModal"
               title="Change password"
               ok-text="OK"
               @on-ok="changePassword"
               @on-cancel="rePasswordModal = false"
               cancel-text="Cancel">
            <Form ref="rePasswordForm"
                  :model="rePasswordForm"
                  :rules="ruleValidate"
                  :label-width="80">
                <Form-item label="Password"
                           prop="password">
                    <Input v-model="rePasswordForm.password"
                           placeholder="New password"></Input>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { LOGOUT, REPASSWORD } from '../service/API'
import { clear } from '../service/Aws'
import user from '../../store/modules/user'
export default {
    data() {
        return {
            rePasswordModal: false,
            rePasswordForm: {
                password: ''
            },
            ruleValidate: {
                password: [
                    { required: true,len: 6, message: 'Requires 6 charactors', trigger: 'blur' }
                ]
            }
        }
    },
    props: ['username'],
    methods: {
        async menuClick(name) {
            if (name === 'logout') {
                try {
                    await this.$http.post(LOGOUT)
                    await this.$store.dispatch('logout')
                    clear() && this.$router.push('/login')
                } catch (error) {
                    console.log(error)
                    this.$router.push('/login')
                    this.$Message.error('Logout failed,please login')
                }
            } else if (name === 'rePasssword') {
                this.rePasswordModal = true
            }
        },
        async changePassword() {
            if(this.rePasswordForm.password.length < 6){
                this.$Message.error('The password requires 6 charactors')
                return false
            }
            try {
                await this.$http.post(REPASSWORD,{email: user.state.email,password:this.rePasswordForm.password})
                await this.$http.post(LOGOUT)
                await this.$store.dispatch('logout')
                this.$router.push('/login')
            } catch (error) {
                console.log(error)
                this.$Message.error('Change password failed')
            }
        },
        openDoc() {
            window.open('http://doc.bscstorage.com')
        }
    }
}
</script>
<style lang="less" scoped>
.layout-header {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    width: 100%;
    background: #20a0ff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    .layout-header-right {
        margin-right: 16px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
    .dropdown-link {
        color: #fff;
        font-size: 18px;
        font-weight: bolder;
    }
}

.button-document {
    font-size: 18px;
    color: #fff;
    font-weight: bolder;
    padding-right: 10px;
    margin-right: 10px;
    border-right: 1px solid #1b8de2;
    cursor: pointer;
    i {
        position: relative;
        top: 1px;
        left: -4px;
    }
}

.layout-header-left {
    a {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        font-weight: bolder;
        height: 60px;
        width: 140px;
        color: #fff;
    }
    .active{
        background-color: #1d8ce0;
    }
}
.ivu-form-item{
    margin-bottom: 0
}
.icon-top-down {
    font-size: 16px;
    padding-left: 8px;
    color: #fff
}
</style>