<template>
  
</template>
<script>
import { USERINFO, BOUND_USER } from '@/service/API'
import user from '@/store/modules/user'
import Vue from 'vue'
export default {
    data () {
        return {
            lang: localStorage.getItem('lang') || 'cn',
            selectedCustomer: '',
            isLogin: !(!!user.state && user.state.type === 'admin'),
            userInfo: user.state || {},
            subUserList: user.state.subUserList || []
        }
    },
    created () {
        console.log(this.$route.query)
        let _token = this.$route.query.ticket || 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjU5N2FlZmRkODYzM2YiLCJuYW1lIjoidXNlcl9teXkiLCJleHAiOjE1MDE5NDE2MDB9.XReR-642zoO1VaW2Iq-a77oI65XVGdimTzWisG-I2PNq_WjjXZKaOKhEisNas-NuHNO7CHO3kxiXT0Ya5IhsjA'
        let _router = this.$route.query.callback || '/bucket'
        console.log(_token)

        if (_token) {
            try {
                this.$http.defaults.headers.common['Authorization'] = _token
                this.$store.dispatch('setToken', _token)
            } catch (error) {
                console.log(error)
            }
        } else {
            window.location = `http://sso.qingcdn.com/web/user/checkLogin?appId=2&callback=${_router}`
        }
    },
    methods: {
        async getUserInfo (name) {
            this.$http.get(USERINFO).then(res => {
                res.type === 'admin' ? this.adminMode(res) : this.toIndex(res)
                this.$Loading.finish()
            }, error => {
                this.$Loading.error()
                this.$Message.error(error)
            })
        },
        async adminMode (data) {
            let res = await this.$http.get(BOUND_USER)
            this.userInfo = data
            if (res.length > 0) {
                this.subUserList = res
                this.isLogin = false
                await this.$store.dispatch('setUserInfo', {
                    ...data,
                    subUserList: this.subUserList
                })
            } else {
                this.toIndex(data, 'user')
            }
        },
        selectSubUser (user) {
            this.toIndex({
                ...this.userInfo,
                subUser: user,
                subUserList: this.subUserList
            })
        },
        async toIndex (data, router = '/') {
            await this.$store.dispatch('setUserInfo', data)
            await this.refreshMenu()

            let redirect = this.$route.query.callback // get redirect path
            !!redirect ? this.$router.push(redirect) : this.$router.push(router)
            Vue.config.lang = this.lang
        },
        changeLang (lang) {
            Vue.config.lang = lang
            this.lang = lang
            sessionStorage.removeItem('lang')
            sessionStorage.setItem('lang', lang)
        },
        refreshMenu () {
            this.$store.dispatch('refreshMenu')
        },
        showPw () {
            let $input = $('.input-password')[0]
            if ($input.type === 'password') {
                this.showPassword = true
                $input.type = 'text'
            } else {
                this.showPassword = false
                $input.type = 'password'
            }
        },
        async toUserMange () {
            await this.refreshMenu()
            Vue.config.lang = this.lang
            this.$router.push('user')
        }
    }
}
</script>
