<template>
  <div>
    <div class="head-wrap" />
    <div class="login-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        label-position="left"
      >
        <br><br>
        <div class="title_text">
          <div class="title">实验室预约管理系统</div>
        </div>

        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入账号"
            name="username"
            type="text"
            tabindex="1"
            prefix-icon="el-icon-user"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model="loginForm.password"
            show-password
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            name="password"
            type="password"
            tabindex="2"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 20px"
          @click.native.prevent="handleLogin"
        >登录</el-button>
        <el-link type="primary" style="float: right;">忘记密码</el-link>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '账号不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      // passwordType: "password",

      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          // 验证账号密码是否通过
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push('/')
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.head-wrap {
  height: 80px;
  background: #fff;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 600px;
  background: url("../../assets/login(1).jpg");
  overflow: hidden;
}
.login-form {
  margin-top: 70px;
  padding: 0px 30px;
  width: 320px;
  height: 360px;
  background: #fff;
  position: absolute;
  right: 120px;
  border-radius: 5px;
}

/* 标题 */
.title_text {
  line-height: 45px;
  padding-bottom: 50px;
  border-bottom: 1px solid #3a6dee;
  margin-bottom: 22px;
}
.title {
  font-size: 24px;
  color: #333;
  float: left;
}
.el-button {
  display: inline-block;
  width: 150px;
  height: 42px;
}
.el-form-item__content {
  margin-left: 100px;
}

</style>
