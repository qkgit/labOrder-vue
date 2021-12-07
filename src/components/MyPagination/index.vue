<template>
  <el-pagination
    :total="page.total"
    :page-sizes="[10, 5, 20]"
    :current-page="page.pageNum"
    :page-size="page.pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    style="text-align: center"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
export default {
  name: 'MyPagination',
  props: {
    page: {
      type: Object,
      default: function() {
        return this.Page
      }
    },
    queryFun: [Function]
  },
  data() {
    return {
      // 分页
      Page: {
        total: 10, // 总记录数
        pageNum: 1, // 当前页,，默认第1页
        pageSize: 10 // 每页显示条数，10条
      }
    }
  },
  methods: {
    // 分页
    handleSizeChange(val) {
      // 当每页显示条数改变后 被触发
      this.page.pageSize = val
      queryFun
    },
    handleCurrentChange(val) {
      // 当页码改变后 被触发
      this.page.pageNum = val
      queryFun
    }
  }
}
</script>

<style>
</style>
