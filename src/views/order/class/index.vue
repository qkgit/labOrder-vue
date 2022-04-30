<template>
  <div class="container">
    <el-form ref="ruleForm" :inline="true" :model="queryParam" class="rule-top">
      <el-form-item label="预约日期" prop="orderDate">
        <el-date-picker
          v-model="queryParam.orderDate"
          type="date"
          placeholder="选择预约日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="节数" prop="orderNode">
        <el-select v-model="queryParam.orderNode">
          <el-option
            v-for="(t, i) in timeList"
            :key="i + 1"
            :label="'第' + digital2Chinese(i + 1) + '节课'"
            :value="(i + 1).toString()"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="层数" prop="level">
        <el-select v-model="queryParam.level">
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
    <el-divider></el-divider>
    <el-card shadow="never" style="width: 15%; float: right">
      <div slot="header" class="clearfix">
        <span>说明</span>
      </div>
      <p><el-tag>教室正常 可预约</el-tag></p>
      <p><el-tag type="info">教室有课/关闭 不可预约</el-tag></p>
      <p><el-tag type="success">预约成功</el-tag></p>
      <p><el-tag type="danger">预约失败/教室已满</el-tag></p>
      <p><el-tag type="warning">预约审核中</el-tag></p>
    </el-card>
    <div
      v-loading="loading"
      :class="queryParam.level > 1 ? 'room_background_2' : 'room_background'"
    >
      <el-card
        v-for="(item, index) in classroomList"
        :key="index"
        :class="'room_' + item.roomAddress + ' orderStatus_' + item.orderStatus"
        shadow="hover"
        body-style="padding: 0;"
        @click.native="handleOrder(item.roomAddress)"
      >
        <p
          style="
            font-size: 14px;
            line-height: 23px;
            text-align: center;
            font-weight: bold;
            margin: 0;
          "
        >
          {{ item.roomName }}
        </p>
        <p v-if="item.orderStatus != 1" style="margin: 0">
          人数:{{ item.orderNum }}/{{ item.roomCap }}
        </p>
        <p v-else-if="item.table != null" style="margin: 0">
          {{ item.table.course.name }}/{{ item.table.dept.deptName }}
        </p>
        <p v-else style="margin: 0">教室已关闭</p>
      </el-card>
    </div>

    <el-dialog title="添加预约" :visible.sync="show" width="30%">
      <el-form
        ref="orderDataForm"
        :model="orderData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="预约教室" prop="roomName">
          {{ orderData.roomName }}
        </el-form-item>
        <el-form-item label="预约时间" prop="orderDate">
          {{
            parseTime(orderData.orderDate, "{y}-{m}-{d} 周{a}") +
            "  第" +
            digital2Chinese(orderData.orderNode) +
            "节课"
          }}
        </el-form-item>
        <el-form-item label="预约说明" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请先填写预约说明"
            v-model="orderData.remark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="order">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import courseApi from "@/api/system/course";
import orderApi from "@/api/system/classroomOrder";
import store from "@/store";


