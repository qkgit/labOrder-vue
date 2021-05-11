<template>
  <div class="container">
    <!-- 数据列表  -->
    <el-table :data="userList" stripe border style="width: 95%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column
        prop="loginName"
        label="学号/工号"
        width="150"
      />
      <el-table-column
        prop="realName"
        label="预约人"
        width="100"
      />

      <el-table-column prop="roles" label="身份" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.roles | rolesFilter }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="institute" label="院系" />
      <el-table-column prop="major" label="专业" />
      <el-table-column
        prop="orderTime"
        label="预约时间"
        :formatter="dateFormat"
        width="155"
      />
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
  </div>
</template>

<script>
import moment from 'moment'
import orderApi from '@/api/order'

const userRoles = [
  { type: '0', name: '管理员' },
  { type: '1', name: '教师' },
  { type: '2', name: '学生' }
]
export default {
  filters: {
    rolesFilter(type) {
      const obj = userRoles.find((obj) => obj.type === type)
      return obj ? obj.name : null
    }
  },
  data() {
    return {
      userList: [],
      pageQuery: {
        page: {
          total: 10, // 总记录数
          pageNum: 1, // 当前页,，默认第1页
          pageSize: 10 // 每页显示条数，10条
        },
        item: {
          loId: this.$route.params && this.$route.params.id
        }
      },
      userRoles
    }
  },
  created() {
    this.fetchData(this.pageQuery)
  },
  methods: {
    fetchData(pageQuery) {
      orderApi.getOrderDetail(pageQuery).then((response) => {
        const resp = response.data
        this.userList = resp.list
      })
    },
    // 分页
    handleSizeChange(val) {
      // 当每页显示条数改变后 被触发
      this.pageQuery.page.pageSize = val
      this.fetchData(this.pageQuery)
    },
    handleCurrentChange(val) {
      // 当页码改变后 被触发
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
</style>
