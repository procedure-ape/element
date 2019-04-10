<template>
  <div class="softreboot">
    <el-button size="mini" @click="dialogVisible = true">重启虚拟机</el-button>

    <el-dialog title="重启虚拟机" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>重启虚拟机？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="softreboot()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'softreboot',
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
      softreboot() {
        let softreboots = []
        for (let server of this.servers) {
          softreboots.push(server.server_id)
        }

        this.dialogVisible = false

        axios.post('/api/softReboot', {
          server_id: softreboots
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