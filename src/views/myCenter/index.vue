<template>
  <div class="container center">
    <el-card style="width: 600px; margin-top: 50px; margin-left: 350px">
      <div>
        <el-form ref="ruleForm" :model="userInfo" label-width="100px">
          <el-form-item label="头像" prop="loginName">
            <el-avatar :size="100" :src="userInfo.avatar">{{
              userInfo.realName
            }}</el-avatar>

            <el-button
              class="btn"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="toggleShow"
            />
          </el-form-item>
          <el-form-item label="登录名" prop="pwd2">
            <el-input
              v-model="userInfo.loginName"
              style="width: 300px"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item label="姓名" prop="pwd">
            <el-input
              v-model="userInfo.realName"
              style="width: 300px"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item label="院系" prop="pwd">
            <el-input
              v-model="userInfo.institute"
              style="width: 300px"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item label="专业" prop="pwd">
            <el-input
              v-model="userInfo.major"
              style="width: 300px"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item label="性别" prop="pwd">
            <el-radio v-model="userInfo.sex" label="1">男</el-radio>
            <el-radio v-model="userInfo.sex" label="2">女</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="toUpdPassword()"
            >修改密码</el-button>
            <el-button type="primary" @click="updataDate()">保 存</el-button>
            <el-button type="danger" style="float: right" @click="quit()">返 回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <my-upload
      v-model="show"
      field="file"
      :width="100"
      :height="100"
      url="/dev-api/uploadFile"
      :no-square="true"
      :headers="headers"
      :params="params"
      img-format="png"
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
    />

    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码" :visible.sync="dialogVisible">
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
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm('passWordForm')"
        >修 改</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getInfo, updPwd } from '@/api/user'
import userApi from '@/api/users'
import myUpload from 'vue-image-crop-upload/upload-2.vue'
import store from '@/store'

export default {
  components: {
    'my-upload': myUpload
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      userInfo: {},
      dialogVisible: false,
      passWordForm: {
        oldPwd: '',
        pwd: '',
        pwd2: ''
      },
      loginRules: {
        oldPwd: [
          { required: true, trigger: 'blur', message: '原密码不能为空！' }
        ],
        pwd: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },

      show: false,
      headers: {
        Token: ''
      },
      params: {
        userId: ''
      }
    }
  },
  // 钩子函数获取数据
  created() {
    const Token = getToken()
    this.fetchData(Token)
    this.headers.Token = Token
  },
  methods: {
    // 查询
    fetchData(Token) {
      getInfo(Token).then((response) => {
        this.userInfo = response.data
        this.params.userId = this.userInfo.userId
      })
    },
    // 修改
    updataDate() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 验证通过，提交添加
          var that = this
          userApi.update(this.userInfo).then((response) => {
            if (response.resultCode == 200) {
              this.dialogFormVisible = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              debugger
              // 修改vuex中的用户头像信息
              store.commit('user/SET_AVATAR', this.userInfo.avatar)
            } else {
              // 失败 弹出提示
              this.$message({
                message: 'response.message',
                type: 'warning'
              })
            }
          })
        } else {
          // 验证失败
          return false
        }
      })
    },
    toUpdPassword() {
      this.dialogVisible = true
      this.$nextTick(() => {
        // 弹出窗口打开后，需要加载Dom 就需要花费一点时间，
        // 我们就应该等待它加载完DOM之后 再进行调用resetFields方法，重置表单和清除样式
        // this.$nextTick() 它是一个异步事件 当渲染结束之后 它的回调函数才会被执行
        this.$refs['passWordForm'].resetFields()
      })
    },
    submitForm(formName) {
      this.$refs.passWordForm.validate((valid) => {
        if (valid) {
          if (this.passWordForm.pwd != this.passWordForm.pwd2) {
            this.$message.error('两次密码不一致！')
            return
          }
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
    },
    quit() {
      this.$router.push({
        path: `/home`
      })
    },
    toggleShow() {
      this.show = !this.show
    },
    /**
     * crop success
     *
     * [param] imgDataUrl
     * [param] field
     */
    cropSuccess(imgDataUrl, field) {
      this.userInfo.avatar = imgDataUrl
    },
    /**
     * upload success
     *
     * [param] jsonData   服务器返回数据，已进行json转码
     * [param] field
     */
    cropUploadSuccess(jsonData, field) {
      debugger
      this.userInfo.avatar = jsonData.fileDownloadUri
    },
    /**
     * upload fail
     *
     * [param] status    server api return error status, like 500
     * [param] field
     */
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    }
  }
}
</script>

<style scoped>
.center {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  background: url("../../assets/background2.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.btn {
  position: absolute;
  top: 65px;
  left: 80px;;
}
</style>
