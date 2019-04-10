<template>
  <div class="deleteServer">
    <el-button size="mini" @click="dialogVisible = true">删除虚拟机</el-button>

    <el-dialog title="删除虚拟机" :visible.sync="dialogVisible" width="30%">
      <span>确认删除虚拟机</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteServer()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'deleteServer',
    props: ['servers'],
    data() {
      return {
        dialogVisible: false
      };
    },
    methods: {
      deleteServer() {
        let deleteServers = []
        for (let server of this.servers) {
          deleteServers.push(server.server_id)
        }

        this.dialogVisible = false

        axios.post('/api/deleteServer', {
          server_id: deleteServers
        })
        .then(()=>{
          this.$emit('updateView')
        })
      }
    }
  }
</script>

<style scoped>

</style>