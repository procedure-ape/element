<template>
  <div>
    <el-button size="mini" @click="beforeCreate()">增加接口</el-button>
    <el-dialog title="增加接口" :visible.sync="dialogVisible" width="400px" @close="close('create')">
      <el-form label-width="120px" :model="create" :rules="rules" ref="create" class="demo-ruleForm">
        <el-form-item label="子网" prop="subnet_id">
          <el-select v-model="create.subnet_id" size='mini'>
            <el-option v-for="network of create.networkInfo" :key="network.subnet_id" :value="network.subnet_id"
              :label="network.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRouterInterface('create')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import rules from '@/components/rules/rules'

  export default {
    name: 'createRouterPort',
    data() {
      return {
        dialogVisible: false,
        create: {
          networkInfo: {}
        }
      }
    },
    props: [
      'routerID'
    ],
    components: {
      rules
    },
    computed: {
      rules: function () {
        return rules.rules
      }
    },
    methods: {
      close(formName) {
        this.$refs[formName].resetFields()
      },
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
        axios.get('/network/listnetworks')
          .then((res) => {
            let subnetPort = []
            for (let i of res.data.networkInfo) {
              let str = i.name
              for (let l of i.subnets_info) {
                subnetPort.push({
                  name: str + l.cidr + '(' + l.name + ')',
                  subnet_id: l.subnet_id
                })
              }
            }
            this.create.networkInfo = subnetPort
          })
      },
      addRouterInterface(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            axios.post('/network/addRouterInterface', {
                router_id: this.routerID.id,
                subnet_id: this.create.subnet_id,
              })
              .then(() => {
                this.$emit('updateView')
              })
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<style>

</style>