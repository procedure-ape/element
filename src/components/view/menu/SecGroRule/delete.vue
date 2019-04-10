<template>
  <div>
    <el-button size="mini" @click="beforeDelete()">删除规则</el-button>
    <el-dialog title="删除规则" :visible.sync="dialogVisible" width="400px">
      确认删除规则
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
          vols.push(vol.id)
        }
        axios.post('/network/deleteSecGroRules', {
          security_group_rule_id: vols
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