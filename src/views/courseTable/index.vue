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
            :data="deptTree"
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
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleQuery()"
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
                disabled
              ></el-radio-button>
            </el-radio-group>
          </div>
        </el-row>

        <!-- 列表  -->
        <el-table
          v-show="display == '列表'"
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
          <el-table-column label="课程信息">
            <template slot-scope="scope">
              {{ scope.row.course }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.row)"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <el-table-column type="selection" width="55" />
        </el-table>

        <!-- 表格  -->
        <!-- <m-ytable></m-ytable> -->
        <el-table
          v-show="display == '表格'"
          v-loading="loading"
          border
          :data="courseTable"
        >
          <el-table-column prop="node" label="节次" width="80" align="center" />
          <el-table-column
            v-for="(v, i) in weekOptions"
            :key="i"
            align="center"
          >
            <template slot="header">
              <div class="tabletitle-timeline">
                {{ v.name }}
              </div>
            </template>
            <template slot-scope="scope" class="aaa">
              <!-- <hover-mask @click="handleClick"> -->
              <div v-if="scope.row.courseInfo[i] != ''">
                {{ scope.row.courseInfo[i] }}<br />
                课程名称<br />
                任课老师<br />
                教室位置<br />
                课程类型 学分 。。
              </div>
              <div v-else>----</div>
              <!-- <template v-solt:action>
                  <i class="iconfont icon-bianji-copy">编辑</i>
                </template>
              </hover-mask> -->
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 新增对话框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form
        ref="pojoForm"
        status-icon
        :model="pojo"
        :rules="pojoRules"
        label-width="90px"
        label-position="right"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="学年" prop="year">
              <el-select v-model="pojo.year" filterable>
                <el-option
                  v-for="option in yearOptions"
                  :key="option.code"
                  :label="option.name"
                  :value="option.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学期" prop="semester">
              <el-select v-model="pojo.semester">
                <el-option
                  v-for="option in semesterOptions"
                  :key="option.code"
                  :label="option.name"
                  :value="option.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="星期">
              <el-select v-model="pojo.periodEnd">
                <el-option
                  v-for="i in 7"
                  :key="i"
                  :label="digital2Chinese(i, 'week')"
                  :value="i"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节次">
              <el-select v-model="pojo.periodEnd">
                <el-option v-for="i in 4" :key="i" :label="i" :value="i" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="起止周" prop="weekStartEnd">
              <el-col :span="8">
                <el-select
                  v-model="pojo.periodStart"
                  size="small"
                  style="width: 80px"
                >
                  <el-option v-for="i in 20" :key="i" :label="i" :value="i" />
                </el-select>
              </el-col>
              <el-col :span="2"> 至 </el-col>
              <el-col :span="8">
                <el-select
                  v-model="pojo.periodEnd"
                  size="small"
                  style="width: 80px"
                >
                  <el-option
                    v-for="i in 20"
                    :key="i"
                    :label="i"
                    :value="i"
                    :disabled="i <= pojo.periodStart"
                  />
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否单双周">
              <el-radio-group v-model="pojo.limitWeek">
                <el-radio
                  v-for="dict in limitWeekOptions"
                  :key="dict.name"
                  :label="dict.code"
                  >{{ dict.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="班级">
              <el-select
                v-model="pojo.dept"
                filterable
                remote
                placeholder="请输入班级"
                :remote-method="remoteDept"
                :loading="pojoLoading"
              >
                <el-option
                  v-for="i in pojoDeptList"
                  :key="i.deptId"
                  :label="i.deptName"
                  :value="i.deptId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教室">
              <el-select
                v-model="pojo.room"
                filterable
                remote
                placeholder="请输入教室"
                :remote-method="remoteRoom"
                :loading="pojoLoading"
              >
                <el-option
                  v-for="i in pojoRoomList"
                  :key="i.uuid"
                  :label="i.name"
                  :value="i.uuid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="课程"> </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addData()">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import expApi from "@/api/exp";
import { treeselect } from "@/api/system/dept";

export default {
  components: {},
  data() {
    return {
      loading: false,
      pojoLoading: false,
      ids: [],
      multiple: true,
      // 列表数据
      courseTableList: [],
      // 表格数据
      courseTable: [],
      // 合并列表数组
      spanArr: [],
      // 部门树选项
      deptName: undefined,
      deptTree: undefined,
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 学期
      semesterOptions: [
        { code: "1", name: "1" },
        { code: "2", name: "2" },
      ],
      // 学年
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
      weekOptions: [
        { code: "Monday", name: "周一" },
        { code: "Tuesday", name: "周二" },
        { code: "Wednesday", name: "周三" },
        { code: "Thursday", name: "周四" },
        { code: "Friday", name: "周五" },
        { code: "Saturday", name: "周六" },
        { code: "Sunday", name: "周日" },
      ],
      pojo: {},
      dialogFormVisible: false,
      // 是否单双周
      limitWeekOptions: [
        { code: "0", name: "全" },
        { code: "1", name: "单" },
        { code: "2", name: "双" },
      ],
      // pojo班级下拉框数据
      pojoDeptList: [],
      // pojo教室下拉框数据
      pojoRoomList: [],
      title: "",
      rules: {
        year: [{ required: true, message: "请选择学年", trigger: "blur" }],
        semester: [{ required: true, message: "请选择学期", trigger: "blur" }],
      },
      pojoRules: {
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
    /** 查询数据列表 */
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
        {
          node: 1,
          courseInfo: [
            "课程信息...",
            "课程信息...",
            "课程信息...",
            "",
            "",
            "",
            "",
          ],
        },
        {
          node: 2,
          courseInfo: ["课程信息...", "", "课程信息...", "", "", "", ""],
        },
        {
          node: 3,
          courseInfo: [
            "课程信息...",
            "课程信息...",
            "",
            "课程信息...",
            "课程信息...",
            "",
            "",
          ],
        },
        {
          node: 4,
          courseInfo: ["", "课程信息...", "", "", "", "", ""],
        },
      ];
      this.getSpanArr(this.courseTableList);
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptTree = response.data;
      });
    },
    handleQuery() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.getList();
        }
      });
    },
    resetQuery() {
      this.resetForm("ruleForm");
      this.getList();
    },

    // 下拉框查询班级
    remoteDept(query) {
      if (query !== "") {
        this.pojoDeptList = [
          { deptId: "1", deptName: query + "1" },
          { deptId: "2", deptName: query + "2" },
        ];
      } else {
        this.pojoDeptList = [];
      }
    },
    // 下拉框查询教室
    remoteRoom(query) {
      if (query !== "") {
        this.pojoRoomList = [
          { uuid: "1", name: query + "1" },
          { uuid: "2", name: query + "2" },
        ];
      } else {
        this.pojoRoomList = [];
      }
    },

    // 表单重置
    reset() {
      this.pojo = {
        uuid: undefined,
        year: undefined,
        semester: undefined,
        address: undefined,
        periodStart: 1,
        periodEnd: undefined,
        week: undefined,
        limitWeek: "0",
        node: undefined,
        remark: undefined,
        classRoomId: undefined,
        courseId: undefined,
        deptId: undefined,
        dept: undefined,
      };
      this.resetForm("pojoForm");
    },
    // 取消按钮
    cancel() {
      this.dialogFormVisible = false;
      this.reset();
    },
    // 弹出窗口
    handleAdd() {
      this.dialogFormVisible = true;
      this.reset();
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

    submitForm: function () {
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          if (this.pojo.uuid != undefined) {
            console.log("更新");
          } else {
            console.log("添加");
          }
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
              that.getList();
            }
          });
        })
        .catch(() => {});
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
    // 星期格式化
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
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageQuery.page.pageNum = val;
      this.getList();
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
