<template>
  <div class="container">
    <div style="margin-right: 50px; margin-bottom: 10px; height: 40px">
      <el-button size="mini" @click="off()">取 消</el-button>
      <!-- pojo.newsId === '' ? addNews() : updataNews() -->
      <el-button
        v-if="pojo.newsId === ''"
        size="mini"
        type="primary"
        @click="addNews()"
      >添 加</el-button>
      <el-button
        v-if="pojo.newsId != ''"
        size="mini"
        type="primary"
        @click="updataNews()"
      >保 存</el-button>
    </div>

    <el-form
      ref="pojoForm"
      status-icon
      :model="pojo"
      label-width="70px"
      label-position="right"
    >
      <!-- <el-form-item label="所属栏目" prop="newsType">
        <el-select v-model="pojo.newsType" placeholder="请选择所属栏目">
          <el-option
            v-for="option in newsTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="标题">
        <el-input
          v-model="pojo.title"
          placeholder="请输入文章标题"
          style="width: 625px"
        />
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div>
          <tinymce v-model="pojo.content" :height="500" />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import newsApi from '@/api/news'
import Tinymce from '@/components/Tinymce'

// const newsTypeOptions = [
//   { type: "1", name: "信息公告" },
//   { type: "2", name: "新闻中心" },
// ];

export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {
      id: (this.$route.params && this.$route.params.id),
      pojo: {
        newsId: '',
        newsType: '',
        title: '',
        content: ``
      }
      // newsTypeOptions,
    }
  },
  created() {
    this.fetchData(this.id)
  },
  methods: {
    addNews() {
      // 判空
      if (this.pojo.title === '') {
        this.$message.error('请输入文章标题')
        return
      }
      if (this.pojo.content === '') {
        this.$message.error('请输入文章正文')
        return
      }
      newsApi.addNews(this.pojo).then((response) => {
        if (response.resultCode == 200) {
          this.dialogFormVisible = false
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.off()
        } else {
          // 失败 弹出提示
          this.$message({
            message: 'response.message',
            type: 'warning'
          })
        }
      })
    },
    fetchData(id) {
      if (id === '0') {
        return
      }
      if (id != '' || id != null || typeof (id) !== undefined || id != 'undefined') {
        newsApi.getNewsDetail(id).then((response) => {
          this.pojo = response.data
        })
      }
    },
    updataNews() {
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          // 验证通过，提交添加
          var that = this
          newsApi.update(this.pojo).then((response) => {
            if (response.resultCode == 200) {
              this.dialogFormVisible = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              // 修改成功 退回到文章列表页
              that.off()
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
    off() {
      this.$router.push(`/news/index`)
    }
  }
}
</script>

<style scoped>
.editor-content {
  margin-top: 20px;
}
</style>

