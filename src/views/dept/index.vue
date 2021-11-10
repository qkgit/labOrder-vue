<template>
  <div class="container">
    <el-form
      :model="pageQuery.item"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="部门名称" prop="deptName">
        <el-input
          v-model="pageQuery.item.deptName"
          placeholder="请输入部门名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="pageQuery.item.status"
          placeholder="部门状态"
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
          >重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" style="margin-bottom: 8px">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="deptName"
        label="部门名称"
        width="260"
      ></el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序"
        width="200"
      ></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
      </el-table-column>
      <!-- :formatter="statusFormat" -->
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
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
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            >新增</el-button
          >
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Dept",
  //   components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 状态数据字典
      statusOptions: [],
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
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
          params: {},
        },
      },
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级部门不能为空", trigger: "blur" },
        ],
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "显示排序不能为空", trigger: "blur" },
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_status").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询字典管理列表 */
    getList() {
      this.loading = true;
      setTimeout( 1000);
      //   dictApi
      //     .listType(this.addDateRange(this.pageQuery, this.dateRange))
      //     .then((response) => {
      //       this.dictList = response.data.list;
      //       this.pageQuery.page.total = response.data.total;
      //       this.loading = false;
      //       //重置item
      //       this.resetForm("queryForm");
      //       //重置父字典
      //       this.parentDict = "";
      //     });
      this.deptList = [
        {
          searchValue: null,
          createBy: "admin",
          createTime: "2021-09-29 11:16:22",
          updateBy: null,
          updateTime: null,
          remark: null,
          params: {},
          deptId: 100,
          parentId: 0,
          ancestors: "0",
          deptName: "若依科技",
          orderNum: "0",
          leader: "若依",
          phone: "15888888888",
          email: "ry@qq.com",
          status: "0",
          delFlag: "0",
          parentName: null,
          children: [
            {
              searchValue: null,
              createBy: "admin",
              createTime: "2021-09-29 11:16:22",
              updateBy: null,
              updateTime: null,
              remark: null,
              params: {},
              deptId: 101,
              parentId: 100,
              ancestors: "0,100",
              deptName: "深圳总公司",
              orderNum: "1",
              leader: "若依",
              phone: "15888888888",
              email: "ry@qq.com",
              status: "0",
              delFlag: "0",
              parentName: null,
              children: [
                {
                  searchValue: null,
                  createBy: "admin",
                  createTime: "2021-09-29 11:16:22",
                  updateBy: null,
                  updateTime: null,
                  remark: null,
                  params: {},
                  deptId: 103,
                  parentId: 101,
                  ancestors: "0,100,101",
                  deptName: "研发部门",
                  orderNum: "1",
                  leader: "若依",
                  phone: "15888888888",
                  email: "ry@qq.com",
                  status: "0",
                  delFlag: "0",
                  parentName: null,
                  children: [],
                },
                {
                  searchValue: null,
                  createBy: "admin",
                  createTime: "2021-09-29 11:16:22",
                  updateBy: null,
                  updateTime: null,
                  remark: null,
                  params: {},
                  deptId: 104,
                  parentId: 101,
                  ancestors: "0,100,101",
                  deptName: "市场部门",
                  orderNum: "2",
                  leader: "若依",
                  phone: "15888888888",
                  email: "ry@qq.com",
                  status: "0",
                  delFlag: "0",
                  parentName: null,
                  children: [],
                },
                {
                  searchValue: null,
                  createBy: "admin",
                  createTime: "2021-09-29 11:16:22",
                  updateBy: null,
                  updateTime: null,
                  remark: null,
                  params: {},
                  deptId: 105,
                  parentId: 101,
                  ancestors: "0,100,101",
                  deptName: "测试部门",
                  orderNum: "3",
                  leader: "若依",
                  phone: "15888888888",
                  email: "ry@qq.com",
                  status: "0",
                  delFlag: "0",
                  parentName: null,
                  children: [],
                },
                {
                  searchValue: null,
                  createBy: "admin",
                  createTime: "2021-09-29 11:16:22",
                  updateBy: null,
                  updateTime: null,
                  remark: null,
                  params: {},
                  deptId: 106,
                  parentId: 101,
                  ancestors: "0,100,101",
                  deptName: "财务部门",
                  orderNum: "4",
                  leader: "若依",
                  phone: "15888888888",
                  email: "ry@qq.com",
                  status: "0",
                  delFlag: "0",
                  parentName: null,
                  children: [],
                },
                {
                  searchValue: null,
                  createBy: "admin",
                  createTime: "2021-09-29 11:16:22",
                  updateBy: null,
                  updateTime: null,
                  remark: null,
                  params: {},
                  deptId: 107,
                  parentId: 101,
                  ancestors: "0,100,101",
                  deptName: "运维部门",
                  orderNum: "5",
                  leader: "若依",
                  phone: "15888888888",
                  email: "ry@qq.com",
                  status: "0",
                  delFlag: "0",
                  parentName: null,
                  children: [],
                },
              ],
            },
            {
              searchValue: null,
              createBy: "admin",
              createTime: "2021-09-29 11:16:22",
              updateBy: null,
              updateTime: null,
              remark: null,
              params: {},
              deptId: 102,
              parentId: 100,
              ancestors: "0,100",
              deptName: "长沙分公司",
              orderNum: "2",
              leader: "若依",
              phone: "15888888888",
              email: "ry@qq.com",
              status: "0",
              delFlag: "0",
              parentName: null,
              children: [
                {
                  searchValue: null,
                  createBy: "admin",
                  createTime: "2021-09-29 11:16:22",
                  updateBy: null,
                  updateTime: null,
                  remark: null,
                  params: {},
                  deptId: 108,
                  parentId: 102,
                  ancestors: "0,100,102",
                  deptName: "市场部门",
                  orderNum: "1",
                  leader: "若依",
                  phone: "15888888888",
                  email: "ry@qq.com",
                  status: "0",
                  delFlag: "0",
                  parentName: null,
                  children: [],
                },
                {
                  searchValue: null,
                  createBy: "admin",
                  createTime: "2021-09-29 11:16:22",
                  updateBy: null,
                  updateTime: null,
                  remark: null,
                  params: {},
                  deptId: 109,
                  parentId: 102,
                  ancestors: "0,100,102",
                  deptName: "财务部门",
                  orderNum: "2",
                  leader: "若依",
                  phone: "15888888888",
                  email: "ry@qq.com",
                  status: "0",
                  delFlag: "0",
                  parentName: null,
                  children: [],
                },
              ],
            },
          ],
        },
      ];
      this.loading = false;
    },
     /** 搜索按钮操作 */
    handleQuery() {
        console.log('1')
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  },
};
</script>

<style>
</style>