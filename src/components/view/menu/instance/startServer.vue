<template>
  <div class="startServer">
    <el-button size="mini" @click="dialogVisible = true">开启虚拟机</el-button>

    <el-dialog title="开启虚拟机" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>开启虚拟机</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="startServer()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'startServer',
    props: ['servers'],
    data() {
      return {
        dialogVisible: false
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      startServer() {
        let startServers = []
        for (let server of this.servers) {
          startServers.push(server.server_id)
        }

        this.dialogVisible = false
        axios.post('/api/startServer', {
          server_id: startServers
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