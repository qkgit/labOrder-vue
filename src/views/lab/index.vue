<template>
  <div class="container">
    <!-- 查询表单 :inline="true"行内表单-->
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="pageQuery.item"
      class="demo-form-inline"
    >
      <el-form-item prop="cardNum">
        <el-select v-model="pageQuery.item.lType" placeholder="请选择实验室类型">
          <el-option
            v-for="option in labTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="pageQuery.item.lName" placeholder="实验室名称" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="pageQuery.item.lAddress" placeholder="实验室地址" />
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
        >添加实验室</el-button>
        <!-- <el-button @click="resetForm('pageQuery.item')" icon="el-icon-refresh-right"
          >重置
        </el-button> -->
      </el-form-item>
    </el-form>
    <!-- 数据列表  -->
    <el-table :data="labList" stripe border style="width: 95%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column
        prop="lname"
        label="实验室"
      />
      <el-table-column
        prop="ltype"
        label="实验室类型"
        width="160"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.ltype | labTypeFilter }} </span>
        </template>

      </el-table-column>
      <el-table-column prop="laddress" label="实验室地址" />
      <el-table-column prop="lcap" label="容量" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row.lid)"
          >修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.lid)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :total="pageQuery.page.total"
      :page-sizes="[10,5,20]"
      :current-page="pageQuery.page.pageNum"
      :page-size="pageQuery.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 新增对话框 -->
    <el-dialog title="添加实验室" :visible.sync="dialogFormVisible">
      <el-form
        ref="pojoForm"
        status-icon
        :model="pojo"
        :rules="rules"
        label-width="100px"
        label-position="right"
        style="width: 400px"
      >
        <el-form-item prop="lid" />
        <el-form-item label="实验室名称" prop="lname">
          <el-input v-model="pojo.lname" />
        </el-form-item>
        <el-form-item label="实验室类型" prop="ltype">
          <el-select v-model="pojo.ltype" placeholder="请选择实验室类型">
            <el-option
              v-for="option in labTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="实验室地址" prop="laddress">
          <el-input v-model="pojo.laddress" />
        </el-form-item>
        <el-form-item label="容量" prop="lcap">
          <el-input v-model="pojo.lcap" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="
            pojo.lid === '' ? addData() : updataDate()
          "
        >确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import labApi from '@/api/labs'
// 实验室类型
const labTypeOptions = [
  { type: '1', name: '物理' },
  { type: '2', name: '化学' },
  { type: '3', name: '生物' },
  { type: '4', name: '计算机' }
]
export default {
  filters: {
    // filters过滤器 中不能直接引用当前实例 this 指向的不是vue实例，所以无法直接获取data中的数据   payTypeOptions一定要定义在外面
    labTypeFilter(type) {
      // 全局的 payTypeOptions 返回一个满足条件的对象
      const obj = labTypeOptions.find((obj) => obj.type === type)
      // 非空返回类型名称
      return obj ? obj.name : null
    }
  },

  components: {},
  data() {
    return {
      labList: [],
      pageQuery: {
        page: {
          total: 10, // 总记录数
          pageNum: 1, // 当前页,，默认第1页
          pageSize: 10 // 每页显示条数，10条
        },
        item: {
          lType: '',
          lName: '',
          lAddress: ''
        }
      },
      labTypeOptions,
      pojo: {
        lid: '',
        lname: '',
        ltype: '',
        laddress: '',
        lcap: ''
      },
      dialogFormVisible: false, // 是否显示弹出对话框
      rules: {

      }
    }
  },
  // 钩子函数获取数据
  created() {
    this.fetchData(this.pageQuery)
  },

  methods: {
    // 查询
    fetchData(pageQuery) {
      console.log(pageQuery)
      labApi.getLabList(pageQuery).then((response) => {
        const resp = response.data
        this.pageQuery.page.total = resp.total
        this.labList = resp.list
        // 重置item
        this.pageQuery.item.lType = ''
        this.pageQuery.item.lName = ''
        this.pageQuery.item.lAddress = ''
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
    // 打开添加窗口
    handleAdd() {
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
      labApi.getById(id).then((response) => {
        const resp = response.data
        console.log(resp)
        this.pojo = resp
      })
    },
    // 添加
    addData() {
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          var that = this
          // 验证通过，提交添加
          labApi.addLab(this.pojo).then((response) => {
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
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          // 验证通过，提交添加
          var that = this
          labApi.update(this.pojo).then((response) => {
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

    // 删除
    handleDelete(id) {
      console.log('删除' + id)
      this.$confirm('确认删除这条记录吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        type: 'warning'
      })
        .then(() => {
          // 确认
          var that = this
          labApi.deleteById(id).then((response) => {
            // 提示信息
            this.$message({
              type: (response.resultCode == 200) ? 'success' : 'error',
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
    }

  }
}
</script>

<style scoped>
</style>
