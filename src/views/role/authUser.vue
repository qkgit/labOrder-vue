<template>
  <div class="container">
    <el-page-header :content="roleId + '分配用户'" @back="goBack" />
    <el-form :model="pageQuery.item" ref="queryForm" :inline="true">
      <el-form-item label="用户名称" prop="userName"> 
          <el-input 
          v-model="pageQuery.item.userName" 
          placeholder="请输入用户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
          />
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNum"> 
          <el-input 
          v-model="pageQuery.item.phoneNum" 
          placeholder="请输入用户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
          />
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

    <el-row :gutter="10" >
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="openSelectUser"
        >添加用户</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-circle-close"
          size="mini"
          :disabled="multiple"
          @click="cancelAuthUserAll"
        >批量取消授权</el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: "AuthUser",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中用户组
      userIds: [],
      // 非多个禁用
      multiple: true,
      roleId: undefined,
      role: undefined,
      userList: undefined,
      pageQuery: {
        page: {
          total: 10,
          pageNum: 1, // 每页显示条数，10条
        },
        item: {
          roleName: undefined,
          roleKey: undefined,
          status: undefined,
          status: undefined,
        },
      },
    };
  },
  created() {
    this.roleId = this.$route.params && this.$route.params.roleId;
    // 获取角色信息
    // 获取角色授权列表
  },
  methods: {
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style>
</style>