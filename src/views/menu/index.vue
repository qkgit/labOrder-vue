<template>
  <div class="container">
    <!-- 查询表单 -->
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="queryParams"
      class="demo-form-inline"
    >
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="菜单状态"
          clearable
          size="small"
        >
          <el-option
            v-for="option in statusOptions"
            :key="option.code"
            :label="option.name"
            :value="option.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="getList()"
          >查询
        </el-button>

        <el-button icon="el-icon-refresh-right" size="mini" @click="resetQuery"
          >重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" style="margin-bottom: 8px">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <!-- 数据列表  -->
    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="menuId"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="menuName"
        label="菜单名称"
        :show-overflow-tooltip="true"
        width="160"
      />
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="60" />
      <el-table-column
        prop="perms"
        label="权限标识"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="component"
        label="组件路径"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="status" label="状态" width="70">
        <template slot-scope="scope">
          <dict-tag :options="statusOptions" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增对话框 -->
    <el-dialog :title="title" :visible.sync="open">
      <el-form
        ref="pojoForm"
        status-icon
        :model="pojo"
        :rules="rules"
        label-width="100px"
        label-position="right"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="名称" prop="name">
              <el-input size="medium" v-model="pojo.name" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="状态" prop="status">
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
        <el-row>
          <el-col :span="10">
            <el-form-item label="地址" prop="address">
              <el-input size="medium" v-model="pojo.address" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="容量" prop="cap">
              <el-input size="medium" v-model="pojo.cap" style="width: 70%" />
              人
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="教室负责人" prop="leader">
            <el-col :span="10">
              <treeselect
                v-model="pojo.leader"
                :options="userOptions"
                :show-count="true"
                :disable-branch-nodes="true"
                placeholder="请选择教室负责人"
              />
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注" prop="remark">
            <el-col :span="15">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入备注"
                v-model="pojo.remark"
              >
              </el-input>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="pojo.lid === '' ? addData() : updataDate()"
          >确 定</el-button
        >
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import menuApi from "@/api/system/menu";
import DictTag from "@/components/DictTag";
export default {
  name: "menu",
  components: {
    DictTag,
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 状态
      statusOptions: [],
      menuList: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        status: undefined,
      },

      pojo: {
        lid: "",
        lname: "",
        ltype: "",
        laddress: "",
        lcap: "",
      },
      open: false, // 是否显示弹出对话框
      // 弹出层标题
      title: "",
      rules: {},
    };
  },

  // 钩子函数获取数据
  created() {
    this.getDicts("sys_common_status").then((response) => {
      this.statusOptions = response.data;
    });
    this.getList();
  },
  methods: {
    // 查询
    getList() {
      this.loading = true;
      menuApi.listMenu(this.queryParams).then((response) => {
        const resp = response.data;
        this.menuList = this.handleTree(response.data, "menuId");
        this.loading = false;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.getList();
    },

    // 表单重置
    reset() {
      this.pojo = {
        code: null,
        name: null,
        orderNum: null,
        tableType: null,
        remark: null,
        status: "0",
      };
      this.resetForm("pojoForm");
    },

    // 打开添加窗口
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加教室";
    },
    // 打开编辑窗口
    handleEdit(id) {
      this.reset();
      // //通过id查询数据
      roomApi.getById(id).then((response) => {
        this.pojo = response.data;
        this.open = true;
        this.title = "修改教室";
      });
    },
    // // 添加
    // addData() {
    //   this.$refs.pojoForm.validate((valid) => {
    //     if (valid) {
    //       var that = this;
    //       // 验证通过，提交添加
    //       labApi.addLab(this.pojo).then((response) => {
    //         if (response.resultCode == 200) {
    //           this.open = false;
    //           this.$message({
    //             message: "添加成功",
    //             type: "success",
    //           });
    //           // 新增成功 刷新数据列表
    //           that.getList(this.pageQuery);
    //         } else {
    //           // 失败 弹出提示
    //           this.$message({
    //             message: "response.message",
    //             type: "warning",
    //           });
    //         }
    //       });
    //     } else {
    //       // 验证失败
    //       return false;
    //     }
    //   });
    // },
    // // 修改
    // updataDate() {
    //   this.$refs.pojoForm.validate((valid) => {
    //     if (valid) {
    //       // 验证通过，提交添加
    //       var that = this;
    //       labApi.update(this.pojo).then((response) => {
    //         if (response.resultCode == 200) {
    //           this.open = false;
    //           this.$message({
    //             message: "修改成功",
    //             type: "success",
    //           });
    //           // 修改成功 刷新数据列表
    //           that.getList(this.pageQuery);
    //         } else {
    //           // 失败 弹出提示
    //           this.$message({
    //             message: "response.message",
    //             type: "warning",
    //           });
    //         }
    //       });
    //     } else {
    //       // 验证失败
    //       return false;
    //     }
    //   });
    // },

    // 删除
    handleDelete(id) {
      console.log("删除" + id);
      this.$confirm("确认删除这条记录吗？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(() => {
          // 确认
          var that = this;
          labApi.deleteById(id).then((response) => {
            // 提示信息
            this.$message({
              type: response.resultCode == 200 ? "success" : "error",
              message: response.message,
            });
            if (response.resultCode == 200) {
              // 删除成功 刷新列表
              // that.getList(this.pageQuery);
            }
          });
        })
        .catch(() => {
          // 取消删除 不理会
        });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
      this.ids = selection.map((item) => item.uuid);
      this.multiple = !selection.length;
    },
  },
};
</script>

<style>
</style>