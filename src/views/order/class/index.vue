<template>
  <div class="container">
    <div class="rule-top">
      <el-row class="item">
        <el-radio-group v-model="item.week" @tab-click="fetchData">
          <el-radio-button label="Monday">周一</el-radio-button>
          <el-radio-button label="Tuesday">周二</el-radio-button>
          <el-radio-button label="Wednesday">周三</el-radio-button>
          <el-radio-button label="Thursday">周四</el-radio-button>
          <el-radio-button label="Friday">周五</el-radio-button>
          <!-- <el-radio-button label="" disabled >    </el-radio-button> -->
          <el-radio-button label="Saturday">周六</el-radio-button>
          <el-radio-button label="Sunday">周日</el-radio-button>
        </el-radio-group>
      </el-row>
      <el-row>
        <el-tabs
          v-model="item.classHour"
          style="width: 730px"
          @tab-click="fetchData"
        >
          <el-tab-pane label="第一节课" name="first" />
          <el-tab-pane label="第二节课" name="second" />
          <el-tab-pane label="第三节课" name="third" />
          <el-tab-pane label="第四节课" name="fourth" />
          <el-tab-pane label="第五节课" name="fifth" />
          <el-tab-pane label="第六节课" name="sixth" />
          <el-tab-pane label="第七节课" name="seventh" />
          <el-tab-pane label="第八节课" name="eighth" />
        </el-tabs>
      </el-row>
    </div>
    <div style="">
      <el-card shadow="never" style="width: 10%; float: right">
        <el-tabs
          v-model="item.floor"
          tab-position="left"
          style="height: 180px"
          @tab-click="fetchData"
        >
          <el-tab-pane label="四层" name="four" />
          <el-tab-pane label="三层" name="three" />
          <el-tab-pane label="二层" name="two" />
          <el-tab-pane label="一层" name="one" />
        </el-tabs>
      </el-card>

      <div class="room_background">
        <div class="room_1">
          <el-card class="box-card" shadow="hover">
            教室1
          </el-card>
        </div>
        <div class="room_2">
          <el-card class="box-card" shadow="hover">
            教室2
          </el-card>
        </div>
        <div class="room_3">
          <el-card class="box-card" shadow="hover">
            教室3
          </el-card>
        </div>
        <div class="room_4">
          <el-card class="box-card" shadow="hover">
            教室4
          </el-card>
        </div>
        <div class="room_5">
          <el-card class="box-card" shadow="hover">
            教室5
          </el-card>
        </div>
        <div class="room_6">
          <el-card class="box-card" shadow="hover">
            教室6
          </el-card>
        </div>
        <!-- <div
          v-for="i in 20"
          :key="i"
          style="display: inline-block; margin: 5px"
        >
          <el-card class="box-card" shadow="hover" @click.native="handleClick">
            <p class="classStyle">{{ "教室 " + i }}</p>
            <p class="classStyle">{{ "预约中..." }}</p>
            <p class="classStyle">{{ "当前人数：xx" }}</p>
          </el-card>
        </div> -->
      </div>
    </div>
    <coursesTable />
    <!-- <timetables></timetables> -->
  </div>
</template>

<script>
import Timetables from "timetables";

