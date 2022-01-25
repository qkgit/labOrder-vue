<template>
  <div class="container">
    <!-- 查询表单 -->
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="pageQuery.item"
      class="demo-form-inline"
    >
      <el-form-item prop="name">
        <el-input v-model="pageQuery.item.name" placeholder="教室名称" />
      </el-form-item>
      <el-form-item prop="address">
        <el-input v-model="pageQuery.item.address" placeholder="教室地址" />
      </el-form-item>
      <el-form-item prop="leader">
        <el-input v-model="pageQuery.item.leader" placeholder="教室负责人" />
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="pageQuery.item.status" placeholder="请选择教室状态">
          <el-option
            v-for="option in statusOptions"
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

        <el-button @click="resetQuery" icon="el-icon-refresh-right"
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
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>
    </el-row>

    <!-- 数据列表  -->
    <el-table
      v-loading="loading"
      :data="roomList"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="教室" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="cap" label="容量" width="80" />
      <el-table-column align="center" width="70" label="状态" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="statusOptions" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="leader" label="负责人" width="100" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row.lid)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.lid)"
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
    <!-- 新增对话框 -->
    <el-dialog title="添加实验室" :visible.sync="open">
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
        <el-form-item label="实验室类型" prop="ltype"> </el-form-item>
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
          @click="pojo.lid === '' ? addData() : updataDate()"
          >确 定</el-button
        >
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roomApi from "@/api/system/classroom";
import DictTag from "@/components/DictTag";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: {
    DictTag,
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 状态
      statusOptions: [],
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      roomList: [],
      pageQuery: {
        page: {
          total: 10,
          pageNum: 1, // 每页显示条数，10条
        },
        item: {
          name: undefined,
          address: undefined,
          leader: undefined,
          status: undefined,
        },
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
      roomApi.listRoom(this.pageQuery).then((response) => {
        const resp = response.data;
        this.pageQuery.page.total = resp.total;
        this.roomList = resp.list;
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
      this.title = '添加教室';
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
    // 添加
    addData() {
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          var that = this;
          // 验证通过，提交添加
          labApi.addLab(this.pojo).then((response) => {
            if (response.resultCode == 200) {
              this.open = false;
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
    // 修改
    updataDate() {
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          // 验证通过，提交添加
          var that = this;
          labApi.update(this.pojo).then((response) => {
            if (response.resultCode == 200) {
              this.open = false;
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
              that.getList(this.pageQuery);
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

    // 分页
    handleSizeChange(val) {
      this.pageQuery.page.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageQuery.page.pageNum = val;
      this.getList();
    },
  },
};
</script>

<style scoped>
</style>
