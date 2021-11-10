<template>
  <div class="container">
    <div>
      <el-row>
        <el-radio-group
          v-model="item.week"
          style="margin-bottom: 30px; margin-left: 5%"
          @tab-click="fetchData"
        >
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
          style="width: 730px; margin-left: 5%"
          @tab-click="fetchData"
        >
          <el-tab-pane label="第一节课" name="first"></el-tab-pane>
          <el-tab-pane label="第二节课" name="second"></el-tab-pane>
          <el-tab-pane label="第三节课" name="third"></el-tab-pane>
          <el-tab-pane label="第四节课" name="fourth"></el-tab-pane>
          <el-tab-pane label="第五节课" name="fifth"></el-tab-pane>
          <el-tab-pane label="第六节课" name="sixth"></el-tab-pane>
          <el-tab-pane label="第七节课" name="seventh"></el-tab-pane>
          <el-tab-pane label="第八节课" name="eighth"></el-tab-pane>
        </el-tabs>
      </el-row>
    </div>
    <div style="">
      <el-card shadow="never" style="width: 10%; float: right">
        <el-tabs
          tab-position="left"
          v-model="item.floor"
          @tab-click="fetchData"
          style="height: 180px"
        >
          <el-tab-pane label="四层" name="four"></el-tab-pane>
          <el-tab-pane label="三层" name="three"></el-tab-pane>
          <el-tab-pane label="二层" name="two"></el-tab-pane>
          <el-tab-pane label="一层" name="one"></el-tab-pane>
        </el-tabs>
      </el-card>

      <div style="margin: 20px; width: 85%; float: left">
        <div
          v-for="i in 20"
          :key="i"
          style="display: inline-block; margin: 5px"
        >
          <el-card class="box-card" shadow="hover" @click.native="handleClick">
            <p class="classStyle">{{ "教室 " + i }}</p>
            <p class="classStyle">{{ "预约中..." }}</p>
            <p class="classStyle">{{ "当前人数：xx" }}</p>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: {
        classHour: 'first',      // 课程数
        week: '',           // 星期
        floor: 'one',       // 楼层
        dateTime: '',       // 当前时间
      },
    };
  },
  created() {
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
        let hh = new Date().getHours();
        let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
        let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
        _this.item.dateTime = hh+':'+mf+':'+ss;
        // 星期
        let wk = new Date().getDay()
        let weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        let week = weeks[wk]
        _this.item.week = week
       
    }
  },
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 200px;
  height: 100px;
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
</style>