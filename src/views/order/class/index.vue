<template>
  <div class="container">
    <div class="rule-top">
      <el-row class="item">
        <el-radio-group v-model="queryParam.week" @change="fetchWeek">
          <el-radio-button label="1">周一</el-radio-button>
          <el-radio-button label="2">周二</el-radio-button>
          <el-radio-button label="3">周三</el-radio-button>
          <el-radio-button label="4">周四</el-radio-button>
          <el-radio-button label="5">周五</el-radio-button>
          <el-radio-button label="6">周六</el-radio-button>
          <el-radio-button label="7">周日</el-radio-button>
        </el-radio-group>
      </el-row>
      <el-row>
        <el-tabs v-model="queryParam.courseNode" @tab-click="fetchNode">
          <el-tab-pane
            v-for="(t, i) in timeList"
            :key="i + 1"
            :label="'第' + digital2Chinese(i + 1) + '节课'"
            :name="(i + 1).toString()"
          />
        </el-tabs>
      </el-row>
    </div>
    <div style="">
      <el-card shadow="never" style="width: 10%; float: right">
        <el-tabs
          v-model="queryParam.floor"
          tab-position="left"
          style="height: 180px"
          @tab-click="fetchFloor"
        >
          <el-tab-pane label="四层" name="4" />
          <el-tab-pane label="三层" name="3" />
          <el-tab-pane label="二层" name="2" />
          <el-tab-pane label="一层" name="1" />
        </el-tabs>
      </el-card>

      <div
        :class="queryParam.floor > 1 ? 'room_background_2' : 'room_background'"
      >
        <div class="row_1">
          <div class="room_1">
            <el-card class="box-card" shadow="hover" @click.native="handleOrder"> 教室1 </el-card>
          </div>
          <div class="room_2">
            <el-card class="box-card" shadow="hover" @click.native="handleOrder"> 教室2 </el-card>
          </div>
          <div class="room_3">
            <el-card class="box-card" shadow="hover" @click.native="handleOrder"> 教室3 </el-card>
          </div>
        </div>
        <div class="row_2">
          <div class="room_4">
            <el-card class="box-card" shadow="hover" @click.native="handleOrder"> 教室4 </el-card>
          </div>
          <div class="room_5">
            <el-card class="box-card" shadow="hover" @click.native="handleOrder"> 教室5 </el-card>
          </div>
          <div class="room_6">
            <el-card class="box-card" shadow="hover" @click.native="handleOrder"> 教室6 </el-card>
          </div>
        </div>
        <div class="row_3">
          <div class="room_7">
            <el-card class="box-card-7" shadow="hover" @click.native="handleOrder"> 教室7 </el-card>
          </div>
          <div class="room_8">
            <el-card class="box-card-8" shadow="hover" @click.native="handleOrder"> 教室8 </el-card>
          </div>
        </div>
        <div class="room_9">
          <el-card class="box-card-9" shadow="hover" @click.native="handleOrder"> 教室9 </el-card>
        </div>
        <div class="col_1">
          <div class="room_10">
            <el-card class="box-card-10" shadow="hover" @click.native="handleOrder"> 教室10 </el-card>
          </div>
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
          // 星期
          const wk = new Date().getDay();
          this.queryParam.week = wk;
          // 楼层
          this.queryParam.floor = "1";
          // 判断当前时间所处节数
          var now = new Date();
          var node = 1;
          var maxNode = this.timeList.length + 1;
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
            if (now >= startTime && now <= endTime) {
              this.queryParam.courseNode =
                node > maxNode ? "1" : node.toString();
            } else {
              node = node + 1;
            }
          });
        })
        .then(() => {
          this.getList();
        });
    },

    getList() {
      console.log("=> getList");
      console.log(
        "=>周" +
          this.queryParam.week +
          " 第" +
          this.queryParam.courseNode +
          "节 " +
          this.queryParam.floor +
          "层"
      );
    },

    // 预约
    handleOrder(row) {
      this.$confirm("确认预约该教室吗?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(function(){
          return orderApi.orderLab(row.uuid)
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
}
.rule-top .item {
  margin: 0 15px;
  padding: 18px 0;
}
.box-card {
  width: 118px;
  height: 60px;
  background: #f3f3f3;
  cursor: pointer;
}
.box-card-7 {
  width: 108px;
  height: 71px;
  background: #f3f3f3;
  cursor: pointer;
}
.box-card-8 {
  width: 107px;
  height: 71px;
  background: #f3f3f3;
  cursor: pointer;
}
.box-card-9 {
  width: 120px;
  height: 88px;
  background: #f3f3f3;
  cursor: pointer;
}
.box-card-10 {
  width: 243px;
  height: 241px;
  background: #f3f3f3;
  cursor: pointer;
}
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
  display: inline-block;
  margin-top: 84px;
  margin-left: 85px;
}
.room_1 {
  height: 60px;
  width: 123px;
  margin-left: 319px;
  display: inline-block;
}
.room_2 {
  height: 60px;
  width: 123px;
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
  margin-left: 319px;
  display: inline-block;
}
.room_5 {
  height: 60px;
  width: 123px;
  display: inline-block;
}
.room_6 {
  height: 60px;
  width: 123px;
  display: inline-block;
}

.room_7 {
  height: 71px;
  width: 115px;
  margin-left: 339px;
  display: inline-block;
}
.room_8 {
  height: 71px;
  width: 107px;
  display: inline-block;
}
.room_9 {
  height: 88px;
  width: 120px;
  display: inline-block;
  margin-top: 278px;
  margin-left: 5px;
  float: left;
}
</style>
