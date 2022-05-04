<template>
  <div class="container">
    <el-form
      ref="queryForm"
      :model="pageQuery.item"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="" prop="tableType">
        <el-input v-model="pageQuery.item.tableType" type="hidden" />
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
            :key="dict.code"
            :label="dict.name"
            :value="dict.code"
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

    <el-table
      v-loading="loading"
      :data="dictList"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="操作" align="center" width="150">
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
      <el-table-column
        label="字典编码"
        align="center"
        prop="code"
        width="150"
      />
      <el-table-column label="字典名称" align="center" prop="name" width="150">
        <template slot-scope="scope">
          <span
            v-if="scope.row.listClass == 'default' || scope.row.listClass == ''"
            :key="scope.row.code"
           
            :class="scope.row.cssClass"
            >{{ scope.row.name }}</span
          >
          <el-tag
            v-else
            :key="scope.row.code"
            
            :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass"
            :class="scope.row.cssClass"
          >
            {{ scope.row.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="70">
        <template slot-scope="scope">
          <dict-tag :options="statusOptions" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="创建日期"
        align="center"
        prop="createTime"
        width="180"
      />
      <el-table-column label="排序" align="center" prop="orderNum" width="60" />
      <el-table-column
        label="字典类型"
        align="center"
        prop="tableType"
        width="150"
      />
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
      :title="title"
      :visible.sync="open"
      width="500px"
      top="6vh"
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
          <el-input v-model="form.tableType" :disabled="true" />
        </el-form-item>

        <el-form-item label="显示排序" prop="orderNum">
          <!-- <el-input v-model="form.orderNum" placeholder="请输入字典排序" /> -->
          <el-input-number
            v-model="form.orderNum"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="样式属性" prop="cssClass">
          <el-input v-model="form.cssClass" placeholder="请输入样式属性" />
        </el-form-item>
        <el-form-item label="回显样式" prop="listClass">
          <el-select v-model="form.listClass">
            <el-option
              v-for="item in listClassOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
              style="text-align:center"
            >
              <span
                v-if="item.code == 'default' || item.code == ''"
                :key="item.code"
              
                :class="item.code"
                >{{ item.name }}</span
              >
              <el-tag
                v-else
                :key="item.code"
               
                :type="item.code == 'primary' ? '' : item.code"
                :class="item.code"
                style="width: 120px"
                >{{ item.name }}</el-tag
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入备注"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.code"
              :label="dict.code"
            >
              {{ dict.name }}
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
import DictTag from "@/components/DictTag";

export default {
  name: "Dict",
  components: {
    DictTag,
  },
  props: ["tableType"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 状态字典
      statusOptions: [],
      // 字典管理表格数据
      dictList: [],
      // 数据标签回显样式
      listClassOptions: [],
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
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
          tableType: "", // 字典类型
          params: {},
        },
      },
      // 表单参数
      form: {
        code: undefined,
        name: undefined,
        tableType: undefined,
        remark: undefined,
        cssClass: undefined,
        listClass: "default",
        orderNum: 0,
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
  computed: {},
  created() {
    this.pageQuery.item.tableType =
      this.$route.params && this.$route.params.tableType;
    this.getList();
    this.getDicts("sys_job_status").then((response) => {
      this.statusOptions = response.data;
    });
    this.getDicts("list_class").then((response) => {
      this.listClassOptions = response.data;
    });
  },
  methods: {
    /** 查询字典管理列表 */
    getList() {
      this.loading = true;
      dictApi.listData(this.pageQuery).then((response) => {
        this.dictList = response.data.list;
        this.pageQuery.page.total = response.data.total;
        this.loading = false;
        // 重置item
        this.resetForm("queryForm");
        // 重置父字典
        this.parentDict = "";
      });
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

    // 分页
    handleSizeChange(val) {
      this.pageQuery.page.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageQuery.page.pageNum = val;
      this.getList();
    },

    // 表单重置
    reset() {
      this.form = {
        code: undefined,
        name: undefined,
        tableType: undefined,
        remark: undefined,
        cssClass: undefined,
        listClass: "default",
        orderNum: 0,
        status: "0",
      };
      this.resetForm("form");
    },
    // 新增按钮操作
    handleAdd() {
      this.reset();
      this.open = true;
      this.form.tableType = this.pageQuery.item.tableType;
      this.title = "添加字典数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      dictApi.getDictData(row.uuid).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改字典数据";
      });
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

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.uuid || this.ids;
      var that = this;
      var hint = '是否确认删除 "' + row.name + '" 字典项?';
      if (row.uuid === null || row.uuid === undefined || row.uuid === "") {
        hint = "是否确认删除选中字典项";
      }
      this.$confirm(hint, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          dictApi.delDict(dictIds).then((response) => {
            that.msgSuccess(response.message);
            that.getList();
          });
        })
        .catch(() => {});
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.uuid);
      this.multiple = !selection.length;
    }
  },
};
</script>

