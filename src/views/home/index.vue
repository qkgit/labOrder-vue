<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="home-layout">
        <!-- 通知公告 -->
        <div class="layout-item">
          <el-card class="box-call">
            <div slot="header" class="clearfix">
              <span>通知公告</span>
              <!-- <el-button style="float: right; padding: 3px 0" type="text"
                >更多</el-button
              > -->
            </div>
            <ul>
              <li v-for="inform in informList" :key="inform.index" class="item">
                <a class="text" @click="toNewsDetil(inform.newsId)">
                  <span class="item_title" :title="inform.title">
                    {{ inform.title }}
                  </span>
                  <span style="float: right">{{
                    dateFormat(inform.releaseTime)
                  }}</span>
                </a>
              </li>
            </ul>
          </el-card>
        </div>
        <!-- 新闻中心 -->
        <!-- <div class="layout-item">
          <el-card class="box-call">
            <div slot="header" class="clearfix">
              <span>新闻中心</span>
               <el-button style="float: right; padding: 3px 0" type="text"
                >更多</el-button
              >
            </div>
            <ul>
              <li v-for="news in newsList" :key="news.index" class="item">
                <a
                  class="text"
                  @click="toNewsDetil(news.newsId)"
                  title="文章标题"
                >
                  <span class="item_title" :title="news.title">
                    {{ news.title }}
                  </span>
                  <span style="float: right">{{
                    dateFormat(news.releaseTime)
                  }}</span>
                </a>
              </li>
            </ul>
          </el-card>
        </div> -->
        <!-- 个人信息 -->
        <div class="layout-item">
          <el-card class="box-info">
            <div>
              <div style="height: 130px; width: 400px; float: left">
                <h2>欢迎访问实验室预约系统</h2>
                <h3>您好！{{ name }}</h3>
                <p>
                  <span style="margin: 0 5px">学院：{{ institute }}</span><span style="margin: 0 5px">专业：{{ major }}</span>
                </p>
              </div>
              <div
                style="
                  height: 120px;
                  width: 120px;
                  float: left;
                  margin: 5px 31px;
                "
              >
                <router-link to="/myCenter">
                  <el-image
                    style="width: 120px; height: 120px; border-radius: 10px;"
                    :src="avatar"
                    :fit="'fill'"
                  >
                    <div slot="error" class="image-slot">
                      <el-avatar shape="square" :size="120">{{
                        name
                      }}</el-avatar>
                    </div>
                  </el-image>
                </router-link>
              </div>
              <div style="width: 100%; display: inline-block">
                <el-divider>一言</el-divider>
                <div v-if="say.hitokoto === ''">
                  <p>正在加载...</p>
                </div>
                <div v-if="say.hitokoto != ''">
                  <p>{{ "「" + say.hitokoto + "」" }}</p>
                  <p style="float: right">
                    {{ "——" + say.from
                    }}<span v-if="say.from_who != null">{{
                      "." + say.from_who
                    }}</span>
                  </p>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <div class="home-layout">
        <!-- 实验室预约排行榜 -->
        <el-card class="box-list" style="width: 100% float: left">
          <div slot="header" class="clearfix">
            <span>实验室使用排行榜</span>
          </div>

          <el-table :data="labTop" stripe>
            <el-table-column type="index" label="排名" width="100" />
            <el-table-column prop="lname" label="实验室名称" />
            <el-table-column prop="laddress" label="实验室地址" />
            <el-table-column prop="allTime" label="累计开放天数">
              <template slot-scope="scope">
                <span>{{ scope.row.allTime }} 天 </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <!-- 实验预约排行榜
         <el-card class="box-list" style="float: right">
          <div slot="header" class="clearfix">
            <span>开放性实验</span>
            <el-button style="float: right; padding: 3px 0" type="text"
              >更多</el-button
            >
          </div>
          <el-table :data="tableData" stripe >
            <el-table-column prop="date" label="序号" >
            </el-table-column>
            <el-table-column prop="name" label="实验名称" >
            </el-table-column>
            <el-table-column prop="address" label="时长"> </el-table-column>
          </el-table>
        </el-card> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import newsApi from '@/api/news'
import labApi from '@/api/labs'
import moment from 'moment'
import axios from 'axios'

export default {
  name: 'Home',
  data() {
    return {
      labTop: [
        {
          ltId: '1',
          lname: '本科生创新实验室',
          address: 'G-235',
          allTime: '4526 天'
        },
        {
          ltId: '2',
          lname: '探测制导与信息对抗实验室',
          address: 'G-235',
          allTime: '1325 天'
        },
        {
          ltId: '3',
          lname: '电子信息实验室',
          address: 'B-119',
          allTime: '864 天'
        },
        {
          ltId: '4',
          lname: '雷达信号分析与处理实验室',
          address: 'G-502',
          allTime: '456 天'
        },
        {
          ltId: '5',
          lname: '学科实验室',
          address: 'D-557',
          allTime: '335 天'
        }
        // {
        //   ltId: "6",
        //   lname: "学科实验室",
        //   address: "D-556",
        //   allTime: "153 天",
        // },
      ],
      newsList: [],
      informList: [],
      say: {
        hitokoto: ''
      },
      image:
        'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
    }
  },
  computed: {
    ...mapGetters(['name', 'institute', 'major', 'avatar'])
  },
  created() {
    this.getNews()
    this.getLabsTop()
    this.getSomeSaying()
  },
  methods: {
    getNews() {
      newsApi.getHomeNews().then((response) => {
        this.informList = response.data
      })
      // newsApi.getHomeInForm().then((response) => {
      //   this.informList = response.data;
      // });
    },
    getLabsTop() {
      labApi.getLabsTop().then((response) => {
        this.labTop = response.data
      })
    },
    getSomeSaying() {
      axios.get('https://v1.hitokoto.cn/?encode=json').then((resp) => {
        this.say = resp.data
      })
    },
    toNewsDetil(newsId) {
      this.$router.push({path: `/newsDetail/${newsId}`})
    },
    // 时间格式化
    dateFormat(date) {
      if (date == undefined) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    background: #f3f3f3;
    margin-top: -20px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.text {
  font-size: 16px;
  cursor: pointer;
  color: #000;
  text-decoration: none;
}
.text:hover {
  color: #409eff;
}
.item {
  cursor: pointer;
  text-decoration: none;
  font-size: 16px;
  display: block;
  margin-bottom: 16px;
}
.item .item_title {
  line-height: 18px;
  width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
.media-item {
  margin-bottom: 30px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-call {
  margin-right: 10px;
  height: 288px;
}
.box-call ul {
  margin: 0;
  padding-left: 0;
}
.box-info {
  height: 288px;
}
.home-layout {
  display: inline-block;
  width: 100%;
  margin-top: 10px;
}
.layout-item {
  width: 50%;
  float: left;
}
.info-avatar {
  width: 110px;
  height: 110px;
  float: left;
  margin: 20px 10px 0px 5px;
}
</style>
