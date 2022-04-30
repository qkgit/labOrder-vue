<template>
  <div class="container">
    <!-- 查询表单 :inline="true"行内表单-->
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="pageQuery.item"
      class="demo-form-inline"
    >
      <el-form-item prop="loType">
        <el-select
          v-model="pageQuery.item.loType"
          placeholder="请选择实验室预约类型"
        >
          <el-option
            v-for="option in orderTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="lAddress">
        <el-input
          v-model="pageQuery.item.lAddress"
          placeholder="实验室地址"
        />
      </el-form-item>
      <el-form-item prop="lName">
        <el-input
          v-model="pageQuery.item.lName"
          placeholder="实验室名称"
        />
      </el-form-item>
      <el-form-item prop="expName">
        <el-input
          v-model="pageQuery.item.expName"
          placeholder="实验名称"
        />
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
          @click="handleAdd"
        >添加实验室预约</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表  -->
    <el-table :data="labOrderList" stripe border style="width: 95%">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="loType" label="预约类型" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.loType | orderTypeFilter }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="lname" label="实验室">
        <template slot-scope="scope">
          <a class="title" @click="toOrderDetail(scope.row)">{{
            scope.row.lname
          }}</a>
        </template>
      </el-table-column>
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
      <el-table-column prop="condition" label="预约情况" width="60">
        <template slot-scope="scope">
          {{ scope.row.loCap - scope.row.loOdd }}/{{ scope.row.loCap }}
        </template>
      </el-table-column>
      <el-table-column prop="loState" label="预约状态" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.loState | orderStateFilter }} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.loState == 1"
            size="mini"
            type="primary"
            @click="handleEdit(scope.row.loId)"
          >修改</el-button>
          <el-button
            v-if="scope.row.loState == 1"
            size="mini"
            type="danger"
            @click="handleSuspend(scope.row.loId)"
          >中止</el-button>
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
    <!-- 新增对话框 -->
    <el-dialog title="添加实验室预约" :visible.sync="dialogFormVisible">
      <el-form
        ref="pojoForm"
        status-icon
        :model="pojo"
        :rules="rules"
        label-width="150px"
        label-position="right"
        style="width: 400px"
      >
        <el-form-item label="实验室预约类型" prop="loType">
          <el-select v-model="pojo.loType" placeholder="请选择实验室预约类型">
            <el-option
              v-for="option in orderTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="实验室" prop="lid">
          <el-select
            v-model="pojo.lid"
            placeholder="请选择实验室"
            style="width: 300px"
            @change="getExpByLId"
          >
            <el-option
              v-for="laboption in labList"
              :key="laboption.lid"
              :label="laboption.lname + ' --- ' + laboption.laddress"
              :value="laboption.lid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="实验" prop="expId">
          <el-select
            v-model="pojo.expId"
            placeholder="请选择实验"
            style="width: 300px"
          >
            <el-option
              v-for="expoption in expList"
              :key="expoption.expId"
              :label="expoption.expName"
              :value="expoption.expId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="起止时间" prop="time">
          <el-date-picker
            v-model="pojo.time"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="pojo.loId === '' ? addData() : updataDate()"
        >确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orderApi from '@/api/order'
import moment from 'moment'
import labApi from '@/api/labs'
// 预约类型
const orderTypeOptions = [
  { type: '1', name: '开放实验室' },
  { type: '2', name: '教学实验室' }
]
const orderStateOptions = [
  { type: '1', name: '可预约' },
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
      labList: [],
      expList: [],
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
      orderTypeOptions,
      orderStateOptions,
      pojo: {
        loId: '',
        lid: '',
        lName: '',
        loType: '',
        lAddress: '',
        lCap: '',
        expId: '',
        expName: '',
        startTime: '',
        endTime: '',
        time: ['', '']
      },
      dialogFormVisible: false, // 是否显示弹出对话框
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
      orderApi.getLabList(pageQuery).then((response) => {
        const resp = response.data
        this.pageQuery.page.total = resp.total
        this.labOrderList = resp.list
        // 重置item
        this.$refs['ruleForm'].resetFields()
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
    // 打开添加窗口
    handleAdd() {
      // 获取实验室列表（实验室id 名称 地址 类型 容量）/ 显示名称
      labApi.getAllLab().then((response) => {
        this.labList = response.data
      })
      // 清空实验列表
      this.expList = []
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // 弹出窗口打开后，需要加载Dom 就需要花费一点时间，
        // 我们就应该等待它加载完DOM之后 再进行调用resetFields方法，重置表单和清除样式
        // this.$nextTick() 它是一个异步事件 当渲染结束之后 它的回调函数才会被执行
        this.$refs['pojoForm'].resetFields()
      })
    },
    // 打开编辑窗口
    handleEdit(id) {
      // 打开弹出窗口
      this.handleAdd()
      // //通过id查询数据
      orderApi.getById(id).then((response) => {
        const resp = response.data
        this.pojo = resp
        this.pojo.time = [moment(this.pojo.startTime).format('YYYY-MM-DD HH:mm:ss'), moment(this.pojo.endTime).format('YYYY-MM-DD HH:mm:ss')]
      })
    },
    // 添加
    addData() {
      this.pojo.startTime = new Date(this.pojo.time[0])
      this.pojo.endTime = new Date(this.pojo.time[1])
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          var that = this
          // 验证通过，提交添加
          orderApi.addLabOrder(this.pojo).then((response) => {
            if (response.resultCode == 200) {
              this.dialogFormVisible = false
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              // 新增成功 刷新数据列表
              that.fetchData(this.pageQuery)
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
    // 修改
    updataDate() {
      console.log('修改方法调用')
      this.pojo.startTime = new Date(this.pojo.time[0])
      this.pojo.endTime = new Date(this.pojo.time[1])
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          // 验证通过，提交添加
          var that = this
          orderApi.update(this.pojo).then((response) => {
            if (response.resultCode == 200) {
              this.dialogFormVisible = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              // 修改成功 刷新数据列表
              that.fetchData(this.pageQuery)
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

    // 中止
    handleSuspend(id) {
      console.log('中止' + id)
      this.$confirm('确认中止这个预约吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        type: 'warning'
      })
        .then(() => {
          // 确认
          var that = this
          orderApi.suspendById(id).then((response) => {
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
    toOrderDetail(row) {
      this.$router.push({
        path: `/labOrder/detail/${row.loId}`
      })
    },
    // 时间格式化
    dateFormat(row, column) {
      var date = row[column.property]
      if (date == undefined) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    // 通过实验室类型获取实验列表（实验名称）
    getExpByLId() {
      debugger
      // 根据id获取实验室类型 再根据实验室类型查询其下实验列表
      orderApi.getExpNameByLId(this.pojo.lid).then((response) => {
        // 先清空expList
        this.expList = [],
        this.expList = response.data
      })
    }
  }
}
</script>

<style scoped>
.title {
  font-size: 16px;
  cursor: pointer;
  color: #3198ff;
  text-decoration: none;
}
</style>
