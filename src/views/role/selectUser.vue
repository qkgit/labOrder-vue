<template>
  <!-- 授权用户 -->
  <el-dialog
    title="选择用户"
    :visible.sync="visible"
    width="800px"
    top="5vh"
    append-to-body
  >
    <el-form
      :model="pageQuery.item"
      ref="queryForm"
      size="small"
      :inline="true"
    >
      <el-form-item label="用户名称" prop="realName">
        <el-input
          v-model="pageQuery.item.realName"
          placeholder="请输入用户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input
          v-model="pageQuery.item.mobile"
          placeholder="请输入手机号码"
          clearable
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
    <el-row>
      <el-table
        @row-click="clickRow"
        ref="table"
        :data="userList"
        @selection-change="handleSelectionChange"
        height="260px"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="登录名"
          prop="loginName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="用户名称"
          prop="realName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="邮箱"
          prop="email"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="手机"
          prop="mobile"
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
      </el-table>

      <el-pagination
        :total="pageQuery.page.total"
        :page-sizes="[5, 10, 20]"
        :current-page="pageQuery.page.pageNum"
        :page-size="pageQuery.page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelectUser">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import roleApi from "@/api/system/role";
import DictTag from "@/components/DictTag";

export default {
  props: {
    // 角色编号
    roleId: {
      type: [Number, String],
    },
  },
  components: { DictTag },
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      userIds: [],
      // 未授权用户数据
      userList: [],
      // 查询参数
      pageQuery: {
        page: {
          total: 10,
          pageNum: 1,
          pageSize: 5,
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
  },
  methods: {
    // 显示弹框
    show() {
      this.pageQuery.item.roleId = this.roleId;
      this.getDicts("sys_common_status").then((response) => {
        this.statusOptions = response.data;
      });
      this.getList();
      this.visible = true;
    },
    // 查询表数据
    getList() {
      roleApi.unallocatedUserList(this.pageQuery).then((res) => {
        this.userList = res.data.list;
        this.pageQuery.page.total = res.data.total;
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
    /** 单行点击选中 */
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    /** 选择授权用户操作 */
    handleSelectUser() {
      var that = this;
      const roleId = this.pageQuery.item.roleId;
      const userIds = this.userIds.join(",");
      if (userIds == "") {
        that.msgError("请选择要分配的用户");
        return;
      }
      const data = {
        roleId,
        userIds,
      };
      roleApi
        .authUserSelectAll(this.$qs.stringify(data))
        .then((res) => {
          that.msgSuccess(res.msg);
            this.visible = false;
            this.$emit("ok");
        });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map((item) => item.userId);
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
