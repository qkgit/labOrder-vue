<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入院系专业班级"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <!-- 查询表单 :inline="true"行内表单-->
        <el-form
          ref="ruleForm"
          :inline="true"
          :model="pageQuery.item"
          class="demo-form-inline"
        >
          <el-form-item prop="name">
            <el-input v-model="pageQuery.item.loginName" placeholder="用户名" />
          </el-form-item>
          <!-- <el-form-item prop="institute">
            <el-input
              v-model="pageQuery.item.institute"
              placeholder="院系专业"
            />
          </el-form-item>  -->
          <el-form-item prop="roles">
            <el-select
              v-model="pageQuery.item.roles"
              placeholder="请选择用户身份"
            >
              <el-option
                v-for="option in rolesOptions"
                :key="option.code"
                :label="option.name"
                :value="option.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getList()"
              >查询
            </el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" style="margin-bottom: 8px">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="small"
              @click="handleAdd"
              >添加用户</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="small"
              :disabled="multiple"
              @click="handleDelete"
              >删除</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5">
            <el-dropdown size="small" split-button type="warning">
              更改状态
              <el-dropdown-menu>
                <el-dropdown-item>开启</el-dropdown-item>
                <el-dropdown-item>关闭</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col> -->
        </el-row>

        <!-- 数据列表  -->
        <el-table
          :loading="loading"
          :data="userList"
          stripe
          border
          style="width: 95%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="realName" label="姓名" width="80" />
          <el-table-column prop="loginName" label="用户名/登录名" />
          <el-table-column
            prop="roles"
            label="身份"
            width="80"
            :formatter="rolesFormat"
          />
          <el-table-column
            prop="sex"
            label="性别"
            width="50"
            :formatter="sexFormat"
          />
          <el-table-column
            prop="status"
            label="状态"
            width="60"
            :formatter="statusFormat"
          />
          <el-table-column prop="institute" label="院系" />
          <el-table-column prop="major" label="专业" width="100"/>

          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.row.userId)"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="warning"
                v-if="scope.row.userId != '1'"
                @click="handleResetPwd(scope.row.userId)"
                >重置密码</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.userId)"
                >删除</el-button
              >
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
      </el-col>
    </el-row>

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
          <el-input v-model="pojo.loginName" :disabled="pojo.loginName != ''" />
        </el-form-item>
        <el-form-item label="身份" prop="roles">
          <el-select v-model="pojo.roles" placeholder="请点击选择">
            <el-option
              v-for="option in rolesOptions"
              :key="option.code"
              :label="option.name"
              :value="option.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="pojo.sex" placeholder="请点击选择">
            <el-option
              v-for="option in sexOptions"
              :key="option.code"
              :label="option.name"
              :value="option.code"
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
          @click="pojo.userId === null ? addData() : updataData()"
          >确 定</el-button
        >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/api/users";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect },
  data() {
    return {
      loading: true,
      // 选中数组
      ids: [],
      // 性别
      sexOptions: [],
      // 角色
      rolesOptions: [],
      // 状态
      statusOptions: [],
      // 用户数据
      userList: [],
      // 查询参数
      pageQuery: {
        page: {
          total: 10, // 总记录数
          pageNum: 1, // 当前页,，默认第1页
          pageSize: 10, // 每页显示条数，10条
        },
        item: {
          loginName: "", // deptId: '',

          roles: "",
          institute: "",
          major: "",
        },
      },
      // 部门名称
      deptName: undefined,
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label",
      },
      deptName: undefined,
      // 新增提交的数据
      pojo: {
        userId: null,
        realName: "",
        loginName: "",
        roles: "",
        sex: "",
        institute: "",
        major: "",
      },
      // 非多个禁用
      multiple: true,
      // 控制弹出对话框
      dialogFormVisible: false,
      rules: {},
    };
  },

  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  // 钩子函数获取数据
  created() {
    this.getList();
    this.getTreeselect();
    this.getDicts("sys_user_sex").then((response) => {
      this.sexOptions = response.data;
    });
    this.getDicts("sys_user_roles").then((response) => {
      this.rolesOptions = response.data;
    });
    this.getDicts("sys_status").then((response) => {
      this.statusOptions = response.data;
    });
  },

  methods: {
    getList() {
      this.loading = true;
      userApi.getUserList(this.pageQuery).then((response) => {
        this.userList = response.data.list;
        this.pageQuery.page.total = response.data.total;
        this.loading = false;
        // 重置item
        this.$refs["ruleForm"].resetFields();
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.pageQuery.item.deptId = data.id;
      this.getList();
    },

    // 字典状态字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
    },
    rolesFormat(row, column) {
      return this.selectDictLabel(this.rolesOptions, row.roles);
    },

    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    handleEdit(id) {
      // 打开编辑窗口
      this.handleAdd();
      // 通过id查询数据
      userApi.getUserById(id).then((response) => {
        this.pojo = response.data;
      });
    },
    addData() {
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          // 验证通过，提交添加
          var that = this;
          userApi.addUser(this.pojo).then((response) => {
            if (response.resultCode == 200) {
              this.dialogFormVisible = false;
              this.$message({
                message: "添加成功",
                type: "success",
              });
              // 新增成功 刷新数据列表
              that.getList(this.pageQuery);
            } else {
              // 失败 弹出提示
              this.$message({
                message: "response.message",
                type: "warning",
              });
            }
          });
        } else {
          // 验证失败
          return false;
        }
      });
    },
    updataData() {
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          // 验证通过，提交添加
          var that = this;
          userApi.update(this.pojo).then((response) => {
            if (response.resultCode == 200) {
              this.dialogFormVisible = false;
              this.$message({
                message: "修改成功",
                type: "success",
              });
              // 修改成功 刷新数据列表
              that.getList(this.pageQuery);
            } else {
              // 失败 弹出提示
              this.$message({
                message: "response.message",
                type: "warning",
              });
            }
          });
        } else {
          // 验证失败
          return false;
        }
      });
    },
    handleResetPwd(id) {
      this.$confirm("确认要重置密码吗？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(() => {
          // 确认
          var that = this;
          userApi.resetPwd(id).then((response) => {
            // 提示信息
            this.$message({
              type: response.resultCode == 200 ? "success" : "error",
              message: response.message,
            });
            if (response.resultCode == 200) {
              // 删除成功 刷新列表
              that.getList(this.pageQuery);
            }
          });
        })
        .catch(() => {
          // 取消重置 不理会
        });
    },
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(() => {
          // 确认
          var that = this;
          userApi.deleteById(id).then((response) => {
            // 提示信息
            this.$message({
              type: response.resultCode == 200 ? "success" : "error",
              message: response.message,
            });
            if (response.resultCode == 200) {
              // 删除成功 刷新列表
              that.getList(this.pageQuery);
            }
          });
        })
        .catch(() => {
          // 取消删除 不理会
        });
    },

    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.uuid);
      this.multiple = !selection.length;
    },

    // 分页
    handleSizeChange(val) {
      // 当每页显示条数改变后 被触发
      this.pageQuery.page.pageSize = val;
      this.getList(this.pageQuery);
    },
    handleCurrentChange(val) {
      // 当页码改变后 被触发
      this.pageQuery.page.pageNum = val;
      this.getList(this.pageQuery);
    },
  },
};
</script>

<style scoped>
</style>
