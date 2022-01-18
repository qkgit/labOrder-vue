<template>
  <div class="container">
    <!-- 查询表单 :inline="true"行内表单-->
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="pageQuery.item"
      class="demo-form-inline"
    >
      <el-form-item label="备注" prop="remark">
        <el-input v-model="pageQuery.item.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input v-model="pageQuery.item.version" placeholder="请输入版本" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList"
          >查询
        </el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
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
          >添加</el-button
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
    </el-row>
    <!-- 数据列表  -->
    <el-table
      :loading="loading"
      :data="timeList"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" prop="version" label="版本" width="100" />
      <el-table-column align="center" prop="remark" label="备注" />
      <el-table-column
        align="center"
        prop="createTime"
        label="创建时间"
        width="200"
      />
      <el-table-column
        align="center"
        prop="createBy"
        label="创建人"
        width="200"
      />
      <el-table-column label="操作" width="380">
        <template slot-scope="scope">
          <span class="default">
            <el-button
              v-if="scope.row.isDefault != 1"
              size="mini"
              type="success"
              @click="handleDefault(scope.row)"
              >设为默认</el-button
            >
            <el-button
              v-else
              disabled
              type="success"
              icon="el-icon-check"
              size="mini"
              circle
            />
          </span>
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-button size="mini" type="danger" v-if="scope.row.isDefault != 1" @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="warning"
            @click="handleUpgrade(scope.row)"
            >生成新版本</el-button
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
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="35%">
      <el-form
        ref="pojoForm"
        status-icon
        :model="pojo"
        :rules="rules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pojo.remark" style="width: 80%" />
        </el-form-item>
        <el-form-item label="节数" prop="beforeNum">
          <el-input
            v-model.number="beforeNum"
            style="width: 60%"
            placeholder="请先输入课程节数"
          />
          <el-button @click="addClassTime" style="margin-left: 12px"
            >确定</el-button
          >
        </el-form-item>

        <div v-if="this.showClassTime">
          <el-form-item
            v-for="(i, index) in pojo.num"
            :key="index"
            :label="'' + i"
            prop="time"
          >
            <el-time-picker
              is-range
              v-model="time[index]"
              value-format="HH:mm:ss"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import courseApi from "@/api/system/course";

export default {
  components: {},
  data() {
    return {
      loading: true,
      timeList: [],
      pageQuery: {
        page: {
          total: 10,
          pageNum: 1,
          pageSize: 10,
        },
        item: {
          remark: undefined,
          version: undefined,
        },
      },
      beforeNum: undefined,
      time: [],
      pojo: {
        uuid: undefined,
        isDefault: undefined,
        num: undefined,
        remark: undefined,
        classTime: undefined,
        times: [],
      },
      // 控制添加页面时间
      showClassTime: false,
      // 控制弹出对话框
      dialogFormVisible: false,
      // 弹出层标题
      title: "",
      rules: {
        remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
      },
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
    };
  },
  // 钩子函数获取数据
  created() {
    this.getList();
  },

  methods: {
    getList() {
      this.loading = true;
      courseApi.listTime(this.pageQuery).then((response) => {
        this.timeList = response.data.list;
        this.pageQuery.page.total = response.data.total;
        this.loading = false;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("ruleForm");
      this.getList();
    },
    // 显示添加页面时间设置
    addClassTime() {
      if (
        this.beforeNum === 0 ||
        this.beforeNum === undefined ||
        this.beforeNum === null
      ) {
        this.msgError("节数不能为空!");
        return;
      }
      if (isNaN(this.beforeNum)) {
        this.msgError("节数必须为数字!");
        return;
      }
      this.pojo.num = this.beforeNum;
      if (!this.showClassTime) {
        this.showClassTime = true;
      }
    },
    // 添加按钮
    handleAdd() {
      this.reset();
      this.showClassTime = false;
      this.dialogFormVisible = true;
      this.title = "添加时间表";
    },
    // 修改按钮
    handleEdit(row) {
      this.reset();
      var that = this;
      courseApi.getTime(row.uuid).then((response) => {
        that.pojo = response.data;
        that.beforeNum = that.pojo.num;
        // 回显时间数据  将 pojo.times[] 中的数据 转移到 time[] 中
        that.pojo.times.forEach((e, i) => {
          let t = [e.startTime, e.endTime];
          that.time.push(t);
        });
        that.showClassTime = true;
        that.dialogFormVisible = true;
        that.title = "修改时间表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      var that = this;
      this.$refs["pojoForm"].validate((valid) => {
        if (valid) {
          // 增加节数但不加数据
          if (that.time.length != that.beforeNum) {
            that.msgError("时间字段不能为空!");
            return;
          }
          // 处理时间数据  将time[] 中的数据 替换 到 pojo.times[] 中
          that.pojo.times = [];
          try {
            that.time.forEach((t) => {
              // 校验时间段数据不能为空（将时间数据修改为空）
              if (t == null) {
                throw new Error("时间字段不能为空!");
              }
              let classTime = { startTime: t[0] + "", endTime: t[1] + "" };
              that.pojo.times.push(classTime);
            });
          } catch (error) {
            that.msgError(error.message);
            return;
          }

          // 开始事务
          if (that.pojo.uuid != undefined) {
            courseApi.updateTime(that.pojo).then((r) => {
              that.dialogFormVisible = false;
              that.msgSuccess(r.message);
              that.getList();
            });
          } else {
            courseApi.addTime(that.pojo).then((response) => {
              that.dialogFormVisible = false;
              that.msgSuccess(response.message);
              that.getList();
            });
          }
        }
      });
    },

    handleDelete(row) {
      let timeIds = row.uuid || this.ids;
      var that = this;
      this.$confirm("确认删除选中版本吗？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(() => {
          courseApi.deleteTimes(timeIds).then((response) => {
            that.getList();
            that.msgSuccess("删除成功");
          });
        })
        .catch(() => {});
    },

    handleDefault(row){
      var that = this;
       this.$confirm("确认将当前版本设为默认版本？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(() => {
          courseApi.SetDefaultTime(row.uuid).then((rep) => {
            that.getList();
            that.msgSuccess(rep.message);
          });
        })
        .catch(() => {});
    },
    handleUpgrade(row) {
      var that = this;
      this.$confirm("确认以当前版本生成新版本？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(() => {
          courseApi.UpgradeTime(row.uuid).then((rep) => {
            that.getList();
            that.msgSuccess(rep.message);
          });
        })
        .catch(() => {});
    },

    // 表单重置
    reset() {
      this.beforeNum = undefined;
      this.time = [];
      this.pojo = {
        uuid: undefined,
        num: undefined,
        isDefault: undefined,
        remark: undefined,
        classTime: undefined,
        times: [],
      };
      this.resetForm("pojoForm");
    },
    // 取消按钮
    cancel() {
      this.dialogFormVisible = false;
      this.reset();
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
.default {
  width: 92px;
  display: inline-block;
  text-align: center;
}
</style>
