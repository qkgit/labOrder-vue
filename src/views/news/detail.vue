<template>
  <div class="container">
    <el-card>
      <el-page-header :content="this.new.title" @back="goBack" />
      <div class="contentbox">
        <h2 class="contenttitle">{{ this.new.title }}</h2>
        <p class="contentinf">
          发布时间:{{ dateFormat(this.new.releaseTime) }}
        </p>
        <el-divider />
        <div class="news-content" v-html="this.new.content" />
      </div>
    </el-card>
  </div>
</template>

<script>
import newsApi from '@/api/news'
import moment from 'moment'

export default {
  components: {},
  data() {
    return {
      new: {
        title: '',
        releaseTime: '',
        content: ''
      },
      id: ''
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.newsId;
    newsApi.getNewsDetail(this.id).then((response) => {
      this.new = response.data
    })
  },
  methods: {
    dateFormat(date) {
      if (date == undefined) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD')
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.contenttitle {
  text-align: center;
  color: #0a1121;
  margin-top: 60px;
}
.news-content {
  /* border: 1px dotted #3ba86f; */
  min-height: 500px;
  margin: 0px 40px 70px;
}
</style>
