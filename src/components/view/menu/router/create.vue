<template>
  <div>
    <el-button size="mini" @click="beforeCreate()">新建路由</el-button>
    <el-dialog title="新建路由" :visible.sync="dialogVisible" width="400px">
      <el-form label-width="120px">
        <el-form-item label="路由名称">
          <el-input v-model="create.router_name" size="mini" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="启用管理员状态">
          <el-switch v-model="create.admin_state_up" active-text="共有" inactive-text="私有"></el-switch>
        </el-form-item>
        <el-form-item label="外部网络" v-model="create.network_id">
          <el-select v-model="create.network_id" placeholder="选择网络" size="mini">
            <el-option v-for="networkInfo of create.networkInfo" :key="networkInfo.id" v-if="networkInfo.is_router_external"
            :value="networkInfo.id" :label="networkInfo.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createRouters()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'createStorage',
    data() {
      return {
        dialogVisible: false,
        create: {
          router_name: '',
          admin_state_up: true,
          description: '',
          network_id: "",
          networkInfo: []
        }
      }
    },
    methods: {
      beforeCreate(){
        this.dialogVisible = true
        axios.get('/network/listnetworks')
        .then((res)=>{
          this.create.networkInfo = res.data.networkInfo
        })
      },
      createRouters(){
        this.dialogVisible = false
        // console.log(this.create)
        axios.post('/network/createRouter',{
          router_name: this.create.router_name,
          network_id: this.create.network_id,
          admin_state_up: this.create.admin_state_up,
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
