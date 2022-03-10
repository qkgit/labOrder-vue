<template>
  <div class="container">
    <!-- 查询表单 -->
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="queryParams"
      class="demo-form-inline"
    >
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="菜单状态"
          clearable
          size="small"
        >
          <el-option
            v-for="option in statusOptions"
            :key="option.code"
            :label="option.name"
            :value="option.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="getList()"
          >查询
        </el-button>

        <el-button icon="el-icon-refresh-right" size="mini" @click="resetQuery"
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
    </el-row>

    <!-- 数据列表  -->
    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="menuId"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon
            v-if="scope.row.iconType == 'icon'"
            :icon-class="scope.row.icon"
          />
          <i
            v-if="scope.row.iconType == 'element'"
            :class="'el-icon-' + scope.row.icon"
          ></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="menuName"
        label="菜单名称"
        :show-overflow-tooltip="true"
        width="160"
      />
      <el-table-column prop="orderNum" label="排序" width="60" />

      <!-- <el-table-column
        prop="perms"
        label="权限标识"
        :show-overflow-tooltip="true"
      /> -->
      <el-table-column
        prop="path"
        label="路由地址"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="component"
        label="组件路径"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="visible" label="显示状态" width="90">
        <template slot-scope="scope">
          <dict-tag :options="visibleOptions" :value="scope.row.visible" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="70">
        <template slot-scope="scope">
          <dict-tag :options="statusOptions" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
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
    </el-table>

    <!-- 新增对话框 -->
    <el-dialog :title="title" :visible.sync="open">
      <el-form
        ref="pojoForm"
        status-icon
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="right"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <!-- <el-radio label="F">按钮</el-radio> -->
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'">
              <span slot="label">
                <el-tooltip
                  content="选择是外链则路由地址需要以`http(s)://`开头"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                是否外链
              </span>
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input
                  slot="reference"
                  v-model="form.icon"
                  placeholder="点击选择图标"
                  readonly
                  clearable
                >
                  <i
                    v-if="form.icon == undefined"
                    slot="prefix"
                    class="el-icon-search el-input__icon"
                  />
                  <i
                    v-else-if="form.iconType == 'element'"
                    slot="prefix"
                    :class="'el-icon-' + form.icon"
                    style="height: 32px; width: 16px"
                  />
                  <svg-icon
                    v-else-if="form.iconType == 'icon'"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px; width: 16px"
                  />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" prop="path">
              <span slot="label">
                <el-tooltip
                  content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip
                  content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                组件路径
              </span>
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType == 'C'">
              <span slot="label">
                <el-tooltip
                  content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                是否缓存
              </span>
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">缓存</el-radio>
                <el-radio label="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'">
              <span slot="label">
                <el-tooltip
                  content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                显示状态
              </span>
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in visibleOptions"
                  :key="dict.code"
                  :label="dict.code"
                  >{{ dict.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'">
              <span slot="label">
                <el-tooltip
                  content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                菜单状态
              </span>
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.code"
                  :label="dict.code"
                  >{{ dict.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
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
import menuApi from "@/api/system/menu";
import DictTag from "@/components/DictTag";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
export default {
  name: "menu",
  components: {
    DictTag,
    Treeselect,
    IconSelect,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 菜单状态数据字典
      statusOptions: [],
      // 显示状态数据字典
      visibleOptions: [],
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        status: undefined,
      },
      form: {},
      // 是否显示弹出对话框
      open: false,
      // 弹出层标题
      title: "",
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" },
        ],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" },
        ],
      },
    };
  },

  // 钩子函数获取数据
  created() {
    this.getDicts("sys_common_status").then((response) => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_show_hide").then((response) => {
      this.visibleOptions = response.data;
    });
    this.getList();
  },
  methods: {
    // 查询
    getList() {
      this.loading = true;
      menuApi.listMenu(this.queryParams).then((response) => {
        this.menuList = this.handleTree(response.data, "menuId");
        this.loading = false;
      });
    },
    /** 查询菜单下拉树结构 */
    getTreeSelect() {
      menuApi.listMenu().then((response) => {
        this.menuOptions = [];
        const menu = { menuId: 0, menuName: "主类目", children: [] };
        menu.children = this.handleTree(response.data, "menuId");
        this.menuOptions.push(menu);
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children,
      };
    },
    // 选择图标
    selected(name, type) {
      this.form.icon = name;
      this.form.iconType = type;
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        iconType: undefined,
        menuType: "M",
        orderNum: undefined,
        isFrame: "1",
        isCache: "0",
        visible: "0",
        status: "0",
      };
      this.resetForm("pojoForm");
    },

    // 打开添加窗口
    handleAdd(row) {
      this.reset();
      this.getTreeSelect();
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加菜单";
    },
    // 打开编辑窗口
    handleEdit(row) {
      this.reset();
      this.getTreeSelect();
      menuApi.getMenu(row.menuId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改菜单";
      });
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["pojoForm"].validate((valid) => {
        if (valid) {
          if (this.form.menuId != undefined) {
            menuApi.updateMenu(this.form).then((response) => {
              this.msgSuccess(response.message);
              this.open = false;
              this.getList();
            });
          } else {
            menuApi.addMenu(this.form).then((response) => {
              this.msgSuccess(response.message);
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },

    // 删除
    handleDelete(row) {
      this.$confirm(
        '是否确认删除名称为"' + row.menuName + '"的数据项？',
        "警告",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确认",
          type: "warning",
        }
      )
        .then(() => {
          menuApi.delMenu(row.menuId).then((response) => {
            this.msgSuccess(response.message);
            this.getList();
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style>
</style>