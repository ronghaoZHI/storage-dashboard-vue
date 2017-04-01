<template>
    <div class="section-login">
        <div class="bg-login"></div>
        <img src="../../assets/logo.png" alt="logo" />
        <Form ref="formInline"
              :model="formInline"
              :rules="ruleInline"
              class="form-login">
            <Form-item prop="email">
                <Input type="text"
                       v-model="formInline.email"
                       placeholder="Email">
                <Icon type="ios-email-outline"
                      slot="prepend"></Icon>
                </Input>
            </Form-item>
            <Form-item prop="password">
                <Input type="password"
                       v-model="formInline.password"
                       placeholder="Password">
                <Icon type="ios-locked-outline"
                      slot="prepend"></Icon>
                </Input>
            </Form-item>
            <Form-item>
                <Button type="primary"
                        @click="handleSubmit('formInline')">Login</Button>
            </Form-item>
        </Form>
    </div>
</template>
<script>
import { LOGIN, USERINFO } from '../service/API'
export default {
    data() {
        return {
            formInline: {
                email: '',
                password: ''
            },
            ruleInline: {
                email: [
                    { required: true, message: 'Need email', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Need password', trigger: 'blur' },
                    { type: 'string', min: 6, message: 'Requires 6 charactors', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {

    },
    components: {

    },

    methods: {
        async handleSubmit(name) {
            let _this = this
            this.$refs[name].validate((valid) => {
                if (valid) {
                    _this.$http.post(LOGIN, {..._this.formInline}).then(res => {
                        this.$store.dispatch('setUserInfo', res)
                        let redirect = this.$route.query.redirect //get redirect path
                        !!redirect ? this.$router.push(redirect) : this.$router.push('/')
                    },err => {
                        this.$Message.error('Login fail')
                    })
                } else {
                    this.$Message.error('Input validate fail')
                }
            })
        }
    }
}

</script>
<style lang="less" scoped>
.section-login {
    height: 100%;
    .bg-login {
        height: 100%;
        opacity: 0.6;
        filter: alpha(opacity=60);
        background: url('../../assets/background.jpg') no-repeat
    }
    .form-login {
        position: absolute;
        margin: 350px auto auto auto;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 250px;
    }
    button {
        width: 250px;
    }
    img {
        position: absolute;
        margin: 285px auto auto auto;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 250px;
    }
}
</style>