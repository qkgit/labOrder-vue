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
        <!-- 查询表单 :inline="true"行内表单-->
        <el-form
          ref="ruleForm"
          :inline="true"
          :model="pageQuery.item"
          :rules="rules"
          class="demo-form-inline"
        >
          <el-form-item prop="year" label="学年:">
            <el-select
              v-model="pageQuery.item.year"
              filterable
              placeholder="--请选择--"
            >
              <el-option
                v-for="option in yearOptions"
                :key="option.code"
                :label="option.name"
                :value="option.name"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="semester" label="学期:">
            <el-select
              v-model="pageQuery.item.semester"
              placeholder="--请选择--"
            >
              <el-option
                v-for="option in semesterOptions"
                :key="option.code"
                :label="option.name"
                :value="option.name"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getList()"
              >查询
            </el-button>
            <el-button icon="el-icon-refresh-right" @click="resetQuery"
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
          <div class="top-right-btn">
            <el-radio-group v-model="display" size="mini">
              <el-radio-button
                label="列表"
                icon="el-icon-table"
              ></el-radio-button>
              <el-radio-button
                label="表格"
                icon="el-icon-menu"
              ></el-radio-button>
            </el-radio-group>
          </div>
        </el-row>

        <!-- 数据列表  -->
        <el-table
          v-show="false"
          v-loading="loading"
          border
          :data="courseTableList"
          :span-method="objectSpanMethod"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            prop="week"
            label="星期"
            width="80"
            align="center"
            :formatter="weekFormatter"
          />
          <el-table-column prop="node" label="节次" width="80" align="center" />
          <el-table-column prop="course" label="课程信息"> </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.row.expId)"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.expId)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <el-table-column type="selection" width="55" />
        </el-table>
        <el-table v-loading="loading" border :data="courseTable">
          <el-table-column prop="node" label="节次" width="80" align="center" />
          <el-table-column prop="" label="星期一" />
          <el-table-column prop="" label="星期二" />
          <el-table-column prop="" label="星期三" />
          <el-table-column prop="" label="星期四" />
          <el-table-column prop="" label="星期五" />
          <el-table-column prop="" label="星期六" />
          <el-table-column prop="" label="星期日" />
        </el-table>
      </el-col>
    </el-row>

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
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

const expTypeOptions = [
  { type: "1", name: "物理" },
  { type: "2", name: "化学" },
  { type: "3", name: "生物" },
  { type: "4", name: "计算机" },
];
export default {
  filters: {
    expTypeFilter(type) {
      const obj = expTypeOptions.find((obj) => obj.type === type);
      return obj ? obj.name : null;
    },
  },

  components: {},
  data() {
    return {
      loading: false,
      ids: [],
      multiple: true,
      courseTableList: [],
      courseTable: [],
      spanArr: [],
      // 部门树选项
      deptName: undefined,
      deptOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label",
      },
      semesterOptions: [
        { code: "1", name: "1" },
        { code: "2", name: "2" },
      ],
      yearOptions: [
        { code: "2022", name: "2021-2022" },
        { code: "2021", name: "2020-2021" },
        { code: "2020", name: "2019-2020" },
        { code: "2019", name: "2018-2019" },
        { code: "2018", name: "2017-2018" },
      ],
      pageQuery: {
        page: {
          total: 10,
          pageNum: 1,
          pageSize: 10,
        },
        item: {
          year: undefined,
          semester: undefined,
          deptId: undefined,
        },
      },
      display: "列表",
      expTypeOptions,
      pojo: {},
      dialogFormVisible: false,
      rules: {
        year: [{ required: true, message: "请选择学年", trigger: "blur" }],
        semester: [{ required: true, message: "请选择学期", trigger: "blur" }],
      },
    };
  },
  // 钩子函数获取数据
  created() {
    this.getTreeselect();
    this.getList();
  },

  methods: {
    getList() {
      // expApi.getExpList(this.pageQuery).then((response) => {
      //   const resp = response.data;
      //   this.courseTableList = resp.list;
      //   this.pageQuery.page.total = resp.total;
      // });
      this.courseTableList = [
        { week: "1", node: 1, course: "课程信息..." },
        { week: "1", node: 2, course: "课程信息..." },
        { week: "1", node: 3, course: "课程信息.." },
        { week: "2", node: 1, course: "课程信息.." },
        { week: "2", node: 3, course: "课程信息....." },
        { week: "2", node: 4, course: "课程信息.." },
        { week: "3", node: 1, course: "课程信息..." },
        { week: "3", node: 2, course: "课程信息..." },
        { week: "4", node: 3, course: "课程信息.." },
        { week: "4", node: 1, course: "课程信息.." },
        { week: "5", node: 3, course: "课程信息....." },
      ];
      this.courseTable = [
        { node: 1, courseInfo: ["课程信息...","课程信息...","课程信息...","课程信息...","课程信息...","课程信息...","课程信息...",] },

      ]
      this.getSpanArr(this.courseTableList);
    },
    handleQuery() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.getList();
        }
      });
    },

    // 合并表格单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    getSpanArr(data) {
      this.spanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].week === data[i - 1].week) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },

    resetQuery() {
      this.resetForm("ruleForm");
      this.getList();
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
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
              that.getList(this.pageQuery);
            }
          });
        })
        .catch(() => {});
    },

    weekFormatter(row, column) {
      return this.digital2Chinese(row.week, "week");
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.pageQuery.item.deptId = data.id;
      this.getList();
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 分页
    handleSizeChange(val) {
      this.pageQuery.page.pageSize = val;
      this.getList(this.pageQuery);
    },
    handleCurrentChange(val) {
      this.pageQuery.page.pageNum = val;
      this.getList(this.pageQuery);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.uuid);
      this.multiple = !selection.length;
    },
  },
};
</script>

<style scoped>
.top-right-btn {
  position: relative;
  float: right;
}
</style>
