<template>
  <div>
    <!--表格-->
    <el-table :data="timeData" stripe style="width: 100%">
      <el-table-column label="周" prop="label" align="center"></el-table-column>

      <el-table-column label="上午" align="center">
        <el-table-column
          v-for="(v, i) in titleData"
          :key="i"
          v-if="v.label === '上午'"
          align="center"
        >
          <template slot="header" slot-scope="scope">
            <div class="tabletitle-timeline">
              第{{ v.count }}节 <br />
              {{ v.startTime }}-{{ v.endTime }}
            </div>
          </template>
          <template slot-scope="scope">
            <div>
              <div v-if="timeShow">
                {{ scope.row[sbjectKey[i]] }}<br />
                {{ scope.row[teacherKey[i]] }}
              </div>
              <div v-else>
                <el-input
                  size="mini"
                  placeholder="科目"
                  suffix-icon="el-icon-date"
                  v-model="scope.row[sbjectKey[i]]"
                >
                </el-input>
                <el-select
                  clearable
                  v-model="scope.row[teacherKey[i]]"
                  size="mini"
                  placeholder="任课老师"
                >
                  <el-option
                    v-for="(val, ind) in teachers"
                    :key="ind"
                    :label="val.teacherName"
                    :value="val.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="下午" align="center">
        <el-table-column
          v-for="(v, i) in titleData"
          :key="i"
          v-if="v.label === '下午'"
          align="center"
        >
          <template slot="header" slot-scope="scope">
            <div class="tabletitle-timeline">
              第{{ v.count }}节 <br />
              {{ v.startTime }}-{{ v.endTime }}
            </div>
          </template>
          <template slot-scope="scope">
            <div>
              <div v-if="timeShow">
                {{ scope.row[sbjectKey[i]] }}<br />
                {{ scope.row[teacherKey[i]] }}
              </div>
              <div v-else>
                <el-input
                  size="mini"
                  placeholder="科目"
                  suffix-icon="el-icon-date"
                  v-model="scope.row[sbjectKey[i]]"
                >
                </el-input>
                <el-select
                  clearable
                  v-model="scope.row[teacherKey[i]]"
                  size="mini"
                  placeholder="任课老师"
                >
                  <el-option
                    v-for="(val, ind) in teachers"
                    :key="ind"
                    :label="val.teacherName"
                    :value="val.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="晚上" align="center">
        <el-table-column
          v-for="(v, i) in titleData"
          :key="i"
          v-if="v.label === '晚上'"
          align="center"
        >
          <template slot="header" slot-scope="scope">
            <div class="tabletitle-timeline">
              第{{ v.count }}节 <br />
              {{ v.startTime }}-{{ v.endTime }}
            </div>
          </template>
          <template slot-scope="scope">
            <div>
              <div v-if="timeShow">
                {{ scope.row[sbjectKey[i]] }}<br />
                {{ scope.row[teacherKey[i]] }}
              </div>
              <div v-else>
                <el-input
                  size="mini"
                  placeholder="科目"
                  suffix-icon="el-icon-date"
                  v-model="scope.row[sbjectKey[i]]"
                >
                </el-input>
                <el-select
                  clearable
                  v-model="scope.row[teacherKey[i]]"
                  size="mini"
                  placeholder="任课老师"
                >
                  <el-option
                    v-for="(val, ind) in teachers"
                    :key="ind"
                    :label="val.teacherName"
                    :value="val.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeShow: true, //编辑表与展示表
      teachers: [], //全部教师

      sbjectKey: [
        "oneS",
        "twoS",
        "threeS",
        "fourS",
        "fiveS",
        "sixS",
        "sevenS",
        "eightS",
        "nineS",
      ], //科目key值
      teacherKey: [
        "oneT",
        "twoT",
        "threeT",
        "fourT",
        "fiveT",
        "sixT",
        "sevenT",
        "eightT",
        "nineT",
      ], //老师key值
      //每天的课表
      timeData: [
        {
          id: "1",
          label: "周一",
          oneS: "java教程1",
          oneT: "郑老师",
          twoS: "语文",
          twoT: "张老师",
          threeS: "心理辅导",
          threeT: "杨老师",
          fourS: "音乐",
          fourT: "巩老师",
          fiveS: "网络",
          fiveT: "征老师",
          sixS: "舞蹈",
          sixT: "程老师",
          sevenS: "ppt教程",
          sevenT: "翟老师",
          eightS: "职业规划",
          eightT: "郝老师",
          nineS: "就业指导",
          nineT: "曹老师",
        },
        {
          id: "2",
          label: "周二",
          oneS: "java教程2",
          oneT: "郑老师",
          twoS: "语文",
          twoT: "张老师",
          threeS: "心理辅导",
          threeT: "杨老师",
          fourS: "音乐",
          fourT: "巩老师",
          fiveS: "网络",
          fiveT: "征老师",
          sixS: "舞蹈",
          sixT: "程老师",
          sevenS: "ppt教程",
          sevenT: "翟老师",
          eightS: "职业规划",
          eightT: "郝老师",
          nineS: "就业指导",
          nineT: "曹老师",
        },
        {
          id: "3",
          label: "周三",
          oneS: "java教程3",
          oneT: "郑老师",
          twoS: "语文",
          twoT: "张老师",
          threeS: "心理辅导",
          threeT: "杨老师",
          fourS: "音乐",
          fourT: "巩老师",
          fiveS: "网络",
          fiveT: "征老师",
          sixS: "舞蹈",
          sixT: "程老师",
          sevenS: "ppt教程",
          sevenT: "翟老师",
          eightS: "职业规划",
          eightT: "郝老师",
          nineS: "就业指导",
          nineT: "曹老师",
        },
        {
          id: "4",
          label: "周四",
          oneS: "java教程",
          oneT: "郑老师",
          twoS: "语文",
          twoT: "张老师",
          threeS: "心理辅导",
          threeT: "杨老师",
          fourS: "音乐",
          fourT: "巩老师",
          fiveS: "网络",
          fiveT: "征老师",
          sixS: "舞蹈",
          sixT: "程老师",
          sevenS: "ppt教程",
          sevenT: "翟老师",
          eightS: "职业规划",
          eightT: "郝老师",
          nineS: "就业指导",
          nineT: "曹老师",
        },
        {
          id: "5",
          label: "周五",
          oneS: "java教程",
          oneT: "郑老师",
          twoS: "语文",
          twoT: "张老师",
          threeS: "心理辅导",
          threeT: "杨老师",
          fourS: "音乐",
          fourT: "巩老师",
          fiveS: "网络",
          fiveT: "征老师",
          sixS: "舞蹈",
          sixT: "程老师",
          sevenS: "ppt教程",
          sevenT: "翟老师",
          eightS: "职业规划",
          eightT: "郝老师",
          nineS: "就业指导",
          nineT: "曹老师",
        },
        {
          id: "",
          label: "周六",
        },
        {
          id: "",
          label: "周天",
        },
      ],
      //课节数据---标题
      titleData: [
        {
          id: "1",
          count: 1,
          label: "上午",
          startTime: "08:00",
          endTime: "08:30",
        },
        {
          id: "2",
          count: 2,
          label: "上午",
          startTime: "09:00",
          endTime: "09:30",
        },
        {
          id: "3",
          count: 3,
          label: "下午",
          startTime: "12:05",
          endTime: "12:35",
        },
        {
          id: "4",
          count: 4,
          label: "下午",
          startTime: "14:00",
          endTime: "14:30",
        },
        {
          id: "5",
          count: 5,
          label: "下午",
          startTime: "16:00",
          endTime: "16:30",
        },
        {
          id: "6",
          count: 6,
          label: "下午",
          startTime: "17:00",
          endTime: "17:30",
        },
        {
          id: "7",
          count: 7,
          label: "晚上",
          startTime: "19:00",
          endTime: "19:30",
        },
        {
          id: "8",
          count: 8,
          label: "晚上",
          startTime: "20:00",
          endTime: "20:30",
        },
        {
          id: "9",
          count: 9,
          label: "晚上",
          startTime: "21:00",
          endTime: "21:30",
        },
      ],
    };
  },

  components: {},

  methods: {},
};
</script>

<style scoped>
.tabletitle-timeline {
  line-height: 18px !important;
}
</style>