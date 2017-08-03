<template>
  
</template>
<script>
export default {
    data () {
        return {}
    },
    created () {
        let _token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJuYW1lIjoic3NvX3Rlc3QiLCJ0b2tlbiI6IjU5ODJlOTM0ZTdlODYiLCJleHAiOjE1MDE3NTg4MDR9.qOLU41ExJdZWU5WVnbnN4N-ZYqx-CdAF8RvS18HFaXeAtrWKc9MIe-97RJPoDOP8lUBO4DJuRUf9UR5VtCEA7Q'
        let _router = this.$route.params.router || '/bucket'
        console.log(_token)

        if (_token) {
            try {
                this.$http.defaults.headers.common['Authorization'] = _token
                this.$store.dispatch('setToken', _token)
                console.log(this.$router)
            } catch (error) {
                console.log(error)
            }
        } else {
            window.location = `http://sso.qingcdn.com?router=${_router}`
        }
    }
}
</script>
