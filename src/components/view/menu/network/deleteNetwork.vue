<template>
  <div>
    <el-button size="mini" @click="beforeDelete()">删除网络</el-button>
    <el-dialog title="删除网络" :visible.sync="dialogVisible" width="400px">
      <template>
        确认删除该网络？
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteNetwork()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'deleteNetwork',
    data() {
      return {
        dialogVisible: false
      }
    },
    props: [
      'multipleSelection'
    ],
    methods: {
      beforeDelete() {
        this.dialogVisible = true
      },
      deleteNetwork() {
        this.dialogVisible = false
        let network_ids = []
        for(let mul of this.multipleSelection){
          network_ids.push(mul.id)
        }
        axios.post('/network/deleteNetwork', {
          network_id: network_ids
        })
        .then(()=>{
          this.$emit('updateView')
        })
      },
    }
  }
</script>

<style>

</style>