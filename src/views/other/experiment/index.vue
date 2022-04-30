<template>
  <div class="container">
    <!-- 查询表单 :inline="true"行内表单-->
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="pageQuery.item"
      class="demo-form-inline"
    >
      <el-form-item prop="eName">
        <el-input
          v-model="pageQuery.item.eName"
          placeholder="实验名称"
        />
      </el-form-item>
      <el-form-item prop="eType">
        <el-select v-model="pageQuery.item.eType" placeholder="请选择实验类型">
          <el-option
            v-for="option in expTypeOptions"
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
          @click="handleAdd"
        >添加实验</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表  -->
    <el-table :data="expList" stripe border style="width: 95%">
      <el-table-column type="index" label="序号" width="60" />

      <el-table-column prop="expName" label="实验名称" />
      <el-table-column prop="expType" label="实验类型">
        <template slot-scope="scope">
          <span>{{ scope.row.expType | expTypeFilter }} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row.expId)"
          >修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.expId)"
          >删除</el-button>
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
    <el-dialog title="新增实验" :visible.sync="dialogFormVisible">
      <el-form
        ref="pojoForm"
        status-icon
        :model="pojo"
        :rules="rules"
        label-width="100px"
        label-position="right"
        style="width: 400px"
      >
        <el-form-item label="实验名称" prop="expName">
          <el-input v-model="pojo.expName" type="expName" />
        </el-form-item>

        <el-form-item label="实验类型" prop="expType">
          <el-select
            v-model="pojo.expType"
            type="expType"
            placeholder="请点击选择"
          >
            <el-option
              v-for="option in expTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="
            pojo.expId === null ? addData() : updataDate()
          "
        >确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import expApi from '@/api/exp'
const expTypeOptions = [
  { type: '1', name: '物理' },
  { type: '2', name: '化学' },
  { type: '3', name: '生物' },
  { type: '4', name: '计算机' }
]
export default {
  filters: {
    expTypeFilter(type) {
      const obj = expTypeOptions.find((obj) => obj.type === type)
      return obj ? obj.name : null
    }
  },

  components: {},
  data() {
    return {
      expList: [],
      pageQuery: {
        page: {
          total: 10, // 总记录数
          pageNum: 1, // 当前页,，默认第1页
          pageSize: 10 // 每页显示条数，10条
        },
        item: {
          eType: '',
          eName: ''
        }
      },
      expTypeOptions,
      pojo: {
        // 新增提交的数据
        expId: null,
        expName: '',
        expType: ''
      },
      dialogFormVisible: false, // 控制弹出对话框
      rules: {
        // cardNum: [
        //   { required: true, message: '卡号不能为空',trigger: 'blur'},
        //   { type: 'number', message: '卡号必须为数字值',trigger: 'blur'}
        // ],
        // name: [{required: true, message: '实验名称不能为空',trigger: 'blur'}],
        // payType: [{required: true, message: '请选择实验所属实验室',trigger: 'change'}]
      }
    }
  },
  // 钩子函数获取数据
  created() {
    console.log('---钩子函数启动---')
    this.fetchData(this.pageQuery)
  },

  methods: {
    fetchData(pageQuery) {
      expApi.getExpList(pageQuery).then((response) => {
        const resp = response.data
        console.log('resp', resp)
        this.pageQuery.page.total = resp.total
        this.expList = resp.list
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
      debugger
      this.pageQuery.page.pageNum = val
      this.fetchData(this.pageQuery)
    },
    // 弹出窗口
    handleAdd() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['pojoForm'].resetFields()
      })
    },
    handleEdit(id) {
      // 打开编辑窗口
      this.handleAdd()
      // 通过id查询数据
      expApi.getById(id).then((response) => {
        this.pojo = response.data
      })
    },
    // 事务
    addData() {
      console.log('add')
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          // 验证通过，提交添加
          var that = this
          expApi.addLab(this.pojo).then((response) => {
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
    updataDate() {
      console.log('upd')
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          // 验证通过，提交添加
          var that = this
          expApi.update(this.pojo).then((response) => {
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
    handleDelete(id) {
      this.$confirm('确认删除这条记录吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        type: 'warning'
      })
        .then(() => {
          // 确认
          var that = this
          expApi.deleteById(id).then((response) => {
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
