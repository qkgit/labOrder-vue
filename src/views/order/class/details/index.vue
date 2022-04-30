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
      <el-form-item label="层数" prop="level">
        <el-select v-model="pageQuery.item.level">
          <el-option
            v-for="i in 4"
            :key="i + 1"
            :label="digital2Chinese(i) + '层'"
            :value="i.toString()"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList()"
          >查询
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 数据列表  -->
    <!-- <el-card
      shadow="hover"
      style="margin: 10px 0px"
      v-for="(k, i) in 1"
      :key="i"
    >
      <el-descriptions :title="'教室名称'" column="4" >
        <el-descriptions-item label="预约时间">{{
          "2022年4月30日 第三节"
        }}</el-descriptions-item>
        <el-descriptions-item label="预约状态">{{
          "审核中"
        }}</el-descriptions-item>
        <el-descriptions-item label="预约说明">
          {{ "预约说明" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <el-button type="primary" size="small">取消预约</el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-card> -->
    <el-table :data="labOrderList" stripe border>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="lname" label="教室" width="150" />
      <el-table-column prop="expName" label="预约时间" width="200" />
      <el-table-column prop="" label="预约说明" />
      <el-table-column prop="loState" label="预约状态" width="100" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.loState == 1"
            size="mini"
            type="warning"
            @click="handleCancel(scope.row.loId)"
            >取消预约</el-button
          >
          <p v-if="scope.row.loState != 1">不可取消</p>
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
  </div>
</template>

<script>
import courseApi from "@/api/system/course";
import orderApi from "@/api/system/classroomOrder";
import moment from "moment";

export default {
  data() {
    return {
      timeList: [],
      orderRoomList: [],
      // 查询参数
      pageQuery: {
        page: {
          total: 10,
          pageNum: 1,
          pageSize: 10,
        },
        item: {
          // 预约时间
          orderDate: "",
          // 课程节数
          orderNode: "",
          // 星期
          orderWeek: "",
          // 楼层
          level: "",
        },
      },
      rules: {},
    };
  },
  // 钩子函数获取数据
  created() {
    this.initParamAndQuery();
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
      orderApi.getOrderListByUser(this.pageQuery).then((response) => {
        const resp = response.data;
        this.pageQuery.page.total = resp.total;
        this.orderRoomList = resp.list;
      });
    },

    // 取消预约
    handleCancel(id) {
      this.$confirm("确认取消这个预约吗？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(() => {
          // 确认
          var that = this;
          orderApi.cencelOrder(id).then((response) => {
            // 提示信息
            this.$message({
              type: response.resultCode == 200 ? "success" : "error",
              message: "取消成功！",
            });
            if (response.resultCode == 200) {
              // 删除成功 刷新列表
              that.getList();
            }
          });
        })
        .catch(() => {
          // 取消删除 不理会
        });
    },
    // 时间格式化
    dateFormat(row, column) {
      var date = row[column.property];
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
      // 当页码改变后 被触发
      console.log(val);
      this.pageQuery.page.pageNum = val;
      this.getList();
    },
  },
};
</script>

<style scoped>
</style>
