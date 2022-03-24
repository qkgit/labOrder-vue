<template>
  <div class="container">
    <!-- 查询表单 -->
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="pageQuery.item"
      class="demo-form-inline"
    >
      <el-form-item prop="name">
        <el-input v-model="pageQuery.item.name" placeholder="教室名称" />
      </el-form-item>
      <el-form-item prop="address">
        <el-input v-model="pageQuery.item.address" placeholder="教室地址" />
      </el-form-item>
      <el-form-item prop="leader">
        <el-input v-model="pageQuery.item.leader" placeholder="教室负责人" />
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="pageQuery.item.status" placeholder="请选择教室状态">
          <el-option
            v-for="option in statusOptions"
            :key="option.code"
            :label="option.name"
            :value="option.code"
          />
        </el-select>
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
      :data="roomList"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="教室" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="cap" label="容量" width="80" />
      <el-table-column align="center" width="70" label="状态" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="statusOptions" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="leader" label="负责人" width="100" />
      <el-table-column
        prop="remark"
        label="备注"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作" width="150">
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
    <el-dialog :title="title" :visible.sync="open">
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
            <el-form-item label="名称" prop="name">
              <el-input size="medium" v-model="pojo.name" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="容量" prop="cap">
              <el-input size="medium" v-model="pojo.cap" style="width: 70%" />
              (人)
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="地址" prop="address">
              <el-input size="medium" v-model="pojo.address" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="楼层" prop="level">
              <el-input-number
                v-model="pojo.level"
                size="medium"
                controls-position="right"
                :min="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="教室负责人" prop="leaderId">
            <el-col :span="10">
              <treeselect
                v-model="pojo.leaderId"
                :options="userOptions"
                :props="defaultProps"
                :show-count="true"
                :disable-branch-nodes="true"
                placeholder="请选择教室负责人"
              />
            </el-col>
            <el-col :span="10">
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="pojo.status">
                  <el-radio
                    v-for="dict in statusOptions"
                    :key="dict.name"
                    :label="dict.code"
                    >{{ dict.name }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-form-item>
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
import roomApi from "@/api/system/classroom";
import { deptUserTreeSelect } from "@/api/system/role";
import DictTag from "@/components/DictTag";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: {
    Treeselect,
    DictTag,
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 状态
      statusOptions: [],
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 用户树选项
      userOptions: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      roomList: [],
      pageQuery: {
        page: {
          total: 10,
          pageNum: 1,
        },
        item: {
          name: undefined,
          address: undefined,
          leader: undefined,
          status: undefined,
        },
      },

      pojo: {},
      open: false,
      title: "",
      rules: {},
    };
  },
  // 钩子函数获取数据
  created() {
    this.getDicts("sys_common_status").then((response) => {
      this.statusOptions = response.data;
    });
    this.getList();
  },

  methods: {
    // 查询
    getList() {
      this.loading = true;
      roomApi.listRoom(this.pageQuery).then((response) => {
        const resp = response.data;
        this.pageQuery.page.total = resp.total;
        this.roomList = resp.list;
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
        cap: undefined,
        address: undefined,
        level: 1,
        leader: undefined,
        status: "0",
        remark: undefined,
      };
      this.resetForm("pojoForm");
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    getUserTreeSelect() {
      deptUserTreeSelect("3").then((res) => {
        this.userOptions = res.data;
      });
    },
    // 打开添加窗口
    handleAdd() {
      this.reset();
      this.getUserTreeSelect();
      this.open = true;
      this.title = "添加教室";
    },
    // 打开编辑窗口
    handleEdit(row) {
      this.reset();
      this.getUserTreeSelect();      
      roomApi.getRoom(row.uuid).then((response) => {
        this.pojo = response.data;
        this.open = true;
        this.title = "修改教室";
      });
    },

    submitForm: function () {
      this.$refs.pojoForm.validate((valid) => {
        if (valid) {
          if (this.pojo.uuid != undefined) {
             roomApi.updateRoom(this.pojo).then((res) => {
              this.open = false;
              this.msgSuccess(res.message);
              this.getList();
            });
          } else {
            roomApi.addRoom(this.pojo).then((res) => {
              this.open = false;
              this.msgSuccess(res.message);
              this.getList();
            });
          }
        }
      });
    },

    // 删除
    handleDelete(row) {
     const ids = row.uuid || this.ids;
     this.$confirm("确认删除选中教室吗?", "警告", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then( function() {
          return roomApi.delRoom(ids);
        })
        .then((res)=>{
          this.getList();
          this.msgSuccess(res.message);
        })
        .catch(() => {});
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
      this.ids = selection.map((item) => item.uuid);
      this.multiple = !selection.length;
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
  },
};
</script>

<style scoped>
</style>
