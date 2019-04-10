<template>
  <div>
    <el-button size="mini" @click="beforeDelete()">删除安全组</el-button>
    <el-dialog title="删除安全组" :visible.sync="dialogVisible" width="400px">
      确认删除安全组
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteSgroups()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'deletesecurityGroups',
    props: [
      'multipleSelection'
    ],
    data() {
      return {
        dialogVisible: false
      }
    },
    methods: {
      beforeDelete() {
        this.dialogVisible = true
      },
      handleClose(done) {

      },
      deleteSgroups() {
        let vols = []
        this.dialogVisible = false
        for (let vol of this.multipleSelection) {
          vols.push(vol.security_group_id)
        }
        axios.post('/network/deleteSgroup', {
          security_groups_id: vols
        })
        .then(()=>{
          this.$emit('updateView')
        })
      }
    }
  }
</script>

<style>

</style>