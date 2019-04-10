<template>
  <el-table :data="tableData" stripe style="width: 100%" v-loading='loading'>
    <el-table-column prop="binary" label="名称">
    </el-table-column>
    <el-table-column prop="host" label="主机">
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        {{ scope.row.state === 'up' ? '激活' : '已关闭' }}
      </template>
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        {{ scope.row.status === 'enabled' ? '启动' : '停止' }}
      </template>
    </el-table-column>
    <!-- <el-table-column prop="address" label="最近更新">
    </el-table-column> -->
  </el-table>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'storage',
    data() {
      return {
        tableData: [],
        loading: true
      }
    },
    mounted: function () {
      this.loading = true
      axios.get('/store/listservice')
        .then((res) => {
          this.loading = false
          this.tableData = res.data.serviceInfo
        })
    }
  }
</script>

<style>

</style>