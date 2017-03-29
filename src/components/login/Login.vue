<template>
    <div class="section-login">
        <div class="bg-login"></div>
        <img src="../../assets/logo.png"/> 
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
                        @click="handleSubmit('formInline')">登录</Button>
            </Form-item>
        </Form>
    </div>
</template>
<script>
import { handler } from '../service/Aws'
import moment from 'moment'
export default {
    data() {
        return {
            formInline: {
                email: '',
                password: ''
            },
            ruleInline: {
                email: [
                    { required: true, message: '请填写邮箱地址', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请填写密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {

    },
    components: {

    },

    methods: {
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('提交成功!');
                } else {
                    this.$Message.error('表单验证失败!');
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
    button{
        width: 250px;
    }
    img{
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