<style lang="less" scoped src="./login-form.less"></style>
<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="username" style="margin-bottom:40px;">
      <Input  class="input1" v-model="form.username" placeholder="请输入用户名">
      </Input>
    </FormItem>
    <FormItem prop="password" style="margin-bottom:40px;">
      <Input  class="input2" type="password" v-model="form.password" placeholder="请输入密码">
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" :loading="loading"  class="from_button" style="box-shadow:none">登录</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    loading:{
      type: Boolean,
    },
    usernameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        username: this.usernameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            username: this.form.username,
            password: this.form.password
          })
        }
      })
    }
  }
}
</script>
