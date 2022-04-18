<template>
  <div class="class-table">
    <div class="table-wrapper">
      <div class="tabel-container">
        <!-- 学生或老师有课表数据显示课表 -->
        <table v-if="courses!=null">
          <thead>
            <tr>
              <th>时间</th>
              <th
                v-for="(weekNum, weekIndex) in courses.length"
                :key="weekIndex"
              >
                {{ "周" + digital2Chinese(weekIndex + 1, "week") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(time, timeIndex) in courseTime" :key="timeIndex">
              <td>
                <p>{{ "第" + digital2Chinese(timeIndex + 1) + "节" }}</p>
                <p class="period">{{ time }}</p>
              </td>
              <td v-for="(c, ci) in courses" :key="ci">
                <div v-if="courses[ci][timeIndex] != null">
                  <p>{{ courses[ci][timeIndex].course.name }}</p>
                  <p>
                    {{courses[ci][timeIndex].periodStart}}-{{courses[ci][timeIndex].periodEnd}}周/ 
                    {{ courses[ci][timeIndex].classroom.address }}/
                    {{ courses[ci][timeIndex].course.leader }}/
                    {{
                      courses[ci][timeIndex].course.type == "1"
                        ? "考查课"
                        : "考试课"
                    }}/ {{ courses[ci][timeIndex].course.credit }}
                  </p>
                </div>
                <div v-else>{{  }}</div>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- 管理员或其他角色无课表数据时显示默认时间空课表 -->
        <table v-else>
          <thead>
            <tr>
              <th>时间</th>
              <th
                v-for="(weekNum, weekIndex) in 7"
                :key="weekIndex"
              >
                {{ "周" + digital2Chinese(weekIndex + 1, "week") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(time, timeIndex) in defaultTime" :key="timeIndex">
              <td>
                <p>{{ "第" + digital2Chinese(timeIndex + 1) + "节" }}</p>
                <p class="period">{{ time }}</p>
              </td>
              <td v-for="(c, ci) in 7" :key="ci">
                {{ "--" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getCourseTableByUser } from "@/api/system/course";
import courseApi from "@/api/system/course";

export default {
  name: "ClassTable",
  data() {
    return {
      defaultTime:[],
      courseTime: [],
      courses: [],
    };
  },
  created() {
    this.getCourseTable();
    this.getDefualtTime();
  },
  methods: {
    /**
     * 获取课程表数据
     */
    getCourseTable() {
      getCourseTableByUser().then((res) => {
        this.courseTime = res.data.courseTime;
        var courseList = res.data.courses;
        this.courses = courseList;
      });
    },
    /**
     * 获取默认时间
     */
    getDefualtTime(){
       courseApi.getDefaultTime().then((res)=>{
        const times = [];
        const defaultTimes = res.data.times;
        defaultTimes.forEach((i)=>{
          times.push(i.startTime+"-"+i.endTime);
        })
        this.defaultTime = times;
      })
    },

    /**
     * 数字转中文
     * @param {Number} num 需要转换的数字
     * @param {String} identifier 标识符
     * @returns {String} 转换后的中文
     */
    digital2Chinese(num, identifier) {
      const character = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
      ];
      return identifier === "week" && (num === 0 || num === 7)
        ? "日"
        : character[num];
    },
  },
};
</script>

<style lang="scss" scoped>
.class-table {
  .table-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .tabel-container {
    margin: 7px;

    table {
      table-layout: fixed;
      width: 100%;

      thead {
        background-color: #67a1ff;
        th {
          color: #fff;
          line-height: 17px;
          font-weight: normal;
        }
      }
      tbody {
        background-color: #eaf2ff;
        td {
          color: #677998;
          line-height: 12px;
        }
      }
      th,
      td {
        width: 60px;
        padding: 12px 2px;
        font-size: 12px;
        text-align: center;
      }

      tr td:first-child {
        color: #333;
        .period {
          font-size: 8px;
        }
      }
    }
  }
}
</style>
