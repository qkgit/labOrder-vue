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
            ref="tree"
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form
          ref="ruleForm"
          :inline="true"
          :model="pageQuery.item"
          class="demo-form-inline"
        >
          <el-form-item prop="name">
            <el-input v-model="pageQuery.item.loginName" placeholder="用户名" />
          </el-form-item>
          <el-form-item prop="mobile">
            <el-input v-model="pageQuery.item.mobile" placeholder="手机号" />
          </el-form-item>
          <el-form-item prop="status">
            <el-select
              v-model="pageQuery.item.status"
              placeholder="请选择用户状态"
            >
              <el-option
                v-for="option in statusOptions"
                :key="option.code"
                :label="option.name"
                :value="option.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="roleId">
            <el-select
              v-model="pageQuery.item.roleId"
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
            <el-button icon="el-icon-refresh" @click="resetQuery"
              >重置</el-button
            >
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
              type="warning"
              plain
              icon="el-icon-delete"
              size="small"
              :disabled="multiple"
              @click="handleResetPwd"
              >重置密码</el-button
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="realName" label="姓名" width="100" />
          <el-table-column prop="loginName" label="用户名/登录名" />
          <el-table-column prop="mobile" label="手机号码" width="120" />
          <el-table-column prop="dept.deptName" label="专业班级" width="120" />
          <el-table-column
            prop="sex"
            label="性别"
            width="50"
            :formatter="sexFormat"
          />
          <el-table-column
            prop="roles"
            label="身份"
            width="180"
            :formatter="rolesFormat"
          >
            <template slot-scope="scope">
              <div
                v-for="r in scope.row.roles"
                :key="r.index"
                style="display: inline-block; padding-right: 10px"
              >
                <dict-tag :options="rolesOptions" :value="r.roleId" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            key="status"
            prop="status"
            align="center"
            label="状态"
            width="80"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.row.userId)"
                >修改</el-button
              >
              <el-button
                v-if="scope.row.userId != '1'"
                size="mini"
                type="warning"
                @click="handleResetPwd(scope.row)"
                >重置密码</el-button
              >
              <el-button
                v-if="scope.row.userId != '1'"
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
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
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="700px"
      append-to-body
    >
      <el-form
        ref="pojoForm"
        status-icon
        :model="pojo"
        :rules="rules"
        label-width="90px"
        label-position="right"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="pojo.realName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学号或工号" prop="loginName">
              <el-input
                v-model="pojo.loginName"
                :disabled="pojo.userId != undefined"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="pojo.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="pojo.mobile" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="pojo.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="pojo.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in rolesOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <treeselect
                v-model="pojo.deptId"
                :options="deptOptions"
                :show-count="true"
                placeholder="请选择归属组织"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="pojo.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.name"
                  :label="dict.code"
                  >{{ dict.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-tag type="danger">提示：用户初始密码为学号或工号后六位！</el-tag> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/api/users";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import DictTag from "@/components/DictTag";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect, DictTag },
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
          loginName: "", //
          deptId: "",
          mobile: "",
          status: "",
          roleId: "",
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
      // 弹出层标题
      title: "",
      // 新增提交的数据
      pojo: {},
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
    this.getTreeselect();
    this.getList(true);

    this.getDicts("sys_user_sex").then((response) => {
      this.sexOptions = response.data;
    });
    this.getDicts("sys_user_roles").then((response) => {
      this.rolesOptions = response.data;
    });
    this.getDicts("sys_common_status").then((response) => {
      this.statusOptions = response.data;
    });
  },

  methods: {
    getList(click) {
      this.loading = true;
      userApi.getUserList(this.pageQuery).then((response) => {
        this.userList = response.data.list;
        this.pageQuery.page.total = response.data.total;
        this.loading = false;
        // 重置item
        // this.$refs["ruleForm"].resetFields();
        if (click) {
          this.$nextTick(() => {
            document
              .getElementsByClassName("el-tree-node__content")
              .forEach((element) => {
                element
                  .getElementsByClassName("el-tree-node__expand-icon")[0]
                  .click();
              });
          });
        }
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
      var userrole = "";
      row.roles.forEach((a) => {
        userrole += a.roleName + " / ";
      });
      return userrole.substring(0, userrole.length - 3);
      // return this.selectDictLabel(this.rolesOptions, row.roles);
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 表单重置
    reset() {
      this.pojo = {
        userId: undefined,
        realName: undefined,
        loginName: "",
        email: undefined,
        mobile: undefined,
        sex: undefined,
        roleIds: undefined,
        status: "0",
      };
    },
    // 取消按钮
    cancel() {
      this.dialogFormVisible = false;
      this.reset();
    },
    // 用户状态修改
    handleStatusChange(row) {
      const text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.realName + '"用户吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return userApi.changeUserStatus(row.userId, row.status);
        })
        .then((response) => {
          if (response.resultCode == 200) {
            this.msgSuccess(response.message);
          } else {
            return;
          }
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    handleAdd() {
      this.reset();
      this.dialogFormVisible = true;
      this.title = "添加用户";
    },
    handleEdit(id) {
      this.reset();
      this.dialogFormVisible = true;
      this.title = "修改用户";
      // 通过id查询数据
      userApi.getUserById(id).then((response) => {
        this.pojo = response.data;
      });
    },

    handleResetPwd(row) {
      const userIds = row.userId || this.ids;
      var that = this;
      this.$confirm("确认要重置密码吗？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(() => {
          userApi.resetPwd(userIds).then((response) => {
            if (response.resultCode == 200) {
              that.getList();
              that.msgSuccess();
            }
          });
        })
        .catch(() => {});
    },
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      var that = this;
      var hint = '是否确认删除 "' + row.realName + '" 用户?';
      if (
        row.userId === null ||
        row.userId === undefined ||
        row.userId === ""
      ) {
        hint = "是否确认删除选中用户?";
      }
      this.$confirm(hint, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(() => {
          userApi.deleteById(userIds).then((response) => {
            if (response.resultCode == 200) {
              that.getList();
              that.msgSuccess();
            }
          });
        })
        .catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["pojoForm"].validate((valid) => {
        if (valid) {
          if (this.pojo.userId != undefined) {
            userApi.update(this.pojo).then((response) => {
              this.msgSuccess(response.message);
              this.dialogFormVisible = false;
              this.getList();
            });
          } else {
            userApi.addUser(this.pojo).then((response) => {
              this.msgSuccess(response.message);
              this.dialogFormVisible = false;
              this.getList();
            });
          }
        }
      });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.multiple = !selection.length;
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("ruleForm");
      this.getList();
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