export default {
  data() {
    return {
      loading: true,
      show: false,
      timeList: [],
      classroomList: [],
      // 查询参数
      queryParam: {
        // 预约时间
        orderDate: "",
        // 课程节数
        orderNode: "",
        // 星期
        orderWeek: "",
        // 楼层
        level: "1",
      },
      orderData: {
        orderId: undefined,
        classroomId: undefined,
        orderDate: undefined,
        orderNode: undefined,
        remark: undefined,
      },
      pickerOptions: {
        disabledDate(time) {
          const startDate = new Date();
          const endDate = new Date();
          startDate.setTime(startDate.getTime() - 3600 * 1000 * 24);
          endDate.setTime(endDate.getTime() + 3600 * 1000 * 24 * 6);
          var userRoles = store.getters.roles;
          if (userRoles.includes("1")) {
            return time.getTime() < endDate;
          } else if (userRoles.includes("2")) {
            return time.getTime() < startDate || time.getTime() > endDate;
          }
          return time.getTime() < startDate;
        },
      },
      rules: {
        remark: [
          { required: true, message: "预约说明不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.initParamAndQuery();
  },
  methods: {
    /**
     *  初始化数据并查询
     */
    initParamAndQuery() {
      var userRoles = this.$store.getters.roles;
      console.log(userRoles);
      courseApi
        .getDefaultTime()
        .then((res) => {
          const defaultTime = res.data;
          this.timeList = defaultTime.times;
        })
        .then(() => {
          let date = new Date()
          // 日期
          if (userRoles.includes("1")) {
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
          } 
          this.queryParam.orderDate = date;
          
          // 星期
          const wk = new Date().getDay();
          this.queryParam.orderWeek = wk;
          // 楼层
          this.queryParam.level = "1";
          // 判断当前时间所处节数
          var now = new Date();
          var node = 1;
          var maxNode = this.timeList.length;
          this.timeList.forEach((t, i) => {
            var start = t.startTime.split(":");
            var end = t.endTime.split(":");
            var startTime = new Date();
            var endTime = new Date();
            startTime.setHours(start[0]);
            startTime.setMinutes(start[1]);
            startTime.setSeconds(start[2]);
            endTime.setHours(end[0]);
            endTime.setMinutes(end[1]);
            endTime.setSeconds(end[2]);
            if (now <= endTime) {
              return;
            } else {
              node = node + 1;
            }
          });
          this.queryParam.orderNode = node > maxNode ? "1" : node + "";
        })
        .then(() => {
          this.getList();
        });
    },
    getList() {
      this.loading = true;
      orderApi.getClassroomCourseList(this.queryParam).then((res) => {
        this.classroomList = res.data;
        this.loading = false;
      });
    },
    handleOrder(roomAddress) {
      this.reset();
      // 获取当前选择教室信息
      var roomList = this.classroomList;
      var room = roomList.filter((r) => r.roomAddress == roomAddress)[0];
      var alert = "";
      // 判断预约状态
      if (room.orderStatus == 1) {
        alert =
          room.table != null
            ? "当前教室存在课程不可预约!"
            : "教室已关闭不可预约!";
      } else if (room.orderStatus == 6 || room.orderStatus == 7) {
        alert = "已经预约请等待审核结果!";
      } else if (room.orderStatus == 8) {
        alert = "已经成功预约该教室,不可重复预约!";
      }
      if (alert != "") {
        this.$alert(alert, "提示", {
          confirmButtonText: "确定",
          callback: (action) => {},
        });
      } else {
        this.orderData.orderId = room.uuid;
        this.orderData.classroomId = room.roomId;
        this.orderData.roomName = room.roomName;
        this.orderData.orderDate = this.queryParam.orderDate;
        this.orderData.orderNode = this.queryParam.orderNode;
        this.show = true;
      }
    },
    cancel() {
      this.show = false;
      this.reset();
    },
    // 预约
    order() {
      this.$refs["orderDataForm"].validate((valid) => {
        if (valid) {
          orderApi
            .orderClassroom(this.orderData)
            .then((response) => {
              this.msgSuccess("O(∩_∩)O 预约成功!");
              this.show = false;
              this.reset();
              this.getList();
            })
            .catch(() => {});
        }
      });
    },
    // 表单重置
    reset() {
      this.orderData = {
        orderId: undefined,
        classroomId: undefined,
        roomName: undefined,
        orderDate: undefined,
        orderNode: undefined,
        remark: undefined,
      };
      this.resetForm("orderDataForm");
    },
  },
};
</script>

<style>
.rule-top {
  margin-top: 24px;
}

/* 背景 */
.room_background {
  background: url("../../../assets/floor_pic/1.jpg");
  background-position: 0px -80px;
  background-repeat: no-repeat;
  height: 640px;
  width: 1060px;
  float: left;
}
.room_background_2 {
  background: url("../../../assets/floor_pic/2.jpg");
  background-position: 0px -80px;
  background-repeat: no-repeat;
  height: 640px;
  width: 1060px;
  float: left;
}

/* 状态样式 */
/* 正常 */
.orderStatus_0 {
  background-color: #ecf5ff;
  border-color: #d9ecff;
  color: #409eff;
  line-height: 20px;
  font-size: 12px;
  font-weight: 600;
}
/* 关闭 */
.orderStatus_1 {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
  line-height: 20px;
  font-size: 12px;
  font-weight: 600;
}
/* 审核中 */
.orderStatus_6 {
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
  line-height: 20px;
  font-size: 12px;
  font-weight: 600;
}
.orderStatus_7 {
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
  line-height: 20px;
  font-size: 12px;
  font-weight: bold;
}
/* 成功 */
.orderStatus_8 {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
  line-height: 20px;
  font-size: 12px;
  font-weight: 600;
}
/* 失败 */
.orderStatus_9 {
  background-color: #fef0f0;
  border-color: #fde2e2;
  color: #f56c6c;
  line-height: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* 教室样式 */
.room_c1_1 {
  float: left;
  display: inline-block;
  margin-top: 58px;
  margin-left: 1px;
  width: 59px;
  height: 60px;
  cursor: pointer;
}
.room_c1_2 {
  float: left;
  display: inline-block;
  margin-top: 58px;
  margin-left: 5px;
  width: 59px;
  height: 60px;
  cursor: pointer;
}
.room_c2_1 {
  float: left;
  display: inline-block;
  margin-top: 70px;
  margin-left: 1px;
  width: 59px;
  height: 60px;
  cursor: pointer;
}
.room_c2_2 {
  float: left;
  display: inline-block;
  margin-top: 70px;
  margin-left: 5px;
  width: 59px;
  height: 60px;
  cursor: pointer;
}
.room_c3 {
  float: left;
  display: inline-block;
  margin-top: 58px;
  margin-left: 5px;
  width: 118px;
  height: 60px;
  cursor: pointer;
}
.room_c4 {
  float: left;
  display: inline-block;
  margin-top: 70px;
  margin-left: 5px;
  width: 118px;
  height: 60px;
  cursor: pointer;
}
.room_c5 {
  float: left;
  display: inline-block;
  margin-top: 58px;
  margin-left: 319px;
  width: 118px;
  height: 60px;
  cursor: pointer;
}
.room_c6 {
  float: left;
  display: inline-block;
  margin-top: 70px;
  margin-left: 319px;
  width: 118px;
  height: 60px;
  cursor: pointer;
}
.room_j6 {
  float: left;
  display: inline-block;
  margin-top: 284px;
  margin-left: 339px;
  width: 108px;
  height: 71px;
  cursor: pointer;
}
.room_j5 {
  float: left;
  display: inline-block;
  margin-top: 284px;
  margin-left: 7px;
  width: 107px;
  height: 71px;
  cursor: pointer;
}
.room_j4 {
  float: left;
  display: inline-block;
  margin-top: 284px;
  margin-left: 5px;
  width: 120px;
  height: 88px;
  cursor: pointer;
}
.room_j0 {
  display: inline-block;
  margin-top: 84px;
  margin-left: 88px;
  width: 243px;
  height: 241px;
  cursor: pointer;
}
</style>