export default {
  data() {
    return {
      item: {
        classHour: "first", // 课程数
        week: "", // 星期
        floor: "one", // 楼层
        dateTime: "", // 当前时间
      },
    };
  },

  created() {
    const timetables = [
      [
        "大学英语(Ⅳ)@10203",
        "大学英语(Ⅳ)@10203",
        "",
        "",
        "",
        "",
        "毛概@14208",
        "毛概@14208",
        "",
        "",
        "",
        "选修",
      ],
      [
        "",
        "",
        "信号与系统@11302",
        "信号与系统@11302",
        "模拟电子技术基础@16204",
        "模拟电子技术基础@16204",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "大学体育(Ⅳ)",
        "大学体育(Ⅳ)",
        "形势与政策(Ⅳ)@15208",
        "形势与政策(Ⅳ)@15208",
        "",
        "",
        "电路、信号与系统实验",
        "电路、信号与系统实验",
        "",
        "",
        "",
        "",
      ],
      [
        "",
        "",
        "",
        "",
        "电装实习@11301",
        "电装实习@11301",
        "",
        "",
        "",
        "大学体育",
        "大学体育",
        "",
      ],
      [
        "",
        "",
        "数据结构与算法分析",
        "数据结构与算法分析",
        "",
        "",
        "",
        "",
        "信号与系统",
        "信号与系统",
        "",
        "",
      ],
    ];
    const timetableType = [
      [{ index: "1", name: "8:30" }, 1],
      [{ index: "2", name: "9:30" }, 1],
      [{ index: "3", name: "10:30" }, 1],
      [{ index: "4", name: "11:30" }, 1],
      [{ index: "5", name: "12:30" }, 1],
      [{ index: "6", name: "14:30" }, 1],
      [{ index: "7", name: "15:30" }, 1],
      [{ index: "8", name: "16:30" }, 1],
      [{ index: "9", name: "17:30" }, 1],
      [{ index: "10", name: "18:30" }, 1],
      [{ index: "11", name: "19:30" }, 1],
      [{ index: "12", name: "20:30" }, 1],
    ];
    const week = ["周一", "周二", "周三", "周四", "周五"];
    const highlightWeek = new Date().getDay();
    const styles = {
      Gheight: 50,
      leftHandWidth: 50,
      palette: ["#ff6633", "#eeeeee"],
    };

    // 实例化(初始化课表)
    const timetable = new Timetables({
      el: "#coursesTable",
      timetables: timetables,
      week: week,
      timetableType: timetableType,
      highlightWeek: highlightWeek,
      gridOnClick: function (e) {
        alert(
          e.name +
            "  " +
            e.week +
            ", 第" +
            e.index +
            "节课, 课长" +
            e.length +
            "节"
        );
        console.log(e);
      },
      styles: styles,
    });

    this.getTime();
  },
  methods: {
    fetchData(tab, event) {
      console.log(tab, event);
    },
    // 预约
    handleOrder(id) {
      this.$confirm("确认预约该实验室吗？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
      })
        .then(() => {
          // 确认
          var that = this;
          orderApi.orderLab(id).then((response) => {
            // 提示信息
            this.$message({
              type: response.resultCode == 200 ? "success" : "error",
              message: response.message,
            });
            if (response.resultCode == 200) {
              // 删除成功 刷新列表
              that.fetchData(this.pageQuery);
            }
          });
        })
        .catch(() => {
          // 取消删除 不理会
        });
    },
    // 获取当前时间
    getTime() {
      // 课时
      var _this = this;
      const hh = new Date().getHours();
      const mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      const ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      _this.item.dateTime = hh + ":" + mf + ":" + ss;
      // 星期
      const wk = new Date().getDay();
      const weeks = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const week = weeks[wk];
      _this.item.week = week;
    },
  },
};
</script>

<style>
.rule-top {
}
.rule-top item {
  margin: 0 15px;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 121px;
  height: 65px;
  background: #f3f3f3;
  cursor: pointer;
}
.query-box {
  width: 80%;
  float: left;
}
.classStyle {
  margin: 0;
}
.room_background {
  background: url("../../../assets/floor_pic/1.jpg");
  margin-top: -100px;
  height: 800px;
  width: 85%;
  float: left;
}
.room_background .room_1 {
  height: 65px;
  width: 121px;
  margin-top: 148px;
  margin-left: 317px;
  display: inline-block;

}
.room_background .room_2 {
  height: 65px;
  width: 121px;
  margin-top: 148px;
  display: inline-block;
      margin-left: 5px;

}
.room_background .room_3 {
  height: 65px;
  width: 121px;
  margin-top: 148px;
  display: inline-block;
      margin-left: 5px;

}
.room_background .room_4 {
  height: 65px;
  width: 121px;
  margin-left: 317px;
 

}
.room_background .room_5 {
  height: 65px;
  width: 121px;
  margin-left: 350px;
 

}
.room_background .room_6 {
  height: 65px;
  width: 121px;
  margin-left: 450px;

}

</style>
