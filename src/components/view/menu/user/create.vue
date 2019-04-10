<template>
  <div>
    <el-button size="mini" @click="beforeCreate()">创建用户</el-button>
    <el-dialog title="创建用户" :visible.sync="dialogVisible" width="400px" @close="handleClose('createUser')">
      <el-form label-width="120px" :model="user" :rules="rules" ref="createUser" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" size="mini" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input type="password" v-model="user.password" size="mini" placeholder="请输入用户密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email" size="mini" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="create('createUser')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import rules from '../../../rules/rules'

  export default {
    name: 'createUser',
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
        user: {
          username: '',
          email: '',
          password: '',
        }
      }
    },
    methods: {
      handleClose(formName) {
        this.$refs[formName].resetFields()
      },
      handleChange(value) {

      },
      beforeCreate() {
        this.dialogVisible = true
      },
      create(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            axios.post('/login/createuser', {
                username: this.user.username,
                email: this.user.email,
                password: this.user.password,
              })
              .then(() => {
                this.user = {
                  username: '',
                  email: '',
                  password: '',
                }
                this.$emit('updateview')
              })
          } else {
            return false
          }
        });
      }
    }
  }
</script>

<style>

</style>