<template>
  <el-table :data="tableData" stripe style="width: 100%" v-loading>
    <el-table-column prop="agent_type" label="类型">
    </el-table-column>
    <el-table-column prop="binary" label="名称">
    </el-table-column>
    <el-table-column prop="host" label="主机">
    </el-table-column>
    <el-table-column prop="alive" label="状态">
      <template slot-scope="scope">
        {{ scope.row.alive ? '激活' : '已关闭' }}
      </template>
    </el-table-column>
    <!-- <el-table-column label="可用区域">
      <template slot-scope="scope">
        {{ scope.row.availability_zone ? scope.row.availability_zone : '-' }}
      </template>
    </el-table-column> -->
    <!-- <el-table-column prop="address" label="状态">
    </el-table-column>
    <el-table-column prop="address" label="状态">
    </el-table-column> -->
    <!-- <el-table-column prop="address" label="最近更新">
    </el-table-column> -->
  </el-table>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'network',
    data() {
      return {
        tableData: [],
        loading: true
      }
    },
    mounted: function () {
      this.loading = true
      axios.get('/network/listagents')
        .then((res) => {
          this.loading = false
          this.tableData = res.data.agentInfo
        })
    }
  }
</script>

<style>

</style>