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
            :highlight-current="true"
            :default-expand-all="true"
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
                :value="option.code"
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
          <el-table-column label="课程信息" align="center">
            <template slot-scope="scope">
              <div style="font-weight: 700">{{ scope.row.course.name }}</div>
              <div>
                {{ scope.row.periodStart }}-{{ scope.row.periodEnd }}周/
                {{ scope.row.classroom.address }}/
                {{ scope.row.course.leader }}/
                {{ scope.row.course.type == '1' ? '考查课':'考试课' }}/
                {{ scope.row.course.credit }}
              </div>
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
                  :value="option.code"
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
                  :value="option.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="星期" prop="week">
              <el-select v-model="pojo.week">
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
            <el-form-item label="节次" prop="node">
              <el-select v-model="pojo.node">
                <el-option
                  v-for="i in nodeNum"
                  :key="i"
                  :label="i"
                  :value="i"
                />
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
            <el-form-item label="是否单双周" prop="limitWeek">
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
            <el-form-item label="班级" prop="deptId">
              <el-select
                v-model="pojo.deptId"
                filterable
                remote
                clearable
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
            <el-form-item label="教室" prop="classRoomId">
              <el-select
                v-model="pojo.classRoomId"
                filterable
                remote
                clearable
                placeholder="请输入教室"
                :remote-method="remoteRoom"
                :loading="pojoLoading"
              >
                <el-option
                  v-for="i in pojoRoomList"
                  :key="i.uuid"
                  :label="i.name + '--' + i.address"
                  :value="i.uuid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="课程" prop="courseId">
            <el-select
              v-model="pojo.courseId"
              filterable
              remote
              clearable
              placeholder="请输入课程"
              :remote-method="remoteCourse"
              :loading="pojoLoading"
            >
              <el-option
                v-for="i in pojoCourseList"
                :key="i.uuid"
                :label="i.name + '--' + i.leader"
                :value="i.uuid"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
              v-model="pojo.remark"
            >
            </el-input>
          </el-form-item>
        </el-row>
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
import { getCourseByName } from "@/api/system/course";
import { getDeptByName } from "@/api/system/dept";
import deptApi from "@/api/system/dept";
import { getRoomByName } from "@/api/system/classroom";
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
      // 课程时间
      courseTime: undefined,
      // 学年
      yearOptions: [
        { code: "2022", name: "2022-2023" },
        { code: "2021", name: "2021-2022" },
        { code: "2020", name: "2020-2021" },
        { code: "2019", name: "2019-2020" },
        { code: "2018", name: "2018-2019" },
        { code: "2017", name: "2017-2018" },
      ],
      // 学期
      semesterOptions: [
        { code: "1", name: "1" },
        { code: "2", name: "2" },
      ],
      // 当前最大节次
      nodeNum: undefined,
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
      title: "",
      dialogFormVisible: false,
      // 是否单双周
      limitWeekOptions: [
        { code: "0", name: "全" },
        { code: "1", name: "单" },
        { code: "2", name: "双" },
      ],
      courseTypeOptions: undefined,
      // pojo-班级下拉框数据
      pojoDeptList: [],
      // pojo-教室下拉框数据
      pojoRoomList: [],
      // pojo-课程下拉框数据
      pojoCourseList: [],

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
    this.getDicts("course_type").then((response) => {
      this.courseTypeOptions = response.data;
    });
    // 初始化查询年份条件（当前时间）
    this.initQuery();
    this.getDefaultTime();
    this.getTreeselect();
    this.getList();
  },
  methods: {
    /** 查询数据列表 */
    getList() {
      this.loading = true;
      courseApi
        .listCourseTable(this.pageQuery.item)
        .then((res) => {
          this.loading = false;
          this.courseTableList = res.data;
          this.getSpanArr(this.courseTableList);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptTree = response.data;
      });
    },
    /** 查询当前课程时间 */
    getDefaultTime() {
      courseApi.getDefaultTime().then((res) => {
        this.courseTime = res.data;
        this.nodeNum = res.data.num;
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
        this.pojoLoading = true;
        // 后端查询接口
        getDeptByName(query).then((res) => {
          this.pojoDeptList = res.data;
          this.pojoLoading = false;
        });
      } else {
        this.pojoDeptList = [];
      }
    },
    // 下拉框查询教室
    remoteRoom(query) {
      if (query !== "") {
        this.pojoLoading = true;
        // 后端查询接口
        getRoomByName(query).then((res) => {
          this.pojoRoomList = res.data;
          this.pojoLoading = false;
        });
      } else {
        this.pojoRoomList = [];
      }
    },
    // 下拉框查询课程
    remoteCourse(query) {
      debugger;
      if (query !== "") {
        this.pojoLoading = true;
        // 后端查询接口
        getCourseByName(query).then((res) => {
          this.pojoCourseList = res.data;
          this.pojoLoading = false;
        });
      } else {
        this.pojoCourseList = [];
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
      this.reset();
      this.dialogFormVisible = true;
      this.title = "添加课程表数据";
    },
    handleEdit(row) {
      this.reset();
      courseApi.getTableInfo(row.uuid).then((response) => {
         // 解析课程、班级、教室id 
        this.pojoDeptList= [];
        this.pojoDeptList.push(response.data.dept);
        this.pojoRoomList = [];
        this.pojoRoomList.push(response.data.classroom);
        this.pojoCourseList = [];
        this.pojoCourseList.push(response.data.course);
        this.pojo = response.data;
        this.dialogFormVisible = true;
        this.title = "修改课程表数据";
      });
    },
  
    submitForm: function () {
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          if (this.pojo.uuid != undefined) {
            console.log("更新");
          } else {
            courseApi.addTableInfo(this.pojo).then((res)=>{
              this.dialogFormVisible = false;
              this.msgSuccess(res.message);
              this.getList();
            })
          }
        }
      });
    },

    handleDelete(row) {
      this.$confirm("确认删除这条记录吗？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(() => {
          // 确认
          var that = this;
          courseApi.deleteById(id).then((response) => {
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

    initQuery() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      this.pageQuery.item.year = year.toString();
      this.pageQuery.item.semester = month.toString() > 6 ? 2 : 1;
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
