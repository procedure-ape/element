<template>
  <div class="tableBox">
    <el-row class="right">
      <deleteFloat :multipleSelection="multipleSelection" @updateView="updateView()"></deleteFloat>
      <createFloat @updateView="updateView()"></createFloat>
    </el-row>
    <el-table ref="multipleTable" :data="tableData3" v-loading="table_loading" tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="floating_ip_address" label="IP地址">
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column prop="fixed_ip_address" label="已映射固定IP">
      </el-table-column>
      <el-table-column prop="network_name" label="资源池">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status | routerStatus }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="210px">
        <template slot-scope="scope">
          <el-button size="mini" v-if="scope.row.status !== 'ACTIVE'"
            @click="addFloatIpDialog(scope.$index, scope.row)">关联</el-button>
          <el-button size="mini" v-else @click="removeFloatIpDialog(scope.$index, scope.row)">解除绑定</el-button>
          <el-button size="mini" type="danger" @click="deleteIPDialog(scope.$index, scope.row)">释放浮动IP</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <!-- 关联 dialog -->
      <el-dialog title="管理浮动IP的关联" :visible.sync="addFloatIp.dialog" width="400px" @close="close('addFloatIp')">
        <el-form label-width="120px" :model="addFloatIp" :rules="rules" ref="addFloatIp" class="demo-ruleForm">
          <!-- <el-form-item label="IP地址" size='mini'>
            <el-select v-model="addFloatIp.ip" size='mini'>
              <el-option v-for="vol in addFloatIp.ips" :key="vol.value" :label="vol.lable" :value="vol.value"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="待连接的端口" size="mini" prop="server_id">
            <el-select v-model="addFloatIp.server_id" size="mini">
              <el-option v-for="v in addFloatIp.ports" :key="v.server_id" :value="v.server_id" :label="v.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addFloatIp.dialog = false">取 消</el-button>
          <el-button type="primary" @click="addFloatIps('addFloatIp')">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 解除绑定 dialog -->
      <el-dialog title="解除绑定" :visible.sync="removeFloatIp.dialog" width="400px">
        <el-form>
          确认解除绑定？
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="removeFloatIp.dialog = false">取 消</el-button>
          <el-button type="primary" @click="removeFloatIps()" v-loading="removeFloatIp.loading">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 释放浮动IP dialog -->
      <el-dialog title="删除配置" :visible.sync="deleteIP.dialog" width="400px">
        <el-form>
          确认释放该浮动IP？
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteIP.dialog = false">取 消</el-button>
          <el-button type="primary" @click="deleteIPs()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import createFloat from './menu/floatIP/create'
  import deleteFloat from './menu/floatIP/delete'
  import axios from 'axios'
  import rules from '@/components/rules/rules'

  export default {
    data() {
      return {
        tableData3: [],
        multipleSelection: [],
        addFloatIp: {
          dialog: false,
          ips: [],
          ip: '',
          ports: [],
          port: '',
          loading: true
        },
        removeFloatIp: {
          dialog: false,
          loading: true
        },
        deleteIP: {
          dialog: false
        },
        table_loading: true,
      }
    },
    computed: {
      rules: function () {
        return rules.rules
      }
    },
    mounted: function () {
      this.updateView(this)
    },
    filters: {
      routerStatus(status) {
        switch (status) {
          case 'ACTIVE':
            return '运行中'
            break
        }
      },
    },
    methods: {
      close(formName) {
        this.$refs[formName].resetFields()
      },
      // 关联
      addFloatIpDialog(index, row) {
        this.addFloatIp.dialog = true
        this.addFloatIp.loading = true
        this.addFloatIp.address = row.floating_ip_address
        let addFloatIpPorts = []
        axios.get('/network/listfloatport')
          .then((res) => {
            for (let i in res.data.floatPortInfo) {
              let v = res.data.floatPortInfo[i]
              for (let j in v.address) {
                for (let k of v.address[j]) {
                  if (k['OS-EXT-IPS:type'] == 'fixed') {
                    addFloatIpPorts.push({
                      name: v.server_name + ':' + k.addr,
                      server_id: v.server_id
                    })
                  }
                }
              }
            }
            this.addFloatIp.ports = addFloatIpPorts
            this.addFloatIp.loading = false
          })
      },
      addFloatIps(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addFloatIp.dialog = false
            axios.post('/api/addFloatIp', {
                server_id: this.addFloatIp.server_id,
                address: this.addFloatIp.address
              })
              .then(() => {
                this.updateView()
              })
          } else {
            return false;
          }
        });

      },

      // 解除绑定
      removeFloatIpDialog(index, row) {
        this.removeFloatIp.dialog = true
        this.removeFloatIp.loading = true
        this.removeFloatIp.address = row.floating_ip_address
        axios.get('/network/listfloatport')
          .then((res) => {
            for (let i of res.data.floatPortInfo) {
              for (let l in i.address) {
                for (let k of i.address[l]) {
                  if (k.addr == this.removeFloatIp.address) {
                    this.removeFloatIp.server_id = i.server_id
                  }
                }
              }
            }
            this.removeFloatIp.loading = false
          })
      },
      removeFloatIps() {
        this.removeFloatIp.dialog = false
        axios.post('/api/removeFloatIp', {
            server_id: this.removeFloatIp.server_id,
            address: this.removeFloatIp.address
          })
          .then(() => {
            this.updateView()
          })
      },

      // 释放浮动IP
      deleteIPDialog(index, row) {
        this.deleteIP.id = row.id
        this.deleteIP.dialog = true
      },
      deleteIPs() {
        this.deleteIP.dialog = false
        axios.post('/network/deleteIP', {
            floating_ip: this.deleteIP.id
          })
          .then(() => {
            this.updateView()
          })
      },


      updateView() {
        axios.get('/network/listips')
          .then((res) => {
            this.tableData3 = res.data.ipInfo
            this.table_loading = false
          })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

    },
    components: {
      createFloat,
      deleteFloat,
      rules
    }
  }
</script>

<style scoped>

</style>