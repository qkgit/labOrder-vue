<template>
  <div class="container">
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
      :data="courseList"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="课程名称" width="200" />
      <el-table-column prop="leader" label="任课教师" width="120" />
      <el-table-column prop="type" label="课程类型" width="100">
        <template slot-scope="scope">
          <dict-tag :options="typeOptions" :value="scope.row.type" />
        </template>
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
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
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
            <el-form-item label="课程名称" prop="name">
              <el-input v-model="pojo.name" type="name" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="课程类型" prop="type">
              <el-radio-group v-model="pojo.type">
                <el-radio
                  v-for="dict in typeOptions"
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
            <el-form-item label="任课教师" prop="leaderId">
              <treeselect
                v-model="pojo.leaderId"
                :options="userOptions"
                :props="defaultProps"
                :show-count="true"
                :disable-branch-nodes="true"
                placeholder="请选择任课教师"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="课程学分" prop="credit">
              <el-input v-model="pojo.credit" type="credit" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注" prop="remark">
            <el-col :span="20">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入备注"
                v-model="pojo.remark"
              >
              </el-input>
            </el-col>
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
import { deptUserTreeSelect } from "@/api/system/role";
import DictTag from "@/components/DictTag";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { DictTag, Treeselect },
  data() {
    return {
      loading: false,
      typeOptions: [],
      courseList: [],
      ids: [],
      multiple: true,
      userOptions: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
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
      pojo: {},
      dialogFormVisible: false,
      title: "",
      rules: {},
    };
  },
  created() {
    this.getDicts("course_type").then((response) => {
      this.typeOptions = response.data;
    });
    this.getList();
  },

  methods: {
    getList() {
      this.loading = true;
      courseApi.listCourse(this.pageQuery).then((res) => {
        const resp = res.data;
        this.pageQuery.page.total = resp.total;
        this.courseList = resp.list;
        this.loading = false;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("ruleForm");
      this.getList();
    },
    // 表单重置
    reset() {
      this.pojo = {
        uuid: undefined,
        name: undefined,
        leaderId: undefined,
        type: "1",
        credit: undefined,
        remark: undefined,
      };
      this.resetForm("pojoForm");
    },
    // 取消按钮
    cancel() {
      this.dialogFormVisible = false;
      this.reset();
    },
    getUserTreeSelect() {
      deptUserTreeSelect("1").then((res) => {
        this.userOptions = res.data;
      });
    },
    // 弹出窗口
    handleAdd() {
      this.reset();
      this.getUserTreeSelect();
      this.dialogFormVisible = true;
      this.title = "添加课程";
    },
    handleEdit(row) {
      this.reset();
      this.getUserTreeSelect();
      courseApi.getCourse(row.uuid).then((response) => {
        this.pojo = response.data;
        this.title = "修改课程";
        this.dialogFormVisible = true;
      });
    },

    // 事务
    submitForm: function () {
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          if (this.pojo.uuid != undefined) {
            courseApi.updateCourse(this.pojo).then((res)=>{
              this.dialogFormVisible = false;
              this.msgSuccess(res.message);
              this.getList();
            })
          } else {
            courseApi.addCourse(this.pojo).then((res)=>{
              this.dialogFormVisible = false;
              this.msgSuccess(res.message);
              this.getList();
            })
          }
        }
      });
    },
    handleDelete(row) {
      const  ids = row.uuid || this.ids;
      this.$confirm("确认删除选中课程吗？", "警告", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then( function() {
          return courseApi.deleteCouseByIds(ids);
        }).then((res)=>{
          this.getList();
          this.msgSuccess(res.message);
        })
        .catch(() => {});
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.uuid);
      this.multiple = !selection.length;
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
  },
};
</script>

<style scoped>
</style>
