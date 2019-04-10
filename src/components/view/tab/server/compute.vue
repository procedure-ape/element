<template>
  <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
    <el-table-column prop="binary" label="名称">
    </el-table-column>
    <el-table-column prop="host" label="主机">
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        {{ scope.row.state | state }}
      </template>
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        {{ scope.row.status | status }}
      </template>
    </el-table-column>
    <!-- <el-table-column prop="address" label="最近更新">
    </el-table-column> -->
  </el-table>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'compute',
    data() {
      return {
        tableData: [],
        loading: true
      }
    },
    filters: {
      state(v){
        if(v == 'up'){
          return '启动'
        }else if(v == 'down'){
          return '已关闭'
        }else{
          return '未知'
        }
      },
      status(v){
        if(v == 'enabled'){
          return '激活'
        }else{
          return '已关闭'
        }
      },
    },
    mounted: function () {
      this.loading = true
      axios.get('/api/listService')
        .then((res) => {
          this.loading = false
          this.tableData = res.data.serviceInfo
        })
    }
  }
</script>

<style>

</style>