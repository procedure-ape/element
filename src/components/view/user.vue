<template>
  <div class="tableBox">
    <el-row class="right">
      <createUser @updateview="updView"></createUser>
      <deleteUser :multipleSelection="multipleSelection" @updateview="updView"></deleteUser>
    </el-row>
    <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" v-loading="table_loading" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="username" label="用户名">
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button size="mini" style="marggin">
              更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="delUserDialog(scope.row)">删除用户</el-dropdown-item>
              <el-dropdown-item @click.native="updUserDialog(scope.row)">修改用户</el-dropdown-item>
              <el-dropdown-item @click.native="updPasswordDialog(scope.row)">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div>

      <!-- 删除用户dialog -->
      <el-dialog title="删除用户" :visible.sync="del_user.dialog" width="300px">
        <el-form>
          确认删除用户？
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="del_user.dialog = false">取 消</el-button>
          <el-button type="primary" @click="deluser()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户dialog -->
      <el-dialog title="修改用户" :visible.sync="upd_user.dialog" width="300px">
        <el-form label-width="100px">
          <el-form-item label="用户名称">
            <el-input v-model="upd_user.username" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱">
            <el-input v-model="upd_user.email" size="mini"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="upd_user.dialog = false">取 消</el-button>
          <el-button type="primary" @click="upduser()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改密码dialog -->
      <el-dialog title="修改用户" :visible.sync="upd_password.dialog" width="350px" @close="resetForm('upd_password')">
        <el-form label-width="110px" :rules="rules1" :model="upd_password" ref="upd_password" class="demo-ruleForm">
          <el-form-item label="原密码" prop="checkOld">
            <el-input v-model="upd_password.old_password" size="mini" type="password"></el-input>
          </el-form-item>
          <el-form-item label="输入新密码" prop="checkNew">
            <el-input v-model="upd_password.new_password" size="mini" type="password"></el-input>
          </el-form-item>
          <el-form-item label="再次输入新密码" prop="checkAgain">
            <el-input v-model="upd_password.again_password" size="mini" type="password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="upd_password.dialog = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('upd_password')">确 定</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import createUser from './menu/user/create';
  import deleteUser from './menu/user/delete';

  export default {
    data() {
      var checkOldPass = (rule, value, callback) => {
        if (this.upd_password.old_password == '') {
          return callback(new Error('不能为空'))
        }
        return callback()
      }
      var checkNewPass = (rule, value, callback) => {
        if (this.upd_password.new_password == '') {
          return callback(new Error('不能为空'))
        }
        return callback()
      }
      var checkAgainPass = (rule, value, callback) => {
        if (this.upd_password.again_password == '') {
          return callback(new Error('不能为空'))
        } else if (this.upd_password.new_password != this.upd_password.again_password) {
          return callback(new Error('两次输入不一致'))
        }
        return callback()
      }

      return {
        tableData3: [],
        multipleSelection: [],
        table_loading: true,
        del_user: {
          dialog: false,
          user_id: '',
          username: '',
          password: '',
          department: '',
          size: 0,
        },
        serverInfo: [],
        upd_user: {
          dialog: false,
          user_id: '',
          username: '',
          password: '',
        },
        upd_password: {
          dialog: false,
          new_password: '',
          old_password: '',
          again_password: ''
        },
        add_server: {
          dialog: false
        },

        rules1: {
          checkOld: [{
            validator: checkOldPass,
            trigger: 'blur'
          }],
          checkNew: [{
            validator: checkNewPass,
            trigger: 'blur'
          }],
          checkAgain: [{
            validator: checkAgainPass,
            trigger: 'blur'
          }],

        }
      }
    },

    beforeCreate: function () {
      getListVolumes(this)
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$refs[formName].resetFields();
            this.upd_password.dialog = false
            axios.post('/login/updatepassword', {
                user_id: this.upd_password.user_id,
                new_password: this.upd_password.new_password,
                old_password: this.upd_password.old_password,
              })
              .then(() => {
                getListVolumes(this)
              })
          } else {
            return false;
          }
        })
      },
      resetForm(upd_password) {
        this.upd_password.dialog = false
        this.upd_password = {
          dialog: false,
          new_password: '',
          old_password: '',
          again_password: ''
        },
        this.$refs[upd_password].resetFields();
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      // 窗口
      delUserDialog(v) {
        this.del_user.dialog = true
        this.del_user.user_id = v.id
      },

      updUserDialog(v) {
        this.upd_user.dialog = true
        this.upd_user.user_id = v.id
        this.upd_user.username = v.username
        this.upd_user.password = v.password
        this.upd_user.department = v.department
        this.upd_user.size = v.size
      },

      updPasswordDialog(v) {
        this.upd_password.dialog = true
        this.upd_password.user_id = v.id
      },

      deluser() {
        this.del_user.dialog = false
        axios.post('/login/deluser', {
            user_id: this.del_user.user_id
          })
          .then(() => {
            getListVolumes(this)
          })
      },

      upduser() {
        this.upd_user.dialog = false
        axios.post('/login/updateuser', {
            user_id: this.upd_user.user_id,
            username: this.upd_user.username,
            email: this.upd_user.email,
            type_name: this.upd_user.type_name
          })
          .then(() => {
            getListVolumes(this)
          })
      },

      updView() {
        getListVolumes(this)
      },
      handleChange(v) {
        // 数字框变化
      }

    },
    components: {
      createUser,
      deleteUser
    },
  }

  function getListVolumes(vue) {
    axios.get('/login/listuser')
      .then((res) => {
        vue.tableData3 = res.data['userInfo']
        vue.table_loading = false
      })
  }
</script>


<style>

</style>