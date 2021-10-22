<template>
  <div class="container">
    <el-form
      :model="pageQuery.item"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="" prop="tableType">
        <el-input 
          v-model="pageQuery.item.tableType"
          type="hidden">
        </el-input>
      </el-form-item>
      <el-form-item label="字典编码" prop="code">
        <el-input
          v-model="pageQuery.item.code"
          placeholder="请输入字典编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典名称" prop="name">
        <el-input
          v-model="pageQuery.item.name"
          placeholder="请输入字典值"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="pageQuery.item.status"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="dictList" stripe border>
      <el-table-column
        label="操作"
        align="center"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
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
      <el-table-column label="字典编码" align="center" prop="code" width="150"/>
      <el-table-column label="字典名称" align="center" prop="name" width="150"/>
      <el-table-column
        label="状态"
        align="center"
        prop="status"
        width="70"
        :formatter="statusFormat"
      />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建日期" align="center" prop="createTime" width="180"/>
      <el-table-column label="序号" align="center" prop="orderNum" width="60"/>
      <el-table-column label="字典类型" align="center" prop="tableType" width="150"/>
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
    <!-- 添加或修改字典管理对话框 -->
    <el-dialog
      :title= title
      :visible.sync="open"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入字典值" />
        </el-form-item>
        <el-form-item label="字典类型" prop="tableType">
          <el-input v-model="form.tableType" :disabled = true />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="序号" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入字典排序" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >
              {{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dictApi from "@/api/system/dict";

export default {
  name: "Dict",
  components: {},
  props: ['tableType'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 状态字典
      statusOptions: [
        {
          searchValue: null,
          createBy: "admin",
          createTime: "2021-09-29 11:16:22",
          updateBy: null,
          updateTime: null,
          remark: "正常状态",
          params: {},
          dictCode: 6,
          dictSort: 1,
          dictLabel: "正常",
          dictValue: "0",
          dictType: "sys_normal_disable",
          cssClass: "",
          listClass: "primary",
          isDefault: "Y",
          status: "0",
          default: true,
        },
        {
          searchValue: null,
          createBy: "admin",
          createTime: "2021-09-29 11:16:22",
          updateBy: null,
          updateTime: null,
          remark: "停用状态",
          params: {},
          dictCode: 7,
          dictSort: 2,
          dictLabel: "停用",
          dictValue: "1",
          dictType: "sys_normal_disable",
          cssClass: "",
          listClass: "danger",
          isDefault: "N",
          status: "0",
          default: false,
        },
      ],
      // 字典管理表格数据
      dictList: [],
     
      // 查询参数
      pageQuery: {
        page: {
          total: 10, // 总记录数
          pageNum: 1, // 当前页,，默认第1页
          pageSize: 10, // 每页显示条数，10条
        },
        item: {
          code: "", // 字典编码
          name: "", // 字典名称
          status: "", // 字典状态
          tableType: this.$route.params && this.$route.params.tableType, // 字典类型
          params: {},
        },
      },
      // 表单参数
      form: {
        code: null,
        name: null,
        orderNum: null,
        tableType: null,
        remark: null,
        status: "0",
      },
      // 是否显示弹出层
      open: false,
       // 弹出层标题
      title: "",
      // 表单校验
      rules: {
        code: [
          { required: true, message: "字典编码不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "字典名称不能为空", trigger: "blur" },
        ],
        // orderNum: [
        //   { required: true, message: "序号不能为空", trigger: "blur" },
        // ],
      },
      

    };
  },
  created() {
    this.getList();
    // this.getDicts("sys_job_status").then(response => {
    //   this.statusOptions = response.data;
    // });
  },
  methods: {
    /** 查询字典管理列表 */
    getList() {
      this.loading = true;
      dictApi.listData(this.pageQuery).then((response) => {
        this.dictList = response.data.list;
        this.pageQuery.page.total = response.data.total;
        this.loading = false;
        //重置item
        this.resetForm("queryForm");
        //重置父字典
        this.parentDict= '';  
      });
    },
    // 分页
    handleSizeChange(val) {
      // 当每页显示条数改变后 被触发
      this.pageQuery.page.pageSize = val;
      this.fetchData(this.pageQuery);
    },
    handleCurrentChange(val) {
      // 当页码改变后 被触发
      this.pageQuery.page.pageNum = val;
      this.fetchData(this.pageQuery);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 新增按钮操作
    handleAdd() {
      this.reset();
      // this.getTreeselect();
      debugger
      if (this.parentDict != '') {
        this.form.tableType = this.parentDict;
      } else {
        this.form.tableType = "d_root";
      }
      this.open = true;
      this.title = "添加字典";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      // this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.code;
      }
      dictApi.getDict(row.uuid).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改字典";
      });
    },
    /** 获取字典项 */
    getSDictData(row) {
        console.log("获取字典项。。。。。"+row.code);
        // 重置item
        this.resetForm("queryForm");
        // 添加当前选中类型
        this.pageQuery.item.tableType = '';
        this.pageQuery.item.tableType = row.code;
        dictApi.listData(this.pageQuery).then((response) => {
          this.dictList = response.data.list;
          this.pageQuery.page.total = response.data.total;
          this.loading = false;
          //重置item
          this.resetForm("queryForm");
        })
        this.parentDict = row.code
        
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        code: null,
        name: null,
        orderNum: null,
        tableType: null,
        remark: null,
        status: "0",
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.uuid != null) {
            dictApi.updateDict(this.form).then((response) => {
              this.msgSuccess("修改成功!");
              this.open = false;
              this.getList();
            });
          } else {
            dictApi.addDict(this.form).then((response) => {
              this.msgSuccess("新增成功!");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除字典管理编号为"' + row.uuid + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delDict(row.uuid);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    firstFun(){ this.secondFun();},
    secondFun(){ this.thirdFun();},
    thirdFun(){ console.log(new Error().stack);}
  },
};
</script>

