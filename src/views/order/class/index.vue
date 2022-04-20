<template>
  <div class="container">
    <el-form ref="ruleForm" :inline="true" :model="queryParam" class="rule-top">
      <el-form-item label="预约日期" prop="date">
        <el-date-picker
          v-model="queryParam.date"
          type="date"
          placeholder="选择预约日期"
          @change="getList"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="节数" prop="courseNode">
        <el-select v-model="queryParam.courseNode" @change="getList">
          <el-option
            v-for="(t, i) in timeList"
            :key="i + 1"
            :label="'第' + digital2Chinese(i + 1) + '节课'"
            :value="(i + 1).toString()"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="层数" prop="floor">
        <el-select v-model="queryParam.floor" @change="getList">
          <el-option
            v-for="i in 4"
            :key="i + 1"
            :label="digital2Chinese(i) + '层'"
            :value="i.toString()"
          />
        </el-select>
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
      <p><el-tag type="danger">预约失败</el-tag></p>
      <p><el-tag type="warning">预约审核中</el-tag></p>
      
      
    </el-card>
    <div
      :class="queryParam.floor > 1 ? 'room_background_2' : 'room_background'"
    >
      <div class="row_1">
        <div class="room_6">
          <el-card
            class="box-card normal"
            shadow="hover"
            body-style="padding: 0;"
            @click.native="handleOrder"
          >
            <div ref="c6">6教室</div>
          </el-card>
        </div>
        <div class="room_4">
          <el-card
            ref="4"
            class="box-card normal"
            shadow="hover"
            body-style="padding: 0;"
            @click.native="handleOrder"
          >
            4教室
          </el-card>
        </div>
        <div class="room_2_2">
          <el-card
            ref="2_2"
            class="box-card-2 normal"
            shadow="hover"
            body-style="padding: 0;"
            @click.native="handleOrder"
          >
            2教室西
          </el-card>
        </div>
        <div class="room_2_1">
          <el-card
            ref="2_1"
            class="box-card-2 normal"
            shadow="hover"
            body-style="padding: 0;"
            @click.native="handleOrder"
          >
            2教室东
          </el-card>
        </div>
      </div>

      <div class="row_2">
        <div class="room_5">
          <el-card
            ref="5"
            class="box-card normal"
            shadow="hover"
            body-style="padding: 0;"
            @click.native="handleOrder"
          >
            5教室
          </el-card>
        </div>
        <div class="room_3">
          <el-card
            ref="3"
            class="box-card normal"
            shadow="hover"
            body-style="padding: 0;"
            @click.native="handleOrder"
          >
            3教室
          </el-card>
        </div>
        <div class="room_1_2">
          <el-card
            ref="1_2"
            class="box-card-2 normal"
            shadow="hover"
            body-style="padding: 0;"
            @click.native="handleOrder"
          >
            1教室西</el-card
          >
        </div>
        <div class="room_1_1">
          <el-card
            ref="1_1"
            class="box-card-2 normal"
            shadow="hover"
            body-style="padding: 0;"
            @click.native="handleOrder"
          >
            1教室东
          </el-card>
        </div>
      </div>

      <div class="row_3">
        <div class="room_j6">
          <el-card
            ref="j6"
            class="box-card-j6 normal"
            shadow="hover"
            body-style="padding: 0;"
            @click.native="handleOrder"
          >
            6阶梯教室
          </el-card>
        </div>
        <div class="room_j5">
          <el-card
            ref="j5"
            class="box-card-j5 normal"
            shadow="hover"
            body-style="padding: 0;"
            @click.native="handleOrder"
          >
            5阶梯教室
          </el-card>
        </div>
      </div>
      <div class="room_j4">
        <el-card
          ref="j4"
          class="box-card-j4 normal"
          shadow="hover"
          body-style="padding: 0;"
          @click.native="handleOrder"
        >
          4阶梯教室
        </el-card>
      </div>

      <div class="col_1">
        <div class="room_10">
          <el-card
            ref="j0"
            class="box-card-j0 normal"
            shadow="hover"
            body-style="padding: 0;"
            @click.native="handleOrder"
          >
            大阶梯教室
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import courseApi from "@/api/system/course";

