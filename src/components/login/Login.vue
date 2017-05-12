<template>
    <div class="section-login" @keyup.enter="handleSubmit('formInline')">
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
            let self = this
            this.$refs[name].validate((valid) => {
                if (valid) {
                    self.$http.post(LOGIN, {...self.formInline}).then(res => {
                        this.$store.dispatch('setUserInfo', res.data)
                        let redirect = this.$route.query.redirect //get redirect path
                        !!redirect ? this.$router.push(redirect) : this.$router.push('/')
                    },error => {
                        this.$Message.error(error)
                    })
                } else {
                    this.$Message.error('Input validate failed')
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
        margin: 300px auto auto auto;
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
        margin: 235px auto auto auto;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 250px;
    }
}
</style>