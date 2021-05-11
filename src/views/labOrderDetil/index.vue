<template>
  <div class="container">
    <!-- 数据列表  -->
    <el-table :data="labOrderList" stripe border style="width: 95%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="loType" label="预约类型" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.loType | orderTypeFilter }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="lname" label="实验室" />
      <el-table-column prop="expName" label="实验" />
      <el-table-column prop="laddress" label="实验室地址" />
      <el-table-column
        prop="startTime"
        label="开始时间"
        :formatter="dateFormat"
        width="155"
      />
      <el-table-column
        prop="endTime"
        label="截止时间"
        :formatter="dateFormat"
        width="155"
      />
      <!-- <el-table-column prop="condition" label="预约情况" width="100">
        <template slot-scope="scope">
          {{ scope.row.loCap - scope.row.loOdd }}/{{ scope.row.loCap }}
        </template>
      </el-table-column> -->
      <el-table-column prop="loState" label="预约状态" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.loState | orderStateFilter }} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.loState == 1"
            size="mini"
            type="warning"
            @click="handleCancel(scope.row.loId)"
          >取消预约</el-button>
          <p v-if="scope.row.loState != 1">不可取消</p>
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
  </div>
</template>

<script>
import orderApi from '@/api/order'
import moment from 'moment'
// 预约类型
const orderTypeOptions = [
  { type: '1', name: '开放实验室' },
  { type: '2', name: '教学实验室' }
]
const orderStateOptions = [
  { type: '1', name: '已预约' },
  { type: '2', name: '进行中' },
  { type: '3', name: '已结束' }
]
export default {
  filters: {
    orderTypeFilter(type) {
      const obj = orderTypeOptions.find((obj) => obj.type === type)
      return obj ? obj.name : null
    },
    orderStateFilter(type) {
      const obj = orderStateOptions.find((obj) => obj.type === type)
      return obj ? obj.name : null
    }
  },

  components: {},
  data() {
    return {
      labOrderList: [],
      pageQuery: {
        page: {
          total: 10, // 总记录数
          pageNum: 1, // 当前页,，默认第1页
          pageSize: 10 // 每页显示条数，10条
        },
        item: {
          loType: '', // 预约类型
          lName: '', // 实验室名称
          lAddress: '', // 实验室地址
          expName: '' // 实验名称
        }
      },
      rules: {}

    }
  },
  // 钩子函数获取数据
  created() {
    this.fetchData(this.pageQuery)
  },

  methods: {
    // 查询
    fetchData(pageQuery) {
      orderApi.getOrderListByUser(pageQuery).then((response) => {
        const resp = response.data
        this.pageQuery.page.total = resp.total
        this.labOrderList = resp.list
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
      this.pageQuery.page.pageNum = val
      this.fetchData(this.pageQuery)
    },
    // 取消预约
    handleCancel(id) {
      this.$confirm('确认取消这个预约吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        type: 'warning'
      })
        .then(() => {
          // 确认
          var that = this
          orderApi.cencelOrder(id).then((response) => {
            // 提示信息
            this.$message({
              type: response.resultCode == 200 ? 'success' : 'error',
              message: '取消成功！'
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
