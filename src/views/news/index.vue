<template>
  <div class="container">
    <!-- 查询表单 :inline="true"行内表单-->
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="pageQuery.item"
      class="demo-form-inline"
    >
      <el-form-item prop="title">
        <el-input
          v-model="pageQuery.item.title"
          placeholder="请输入文章标题"
        />
      </el-form-item>
      <!-- <el-form-item prop="newsType">
        <el-select
          v-model="pageQuery.item.newsType"
          placeholder="请选择所属栏目"
        >
          <el-option
            v-for="option in newsTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item prop="releaseStatus">
        <el-select
          v-model="pageQuery.item.releaseStatus"
          placeholder="请选择发布状态"
        >
          <el-option
            v-for="option in releaseStatusOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="fetchData(pageQuery)"
        >查询
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="handleAddNews('0')"
        >添加公告</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表  -->
    <el-table :data="newsList" stripe border style="width: 95%">
      <el-table-column type="index" label="序号" width="50" />
      <!-- <el-table-column prop="newsType" label="所属栏目" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.newsType | newsTypeFilter }} </span>
        </template>
      </el-table-column> -->
      <el-table-column prop="title" label="文章标题">
        <template slot-scope="scope">
          <a class="title" @click="toNewsDetail(scope.row)">{{
            scope.row.title
          }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="releaseStatus" label="发布状态" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.releaseStatus | releaseStatusFilter }} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        :formatter="dateFormat"
        width="155"
      />
      <el-table-column
        prop="releaseTime"
        label="发布时间"
        :formatter="dateFormat"
        width="155"
      />
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleRelease(scope.row.newsId)"
          >{{
            scope.row.releaseStatus === "0" ? "发 布" : "撤 回"
          }}</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleEdit(scope.row.newsId)"
          >编 辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.newsId)"
          >删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :total="pageQuery.page.total"
      :page-sizes="[10, 5, 20]"
      :current-page="pageQuery.page.pageNum"
      :page-size="pageQuery.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 文章预览页面
    <el-dialog :visible.sync="dialogVisible" title="预览文章" center>
      <div>
        <h2 style="text-align: center">{{ this.new.title }}</h2>
        <p>
          <span>{{ dateFormat(this.new.releaseTime) }}</span>
        </p>
        <el-divider></el-divider>
        <div v-html="this.new.content"></div>
      </div>
    </el-dialog>
    -->
  </div>
</template>

<script>
// import edit from '@/views/announcement/edit'
import moment from 'moment'
import newsApi from '@/api/news'

// const newsTypeOptions = [
//   { type: "1", name: "信息公告" },
//   { type: "2", name: "新闻中心" },
// ];
const releaseStatusOptions = [
  { type: '0', name: '未发布' },
  { type: '1', name: '已发布' }
]

export default {
  name: 'TinymceDemo',
  filters: {
    // newsTypeFilter(type) {
    //   const obj = newsTypeOptions.find((obj) => obj.type === type);
    //   return obj ? obj.name : null;
    // },
    releaseStatusFilter(type) {
      const obj = releaseStatusOptions.find((obj) => obj.type === type)
      return obj ? obj.name : null
    }
  },
  data() {
    return {
      newsList: [],
      pageQuery: {
        page: {
          total: 10, // 总记录数
          pageNum: 1, // 当前页,，默认第1页
          pageSize: 10 // 每页显示条数，10条
        },
        item: {
          title: '', // 标题
          // newsType: "", // 所属栏目
          releaseStatus: '' // 发布状态
        }
      },
      // newsTypeOptions,
      releaseStatusOptions,
      dialogVisible: false,
      new: {
        newId: '',
        title: '',
        releaseTime: '',
        content: ``
      }
    }
  },
  created() {
    this.fetchData(this.pageQuery)
  },
  methods: {
    fetchData(pageQuery) {
      newsApi.getNewsList(pageQuery).then((response) => {
        const resp = response.data
        this.pageQuery.page.total = resp.total
        this.newsList = resp.list
        // 重置item
        this.$refs['ruleForm'].resetFields()
      })
    },
    // 预览文章
    toNewsDetail(row) {
      this.$router.push({
        path: `/newsDetail/${row.newsId}`
      })
    },
    // 进入添加文章页面
    handleAddNews(id) {
      this.$router.push(`/system/news/edit/${id}`)
    },
    // 发布、撤回文章
    handleRelease(newsId) {
      var that = this
      newsApi.releaseNews(newsId).then((response) => {
        if (response.resultCode == 200) {
          this.dialogFormVisible = false
          this.$message({
            message: '成功',
            type: 'success'
          })
          that.fetchData(this.pageQuery)
        } else {
          // 失败 弹出提示
          this.$message({
            message: 'response.message',
            type: 'warning'
          })
        }
      })
    },
    // 编辑文章
    handleEdit(id) {
      this.$router.push(`/system/news/edit/${id}`)
    },
    // 删除文章
    handleDelete(id) {
      this.$confirm('确认删除这篇文章吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        type: 'warning'
      })
        .then(() => {
          // 确认
          var that = this
          newsApi.deleteById(id).then((response) => {
            // 提示信息
            this.$message({
              type: response.resultCode == 200 ? 'success' : 'error',
              message: response.message
            })
            if (response.resultCode == 200) {
              // 删除成功 刷新列表
              that.fetchData(this.pageQuery)
            }
          })
        })
        .catch(() => {
          // 取消删除 不理会
        })
    },
    // 分页
    handleSizeChange(val) {
      // 当每页显示条数改变后 被触发
      console.log(val)
      this.pageQuery.page.pageSize = val
      this.fetchData(this.pageQuery)
    },
    handleCurrentChange(val) {
      // 当页码改变后 被触发
      console.log(val)
      debugger
      this.pageQuery.page.pageNum = val
      this.fetchData(this.pageQuery)
    },
    // 时间格式化
    dateFormat(row, column) {
      var date = row[column.property]
      if (date == undefined) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped>
.editor-content {
  margin-top: 20px;
}
.title {
  font-size: 16px;
  cursor: pointer;
  color: #3198ff;
  text-decoration: none;
}
</style>

