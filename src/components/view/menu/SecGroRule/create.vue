<template>
  <div>
    <el-button size="mini" @click="beforeCreate()">添加规则</el-button>
    <el-dialog title="添加规则" :visible.sync="dialogVisible" width="400px">
      <el-form label-width="120px">
        <el-form-item label="protocol">
          <el-input v-model="create.protocol" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="ethertype">
          <el-input v-model="create.ethertype" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="方向">
          <el-switch v-model="create.direction" active-text="入口" inactive-text="出口"></el-switch>
        </el-form-item>
        <el-form-item label="port_range_max">
          <el-input v-model="create.port_range_max" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="port_range_min">
          <el-input v-model="create.port_range_min" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="remote_ip_prefix">
          <el-input v-model="create.remote_ip_prefix" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="remote_group_id">
          <el-input v-model="create.remote_group_id" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="romte">
          <el-input v-model="create.romte" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="creates()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import webuploader from '../../webuploader/webuploader'

  export default {
    name: 'createSecurityGroups',
    data() {
      return {
        dialogVisible: false,
        create: {
          protocol: '',
          ethertype: '',
          direction: '',
          port_range_max: 1,
          port_range_min: 1,
          remote_ip_prefix: '',
          remote_group_id: '',
          romte: '',
        }
      }
    },
    components: {
      webuploader
    },

    props: [
      'securityGroupId'
    ],

    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      handleChange(value) {

      },
      beforeCreate() {
        this.dialogVisible = true
      },
      creates(){
        axios.post('/network/createSecGroRules',{
          security_group_id: this.securityGroupId,
          protocol: this.create.protocol,
          ethertype: this.create.ethertype,
          direction: this.create.direction ? 'ingress' : 'egress',
          port_range_max: this.create.port_range_max,
          port_range_min: this.create.port_range_min,
          remote_ip_prefix: this.create.remote_ip_prefix,
          remote_group_id: this.create.remote_group_id,
          romte: this.create.romte,
        })
        .then(()=>{
          this.$emit('updateView')
        })
        this.dialogVisible = false
      },

    }
  }
</script>

<style>
  #filePicker input {
    display: none;
  }

  #filePicker {
    height: 40px;
  }

  #filename {
    z-index: 0;
  }
</style>