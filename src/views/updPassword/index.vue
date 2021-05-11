<template>
  <div class="container">
    <h2>请先修改密码</h2>
    <el-form
      ref="passWordForm"
      :model="passWordForm"
      :rules="loginRules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input
          v-model="passWordForm.oldPwd"
          style="width: 300px"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="pwd">
        <el-input
          v-model="passWordForm.pwd"
          style="width: 300px"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="重复密码" prop="pwd2">
        <el-input
          v-model="passWordForm.pwd2"
          style="width: 300px"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('passWordForm')"
        >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updPwd } from '@/api/user'
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
      passWordForm: {
        oldPwd: '',
        pwd: '',
        pwd2: ''
      },
      loginRules: {
        oldPwd: [
          { required: true, trigger: 'blur', message: '原密码不能为空！' }
        ],
        pwd: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      if (this.passWordForm.pwd != this.passWordForm.pwd2) {
        this.$message.error('两次密码不一致！')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updPwd(this.passWordForm.oldPwd, this.passWordForm.pwd)
            .then((response) => {
              debugger
              if (response.resultCode == 200) {
                this.$message({
                  message: '修改成功,请重新登录！',
                  type: 'success'
                })
                // 修改成功，退回到登录页
                this.logout()
              } else {
                // 失败 弹出提示
                this.$message({
                  message: 'response.message',
                  type: 'warning'
                })
              }
            })
            .catch()
        } else {
          return false
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}
</script>

<style>
</style>