export default {
  data() {
    return {
      // 查询参数
      queryParam: {
        date: "",
        // 课程节数
        courseNode: "",
        // 星期
        week: "",
        // 楼层
        floor: "1",
      },
      timeList: [],
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
      courseApi
        .getDefaultTime()
        .then((res) => {
          const defaultTime = res.data;
          this.timeList = defaultTime.times;
        })
        .then(() => {
          // 日期
          this.queryParam.date = new Date();
          // 星期
          const wk = new Date().getDay();
          this.queryParam.week = wk;
          // 楼层
          this.queryParam.floor = "1";
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
          this.queryParam.courseNode = node > maxNode ? "1" : node + "";
        })
        .then(() => {
          this.getList();
        });
    },

    getList() {
      console.log("=> getList");
      console.log(
        "=>天" +
          this.queryParam.date +
          "周" +
          new Date(this.queryParam.date).getDay() +
          "第" +
          this.queryParam.courseNode +
          "节 " +
          this.queryParam.floor +
          "层"
      );
      var t = this.$refs.c6;
      debugger;
      console.log(t);
    },

    // 预约
    handleOrder(row) {
      this.$confirm("确认预约该教室吗?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(function () {
          return orderApi.orderLab(row.uuid);
        })
        .then((response) => {
          this.getList();
        })
        .catch(() => {});
    },

    // 选择周
    fetchWeek(value) {
      this.queryParam.week = value;
      this.getList();
    },
    // 选择节数
    fetchNode(tab, event) {
      this.queryParam.courseNode = tab.name;
      this.getList();
    },
    // 选择楼层
    fetchFloor(tab, event) {
      this.queryParam.floor = tab.name;
      this.getList();
    },
  },
};
</script>

<style>
.rule-top {
  margin-top: 24px;
}

/* 正常 */
.normal{
  background-color: #ecf5ff;
  border-color: #d9ecff;
  color: #409eff;
  line-height: 30px;
  font-size: 12px;
}
/* 关闭 */
.info {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
  line-height: 30px;
  font-size: 12px;
}
/* 成功 */
.success {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
  line-height: 30px;
  font-size: 12px;
}

/* 失败 */
.danger {
  background-color: #fef0f0;
  border-color: #fde2e2;
  color: #f56c6c;
  line-height: 30px;
  font-size: 12px;
}
/* 审核中 */
.warning {
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
  line-height: 30px;
  font-size: 12px;
}

.box-card {
  width: 118px;
  height: 60px;
  cursor: pointer;
}
.box-card-2 {
  width: 59px;
  height: 60px;
  cursor: pointer;
}
.box-card-j6 {
  width: 108px;
  height: 71px;
  cursor: pointer;
}
.box-card-j5 {
  width: 107px;
  height: 71px;
  cursor: pointer;
}
.box-card-j4 {
  width: 120px;
  height: 88px;
  cursor: pointer;
}
.box-card-j0 {
  width: 243px;
  height: 241px;
  cursor: pointer;
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

/* 行 列 样式 */
.row_1 {
  margin-top: 70px;
  width: 65%;
  float: left;
}
.row_2 {
  margin-top: 55px;
  width: 65%;
  float: left;
}
.row_3 {
  margin-top: 278px;
  width: 53%;
  float: left;
}
.col_1 {
  margin-top: 84px;
  margin-left: 85px;
  display: inline-block;
}

/* 教室样式 */
.room_1_1 {
  height: 60px;
  width: 62px;
  display: inline-block;
}
.room_1_2 {
  height: 60px;
  width: 61px;
  display: inline-block;
}
.room_2_1 {
  height: 60px;
  width: 62px;
  display: inline-block;
}
.room_2_2 {
  height: 60px;
  width: 61px;
  display: inline-block;
}
.room_3 {
  height: 60px;
  width: 123px;
  display: inline-block;
}
.room_4 {
  height: 60px;
  width: 123px;
  display: inline-block;
}
.room_5 {
  height: 60px;
  width: 123px;
  margin-left: 319px;
  display: inline-block;
}
.room_6 {
  height: 60px;
  width: 123px;
  margin-left: 319px;
  display: inline-block;
}
.room_j6 {
  height: 71px;
  width: 115px;
  margin-left: 339px;
  display: inline-block;
}
.room_j5 {
  height: 71px;
  width: 107px;
  display: inline-block;
}
.room_j4 {
  height: 88px;
  width: 120px;
  display: inline-block;
  margin-top: 278px;
  margin-left: 5px;
  float: left;
}
</style>
