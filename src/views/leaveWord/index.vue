<template>
  <div class="container">
    <!-- <br />
     <el-input
      type="text"
      placeholder="请输入你的名字"
      v-model="messageBoard.author"
      maxlength="16"
      show-word-limit
      style="width: 400px"

    >
    </el-input> -->
    <div style="margin: 20px 0" />
    <el-input
      v-model="message"
      type="textarea"
      placeholder="请输入留言...."
      show-word-limit
      rows="5"
      maxlength="200"
      style="width: 800px"
    />
    <div style="margin: 20px auto">
      <el-button type="primary" plain @click="postMessage">留言</el-button>
    </div>
    <el-divider />
    <el-table :data="messagesList" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="userName" label="学号" width="200" />
      <el-table-column prop="content" label="留言" />
      <el-table-column prop="time" label="时间" width="160" />
    </el-table>
    <el-pagination
      small
      :total="page.total"
      :page-size="page.pageSize"
      :current-page="page.pageNum"
      layout="prev, pager, next"
      style="text-align: center"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import messageApi from '@/api/message'

export default {
  name: 'LeaveWord',
  data() {
    return {
      messagesList: [],
      message: '',
      page: {
        pageSize: 20,
        pageNum: 1
      }
    }
  },
  created() {
    this.getMessages(this.page)
  },
  methods: {
    getMessages(page) {
      messageApi.getMessages(page).then((response) => {
        const resp = response.data
        this.messagesList = resp.list
        this.page.total = resp.total
      })
    },
    postMessage() {
      if (this.message === '') {
        this.$message.error('请输入留言')
        return
      }

      messageApi.postMessage(this.message).then((t) => {
        if (t.resultCode == 200) {
          this.$message({
            message: '留言成功',
            type: 'success'
          })
          // 清空文本框内容
          this.message = ''
          // 刷新留言板
          this.getMessages(this.page)
        } else {
          this.$message.error('留言失败')
        }
      })
    },
    // 分页
    handleCurrentChange(val) {
      // 当页码改变后 被触发
      console.log(val)
      this.page.pageNum = val
      this.getMessages(this.page)
    }
  }

}
</script>

<style scoped>
</style>
