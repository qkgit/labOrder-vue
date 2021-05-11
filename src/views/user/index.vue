<template>
  <div class="container">
    <!-- 查询表单 :inline="true"行内表单-->
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="pageQuery.item"
      class="demo-form-inline"
    >
      <el-form-item prop="name">
        <el-input
          v-model="pageQuery.item.loginName"
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item prop="institute">
        <el-input
          v-model="pageQuery.item.institute"
          placeholder="院系专业"
        />
      </el-form-item>
      <el-form-item prop="roles">
        <el-select v-model="pageQuery.item.roles" placeholder="请选择用户身份">
          <el-option
            v-for="option in userRoles"
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
        >添加用户</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表  -->
    <el-table :data="userList" stripe border style="width: 95%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column
        prop="realName"
        label="姓名"
        width="160"
      />
      <el-table-column prop="loginName" label="用户名/登录名" />
      <el-table-column prop="roles" label="身份" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.roles | rolesFilter }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.sex | sexFilter }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="institute" label="院系" />
      <el-table-column prop="major" label="专业" />

      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row.userId)"
          >修改</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleResetPwd(scope.row.userId)"
          >重置密码</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.userId)"
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
    <el-dialog title="新增用户" :visible.sync="dialogFormVisible">
      <el-form
        ref="pojoForm"
        status-icon
        :model="pojo"
        :rules="rules"
        label-width="100px"
        label-position="right"
        style="width: 400px"
      >
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="pojo.realName" />
        </el-form-item>
        <el-form-item label="学号或工号" prop="loginName">
          <el-input v-model="pojo.loginName" :disabled="true" />
        </el-form-item>
        <el-form-item label="身份" prop="roles">
          <el-select
            v-model="pojo.roles"
            placeholder="请点击选择"
          >
            <el-option
              v-for="option in userRoles"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="pojo.sex"
            placeholder="请点击选择"
          >
            <el-option
              v-for="option in userSex"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="院系" prop="institute">
          <el-input v-model="pojo.institute" />
        </el-form-item>

        <el-form-item label="专业" prop="major">
          <el-input v-model="pojo.major" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="
            pojo.userId === null ? addData() : updataData()
          "
        >确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from '@/api/users'

const userRoles = [
  { type: '0', name: '管理员' },
  { type: '1', name: '教师' },
  { type: '2', name: '学生' }
]
const userSex = [
  { type: '1', name: '男' },
  { type: '2', name: '女' }
]
export default {
  filters: {
    sexFilter(type) {
      const obj = userSex.find((obj) => obj.type === type)
      return obj ? obj.name : null
    },
    rolesFilter(type) {
      const obj = userRoles.find((obj) => obj.type === type)
      return obj ? obj.name : null
    }
  },

  components: {},
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
          loginName: '',
          roles: '',
          institute: '',
          major: ''
        }
      },
      userSex,
      userRoles,
      pojo: {
        // 新增提交的数据
        userId: null,
        realName: '',
        loginName: '',
        roles: '',
        sex: '',
        institute: '',
        major: ''
      },
      dialogFormVisible: false // 控制弹出对话框
    }
  },
  // 钩子函数获取数据
  created() {
    this.fetchData(this.pageQuery)
  },

  methods: {
    fetchData(pageQuery) {
      userApi.getUserList(pageQuery).then((response) => {
        const resp = response.data
        this.pageQuery.page.total = resp.total
        this.userList = resp.list
        // 重置item
        this.$refs['ruleForm'].resetFields()
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
      userApi.getUserById(id).then((response) => {
        this.pojo = response.data
      })
    },
    addData() {
      console.log('add')
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          // 验证通过，提交添加
          var that = this
          userApi.addUser(this.pojo).then((response) => {
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
    updataData() {
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          // 验证通过，提交添加
          var that = this
          userApi.update(this.pojo).then((response) => {
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
    handleResetPwd(id) {
      this.$confirm('确认要重置密码吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        type: 'warning'
      })
        .then(() => {
          // 确认
          var that = this
          userApi.resetPwd(id).then((response) => {
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
          // 取消重置 不理会
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
          userApi.deleteById(id).then((response) => {
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
