<template>
  <div class="tableBox">
    <!-- 路由 -->
    <div v-show="tab">
      <el-row class="right">
        <deleteRouter :multipleSelection="multipleSelection" @updateView="updateView()"></deleteRouter>
        <createRouter @updateView="updateView()"></createRouter>
      </el-row>
      <el-table ref="multipleTable" :data="tableData3" v-loading="table_loading" tooltip-effect="dark"
        style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <el-button type="text" @click="handleTab(scope.row)">{{ scope.row | name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | routerStatus }}
          </template>
        </el-table-column>
        <el-table-column prop="network_name" label="外部网络">
        </el-table-column>
        <el-table-column label="管理状态">
          <template slot-scope="scope">
            {{ scope.row.status | routerStatus }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160px">
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.external_gateway_info === 'None'"
              @click="addRouterGatewayDialog(scope.$index, scope.row)">设置网关</el-button>
            <el-button size="mini" v-else @click="removeRouterGatewayDialog(scope.$index, scope.row)">清除网关</el-button>
            <el-dropdown trigger="click">
              <el-button size="mini" class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="updateRouterDialog(scope.$index, scope.row)">编辑路由</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="deleteRouterDialog(scope.$index, scope.row)">删除路由</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 路由详情 -->
    <div v-show="!tab">
      <el-row class="right">
        <!-- <deleteRouterPort :multipleSelection="multipleSelection" :RouterPort="RouterPort" @updateView="updateView()"></deleteRouterPort> -->
        <createRouterPort @updateView="updateView()" :routerID="removeRouterInterface.router"></createRouterPort>
        <div style="flex-grow: 1;">
          <el-button icon="el-icon-arrow-left" size="mini" style="margin-bottom: 5px;margin-left: 0"
            @click="updateView()"></el-button>
        </div>
      </el-row>
      <el-table ref="multipleTable" :data="Router.list" tooltip-effect="dark" style="width: 100%"
        v-loading="Router.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <div>{{ scope.row.port_id | routerPortName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="固定IP">
          <template slot-scope="scope">
            <div v-for="ip of scope.row.fixed_ips" :key="ip.subnet_id">{{ ip.ip_address }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | routerStatus }}
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <div>{{ scope.row.device_owner === 'network:router_interface' ? '内部接口' : '外部接口' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="管理状态">
          <template slot-scope="scope">
            <div>{{ scope.row.admin_state_up ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160px">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="removeRouterInterfaceDialog(scope.$index, scope.row)">删除接口
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <!-- 设置网关 dialog -->
      <el-dialog title="设置网关" :visible.sync="addRouterGateway.dialog" width="400px" @close="close('addRouterGateway')">
        <el-form label-width="100px" :model="addRouterGateway" :rules="rules" ref="addRouterGateway"
          class="demo-ruleForm">
          <el-form-item label="外部网络" size='mini' prop="network_id">
            <el-select v-model="addRouterGateway.network_id" placeholder="选择网络">
              <el-option v-for="v of networkInfo" :key="v.id" v-if="v.is_router_external" :value="v.id" :label="v.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用SNAT">
            <el-checkbox :value="addRouterGateway.snat"></el-checkbox>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addRouterGateway.dialog = false">取 消</el-button>
          <el-button type="primary" @click="addRouterGateways('addRouterGateway')" v-loading="addRouterGateway.loading">
            确 定</el-button>
        </span>
      </el-dialog>

      <!-- 清除网关 dialog -->
      <el-dialog title="删除配置" :visible.sync="removeRouterGateway.dialog" width="400px">
        <el-form>
          确认清除网关？
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="removeRouterGateway.dialog = false">取 消</el-button>
          <el-button type="primary" @click="removeRouterGateways()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑路由 dialog -->
      <el-dialog title="管理浮动IP的关联" :visible.sync="updateRouter.dialog" width="400px">
        <el-form label-width="120px">
          <el-form-item label="路由名称">
            <el-input v-model="updateRouter.name" size="mini" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="启用管理员状态">
            <el-checkbox :value="updateRouter.admin_state_up"></el-checkbox>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="updateRouter.dialog = false">取 消</el-button>
          <el-button type="primary" @click="updateRouters()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 删除路由 dialog -->
      <el-dialog title="删除配置" :visible.sync="deleteRouter.dialog" width="400px">
        <el-form>
          确认释放该浮动IP？
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteRouter.dialog = false">取 消</el-button>
          <el-button type="primary" @click="deleteRouters()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 删除路由接口 dialog -->
      <el-dialog title="删除路由接口" :visible.sync="removeRouterInterface.dialog" width="400px">
        <el-form>
          确认删除接口？
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="removeRouterInterface.dialog = false">取 消</el-button>
          <el-button type="primary" @click="removeRouterInterfaces()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import createRouter from './menu/router/create'
  import deleteRouter from './menu/router/delete'
  import createRouterPort from './menu/RouterPort/createRouterPort'
  import deleteRouterPort from './menu/RouterPort/deleteRouterPort'
  import axios from 'axios'
  import rules from '@/components/rules/rules'

  export default {
    data() {
      return {
        tableData3: [],
        multipleSelection: [],
        addRouterGateway: {
          dialog: false,
          snat: true
        },
        removeRouterGateway: {
          dialog: false
        },
        updateRouter: {
          name: '',
          dialog: false,
          admin_state_up: true
        },
        deleteRouter: {
          dialog: false
        },
        deleteIP: {

        },
        table_loading: true,
        networkInfo: {},
        tab: true,
        Router: {
          loading: true,
          list: []
        },
        removeRouterInterface: {
          dialog: false
        },
        RouterPort: {
          multipleSelection: []
        }
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
      routerPortName(name) {
        let n = name.split('-')
        return n[0]
      },
      name(value){
        if(!value.name){
          let names = value.id.split('-')
          return names[0] + '-' + names[1]
        }
        return value.name
      }
    },
    methods: {
      close(formName) {
        this.$refs[formName].resetFields()
      },

      // 设置网关
      addRouterGatewayDialog(index, row) {
        this.addRouterGateway.networkInfo = {}
        this.addRouterGateway.router_id = row.id
        this.addRouterGateway.loading = true
        axios.get('/network/listnetworks')
          .then((res) => {
            this.networkInfo = res.data.networkInfo
            this.addRouterGateway.loading = false
          })
        this.addRouterGateway.dialog = true
      },
      addRouterGateways(formName) {
        for (let i of this.networkInfo) {
          if (this.addRouterGateway.network_id == i.id) {
            this.addRouterGateway.subnet_id = i.subnets_info[0].subnet_id
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addRouterGateway.dialog = false
            axios.post('/network/addRouterGateway', {
                router_id: this.addRouterGateway.router_id,
                network_id: this.addRouterGateway.network_id,
                snat: this.addRouterGateway.snat,
                subnet_id: this.addRouterGateway.subnet_id
              })
              .then(() => {
                this.updateView()
              })
          } else {
            return false;
          }
        });

      },

      // 清除网关
      removeRouterGatewayDialog(index, row) {
        this.removeRouterGateway.router_id = row.id
        this.removeRouterGateway.network_id = row.external_gateway_info.network_id
        this.removeRouterGateway.ip_address = row.external_gateway_info.external_fixed_ips[0].ip_address
        this.removeRouterGateway.subnet_id = row.external_gateway_info.external_fixed_ips[0].subnet_id
        this.removeRouterGateway.dialog = true
      },
      removeRouterGateways() {
        this.removeRouterGateway.dialog = false
        axios.post('/network/removeRouterGateway', {
            router_id: this.removeRouterGateway.router_id,
            network_id: this.removeRouterGateway.network_id,
            ip_address: this.removeRouterGateway.ip_address,
            subnet_id: this.removeRouterGateway.subnet_id
          })
          .then(() => {
            this.updateView()
          })
      },

      // 编辑路由
      updateRouterDialog(index, row) {
        this.updateRouter.router_id = row.id
        this.updateRouter.name = row.name
        this.updateRouter.admin_state_up = row.admin_state_up
        this.updateRouter.dialog = true
      },
      updateRouters() {
        this.updateRouter.dialog = false
        axios.post('/network/updateRouter', {
            router_id: this.updateRouter.router_id,
            name: this.updateRouter.name,
            admin_state_up: this.updateRouter.admin_state_up
          })
          .then(() => {
            this.updateView()
          })
      },

      // 删除路由
      deleteRouterDialog(index, row) {
        this.deleteRouter.dialog = true
        this.deleteRouter.router_id = row.id
      },
      deleteRouters() {
        this.deleteRouter.dialog = false
        axios.post('/network/deleteRouter', {
            router_id: this.deleteRouter.router_id
          })
          .then(() => {
            this.updateView()
          })
      },


      updateView() {
        this.tab = true
        this.table_loading = true
        axios.get('/network/listrouters')
          .then((res) => {
            this.tableData3 = res.data['routerInfo']
            this.table_loading = false
          })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      // 移除路由接口
      removeRouterInterfaceDialog(index, row) {
        this.removeRouterInterface.dialog = true
        this.removeRouterInterface.subnet_id = row.fixed_ips[0].subnet_id
        this.removeRouterInterface.port_id = row.port_id
      },
      removeRouterInterfaces() {
        this.removeRouterInterface.dialog = false
        axios.post('/network/removeRouterInterface', {
            router_id: this.removeRouterInterface.router.id,
            subnet_id: this.removeRouterInterface.subnet_id,
            port_id: this.removeRouterInterface.port_id,
          })
          .then(() => {
            this.updateView()
          })

      },

      handleTab(router) {
        this.removeRouterInterface.router = router
        this.RouterPort.router = router
        axios.post('/network/listRouterPorts', {
            router_id: router.id
          })
          .then((res) => {
            let list = res.data.routerPortInfo
            this.Router.list = list
            this.Router.loading = false
            this.tab = false
          })
      },

    },
    components: {
      createRouter,
      deleteRouter,
      deleteRouterPort,
      createRouterPort,
      rules,
    }
  }
</script>

<style scoped>

</style>