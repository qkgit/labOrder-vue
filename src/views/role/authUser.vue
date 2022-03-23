<template>
  <div class="container">
    <el-page-header
      :content="this.role.roleName + '-分配用户'"
      @back="goBack"
    />
    <br />
    <el-form :model="pageQuery.item" ref="queryForm" :inline="true">
      <el-form-item label="用户名称" prop="realName">
        <el-input
          v-model="pageQuery.item.realName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input
          v-model="pageQuery.item.mobile"
          placeholder="请输入用户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
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
          size="mini"
          @click="openSelectUser"
          >添加用户</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-circle-close"
          size="mini"
          :disabled="multiple"
          @click="cancelAuthUser"
          >批量取消授权</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="userList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="登录名"
        prop="loginName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="姓名"
        prop="realName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="手机"
        prop="mobile"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="邮箱"
        prop="email"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="statusOptions" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-close"
            @click="cancelAuthUser(scope.row)"
            >取消授权</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
    <select-user
      ref="select"
      :roleId="pageQuery.item.roleId"
      @ok="handleQuery"
    />
  </div>
</template>

<script>
import roleApi from "@/api/system/role";
import DictTag from "@/components/DictTag";
import selectUser from "./selectUser.vue";
export default {
  name: "AuthUser",
  components: { DictTag, selectUser },
  data() {
    return {
      loading: true,
      userIds: [],
      multiple: true,
      role: {
        roleId: undefined,
        roleName: undefined,
      },
      statusOptions: [],
      userList: undefined,
      pageQuery: {
        page: {
          total: 10,
          pageNum: 1,
        },
        item: {
          roleId: undefined,
          realName: undefined,
          mobile: undefined,
        },
      },
    };
  },
  created() {
    this.getDicts("sys_common_status").then((response) => {
      this.statusOptions = response.data;
    });
    this.pageQuery.item.roleId =
      this.$route.params && this.$route.params.roleId;
    if (this.pageQuery.item.roleId) {
      // 获取角色信息
      roleApi.getRole(this.pageQuery.item.roleId).then((res) => {
        this.role = res.data;
      });
      // 获取角色授权列表
      this.getList();
    }
  },
  methods: {
    getList() {
      this.loading = true;
      roleApi.allocatedUserList(this.pageQuery).then((res) => {
        this.userList = res.data.list;
        this.pageQuery.page.total = res.data.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.pageQuery.page.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    openSelectUser() {
      this.$refs.select.show();
    },
    cancelAuthUser(row) {
      const userIds = row.userId || this.userIds.join(",");
      const roleId = this.pageQuery.item.roleId;
      var that = this;
      var hint = '是否确认取消授权 "' + row.realName + '" ?';
      if (
        row.userId === null ||
        row.userId === undefined ||
        row.userId === ""
      ) {
        hint = "是否确认取消授权选中用户?";
      }
      this.$confirm(hint, "警告", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      }).then(() => {
        const data = {
          roleId,
          userIds,
        };
        roleApi.authUserCancel(this.$qs.stringify(data)).then((res) => {
          that.getList();
          that.msgSuccess(res.message);
        });
      });
    },

    goBack() {
      this.$router.back();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map((item) => item.userId);
      this.multiple = !selection.length;
    },
    // 分页
    handleSizeChange(val) {
      // 当每页显示条数改变后 被触发
      this.pageQuery.page.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      // 当页码改变后 被触发
      this.pageQuery.page.pageNum = val;
      this.getList();
    },
  },
};
</script>

<style>
</style>