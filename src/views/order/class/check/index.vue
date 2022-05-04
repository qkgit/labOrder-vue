<template>
  <div class="container">
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="pageQuery.item"
      class="rule-top"
    >
      <el-form-item label="预约日期" prop="orderDate">
        <el-date-picker
          v-model="pageQuery.item.orderDate"
          type="date"
          placeholder="选择预约日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="节数" prop="orderNode">
        <el-select v-model="pageQuery.item.orderNode">
          <el-option
            v-for="(t, i) in timeList"
            :key="i + 1"
            :label="'第' + digital2Chinese(i + 1) + '节课'"
            :value="(i + 1).toString()"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="教室" prop="classroomName">
        <el-input
          v-model="pageQuery.item.classroomName"
          placeholder="教室名称"
        />
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
          icon="el-icon-check"
          size="mini"
          :disabled="multiple"
          @click="handleAdd"
          >通过</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-close"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >不通过</el-button
        >
      </el-col>
      <div class="top-right-btn">
        <el-radio-group v-model="display" size="mini">
          <el-radio-button label="待办"></el-radio-button>
          <el-radio-button label="已办"></el-radio-button>
        </el-radio-group>
      </div>
    </el-row>

    <el-table
      v-loading="loading"
      :data="orderRoomList"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <!-- <el-table-column type="index" label="序号" width="60" /> -->
      <el-table-column prop="classroomName" label="教室" width="120" />
      <el-table-column prop="orderDate" label="预约时间" width="170">
        <template slot-scope="scope">
          {{
            scope.row.orderDate +
            "  第" +
            digital2Chinese(scope.row.orderNode) +
            "节课"
          }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="预约说明" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="viewDetails(scope.row)">
            查看
          </el-button>
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

    <el-dialog title="预约信息" :visible.sync="show" width="30%">
      <el-form ref="pojoForm" :model="pojo" :rules="rules" label-width="80px">
        <el-form-item label="预约教室" prop="roomName">
          {{ pojo.classroomName }}
        </el-form-item>
        <el-form-item label="预约时间" prop="orderDate">
          {{
            parseTime(pojo.orderDate, "{y}-{m}-{d} 周{a}") +
            "  第" +
            digital2Chinese(pojo.orderNode) +
            "节课"
          }}
        </el-form-item>
        <el-form-item label="预约说明" prop="remark">
          {{ pojo.remark }}
        </el-form-item>
        <el-form-item label="审核意见" prop="reviewRemark">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="pojo.reviewRemark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">通 过</el-button>
        <el-button type="danger" @click="cancel">不 通 过</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import courseApi from "@/api/system/course";
import orderApi from "@/api/system/classroomOrder";
import DictTag from "@/components/DictTag";
import moment from "moment";

export default {
  components: { DictTag },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      timeList: [],
      statusOptions: [],
      orderRoomList: [],
      display: "待办",
      // 查询参数
      pageQuery: {
        page: {
          total: 10,
          pageNum: 1,
          pageSize: 10,
        },
        item: {
          // 预约时间
          orderDate: undefined,
          // 课程节数
          orderNode: undefined,
          // 教室名称
          classroomName: undefined,
          // 星期
          orderWeek: undefined,
          // 楼层
          level: undefined,
          // 审核状态
          state: undefined,
        },
      },
      show: false,
      pojo: {},
      rules: {
        reviewRemark: [
          { required: true, message: "审核意见不能为空", trigger: "blur" },
        ],
      },
    };
  },
  // 钩子函数获取数据
  created() {
    this.initParamAndQuery();
    this.getDicts("order_status").then((response) => {
      this.statusOptions = response.data;
    });
  },

  methods: {
    initParamAndQuery() {
      courseApi
        .getDefaultTime()
        .then((res) => {
          const defaultTime = res.data;
          this.timeList = defaultTime.times;
        })
        .then(() => {
          this.getList();
        });
    },

    // 查询
    getList() {
      this.loading = true
      this.pageQuery.item.state = this.display == "待办" ? "0" : "1";
      orderApi.getOrderListByUser(this.pageQuery).then((response) => {
        const resp = response.data;
        this.pageQuery.page.total = resp.total;
        this.orderRoomList = resp.list;
        this.loading = false
      });
    },
    // 重置
    resetQuery() {
      this.resetForm("ruleForm");
      this.getList();
    },
    // 表单重置
    reset() {
      this.pojo = {
        uuid: undefined,
        classroomId: undefined,
        classroomName: undefined,
        orderId: undefined,
        orderUser: undefined,
        orderDate: undefined,
        orderNode: undefined,
        orderStatus: undefined,
        remark: undefined,
        reviews: undefined,
        createTime: undefined,
      };
      this.resetForm("pojoForm");
    },
    // 查看预约信息
    viewDetails(row) {
      this.reset();
      this.pojo = row;
      this.show = true;
    },

    // 取消预约
    handleCancel(row) {
      console.log(row);
      this.$confirm("确认取消这个预约吗？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(function () {
          return orderApi.cencelOrder(row.uuid);
        })
        .then((response) => {
          this.msgSuccess(response.message);
          this.getList();
        })
        .catch(() => {});
    },

    // todo 删除预约记录
    handleDelete(row) {},

    // 取消按钮
    cancel() {
      this.show = false;
      this.reset();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.uuid);
      this.multiple = !selection.length;
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.orderStatus);
    },
    // 时间格式化
    dateFormat(date) {
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
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
.top-right-btn {
  position: relative;
  float: right;
}
</style>
