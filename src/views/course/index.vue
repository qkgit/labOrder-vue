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
        <el-input v-model="pageQuery.item.name" placeholder="课程名称" />
      </el-form-item>
      <el-form-item prop="leader">
        <el-input v-model="pageQuery.item.leader" placeholder="任课教师" />
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
          >添加课程</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 数据列表  -->
    <el-table :data="courseList" stripe border style="width: 95%">
      <el-table-column type="index" label="序号" width="60" />

      <el-table-column prop="name" label="课程名称" width="200" />
      <el-table-column prop="leader" label="任课教师" width="120" />
      <el-table-column prop="type" label="课程类型" width="100">
      </el-table-column>
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
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
    <el-dialog title="新增课程" :visible.sync="dialogFormVisible">
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

        <el-form-item label="实验类型" prop="expType"> </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="pojo.expId === null ? addData() : updataDate()"
          >确 定</el-button
        >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import expApi from "@/api/exp";
export default {
  components: {},
  data() {
    return {
      courseList: [],
      pageQuery: {
        page: {
          total: 10, 
          pageNum: 1, 
          pageSize: 10, 
        },
        item: {
          name: undefined,
          leader: undefined,
        },
      },
      typeOptions: [],
      pojo: {},
      dialogFormVisible: false, 
      rules: {},
    };
  },
  // 钩子函数获取数据
  created() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      expApi.getExpList(this.pageQuery).then((response) => {
        const resp = response.data;
        this.pageQuery.page.total = resp.total;
        this.courseList = resp.list;
        // 重置item
        this.$refs["ruleForm"].resetFields();
      });
    },
    // 分页
    handleSizeChange(val) {
      // 当每页显示条数改变后 被触发
      console.log(val);
      this.pageQuery.page.pageSize = val;
      this.fetchData(this.pageQuery);
    },
    handleCurrentChange(val) {
      // 当页码改变后 被触发
      console.log(val);
      debugger;
      this.pageQuery.page.pageNum = val;
      this.fetchData(this.pageQuery);
    },
    // 弹出窗口
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
      expApi.getById(id).then((response) => {
        this.pojo = response.data;
      });
    },
    // 事务
    addData() {
      console.log("add");
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          // 验证通过，提交添加
          var that = this;
          expApi.addLab(this.pojo).then((response) => {
            if (response.resultCode == 200) {
              this.dialogFormVisible = false;
              this.$message({
                message: "添加成功",
                type: "success",
              });
              // 新增成功 刷新数据列表
              that.fetchData(this.pageQuery);
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
    updataDate() {
      console.log("upd");
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          // 验证通过，提交添加
          var that = this;
          expApi.update(this.pojo).then((response) => {
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
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(() => {
          // 确认
          var that = this;
          expApi.deleteById(id).then((response) => {
            // 提示信息
            this.$message({
              type: response.resultCode == 200 ? "success" : "error",
              message: response.message,
            });
            if (response.resultCode == 200) {
              // 删除成功 刷新列表
              that.fetchData(this.pageQuery);
            }
          });
        })
        .catch(() => {
          // 取消删除 不理会
        });
    },
  },
};
</script>

<style scoped>
</style>
