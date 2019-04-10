<template>
  <div>
    <el-button size="mini" @click="beforeCreate()">分配IP给项目</el-button>
    <el-dialog title="分配浮动IP" :visible.sync="dialogVisible" width="400px" @close="close('create')">
      <el-form label-width="120px" :model="create" :rules="rules" ref="create" class="demo-ruleForm">
        <el-form-item label="资源池" prop="floating_network_id">
          <el-select v-model="create.floating_network_id" placeholder="选择一个浮动IP池" size="mini">
            <el-option v-for="v of create.floating_networks" v-if="v.is_router_external" :label="v.name" :key="v.id"
              :value="v.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="create.description" size="mini" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createIP('create')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import rules from '@/components/rules/rules'

  export default {
    name: 'createStorage',
    components: {
      rules
    },
    computed: {
      rules: function () {
        return rules.rules
      }
    },
    data() {
      return {
        dialogVisible: false,
        create: {
          floating_networks: [],
          floating_network_id: '',
          description: ''
        }
      }
    },
    methods: {
      close(formName) {
        this.$refs[formName].resetFields()
      },
      beforeCreate() {
        this.dialogVisible = true
        axios.get('/network/listnetworks')
          .then((res) => {
            this.create.floating_networks = res.data.networkInfo
          })
      },
      createIP(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            axios.post('/network/createIP', {
                floating_network_id: this.create.floating_network_id,
                description: this.create.description
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