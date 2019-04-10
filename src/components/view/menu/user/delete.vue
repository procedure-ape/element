<template>
  <div>
    <el-button size="mini" @click="beforeCreate()">删除用户</el-button>
    <el-dialog title="创建用户" :visible.sync="dialogVisible" width="400px" :before-close="handleClose">
      确认删除用户？
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="del()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'deleteUser',
    props: [
      'multipleSelection'
    ],
    data() {
      return {
        dialogVisible: false
      }
    },
    methods: {
      beforeCreate() {
        this.dialogVisible = true
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      del() {
        let users = []
        this.dialogVisible = false
        for (let v of this.multipleSelection) {
          users.push(v.id)
        }
        axios.post('/login/deluser', {
          user_id: users
        })
        .then(()=>{
          this.$emit('updateview')
        })
      }
    }
  }
</script>

<style>

</style>