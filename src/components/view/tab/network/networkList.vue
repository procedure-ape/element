<template>
  <div>
    <el-row class="right">
      <createNetwork @updateView="updateView"></createNetwork>
      <deleteNetwork :multipleSelection="multipleSelection" @updateView="updateView"></deleteNetwork>
    </el-row>
    <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" v-loading="table_loading"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="网络名称">
        <template slot-scope="scope">
          <el-button type="text" @click="tabs(scope.row)">{{ scope.row | networkName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="子网" width="240">
        <template slot-scope="scope">
          <subNet :subnets="scope.row.subnets_info"></subNet>
        </template>
      </el-table-column>
      <el-table-column label="共享">
        <template slot-scope="scope">
          {{ scope.row.shared | shared }}
        </template>
      </el-table-column>
      <el-table-column label="外部">
        <template slot-scope="scope">
          {{ scope.row.is_router_external | is_router_external }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status | status }}
        </template>
      </el-table-column>
      <el-table-column prop="admin_state_up" label="管理状态">
        <template slot-scope="scope">
          {{ scope.row.admin_state_up | admin_state_up }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button size="mini">
              更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updNetworkDialog(scope.row)">编辑网络</el-dropdown-item>
              <el-dropdown-item @click.native="creSubnetDialog(scope.row)">创建子网</el-dropdown-item>
              <el-dropdown-item @click.native="delNetworkDialog(scope.row)">删除网络</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑网络dialog -->
    <el-dialog title="编辑网络" :visible.sync="updateNetwork.dialog" width="400px">
      <el-form label-width="140px">
        <el-form-item label="网络名称">
          <el-input v-model="updateNetwork.network_name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="启用管理员状态">
          <el-checkbox v-model="updateNetwork.admin_state_up" size="mini"></el-checkbox>
        </el-form-item>
        <el-form-item label="共享的">
          <el-checkbox v-model="updateNetwork.is_share"></el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateNetwork.dialog = false">取 消</el-button>
        <el-button type="primary" @click="updNetwork()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 创建子网dialog -->
    <el-dialog title="创建子网" :visible.sync="createSubnet.dialog" width="400px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="子网" name="subnet">
          <el-form label-width="100px">
            <el-form-item label="子网名称">
              <el-input v-model="createSubnet.name" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="网络地址">
              <el-input v-model="createSubnet.cidr" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="IP版本">
              <el-select v-model="createSubnet.ip_version" placeholder="选择网络类型" size="mini">
                <el-option v-for="v in createSubnet.IPs" :key="v.value" :value="v.value" :label="v.name"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="网关IP">
          <el-input v-model="createSubnet"></el-input>
        </el-form-item>
        <el-form-item label="禁用网关">
          <el-checkbox v-model="createSubnet"></el-checkbox>
        </el-form-item> -->
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="子网详情" name="subnetInfo">
          <el-form label-width="100px">
            <el-form-item label="分配地址池">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"
                v-model="createSubnet.allocation_pools">
              </el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="createSubnet.dialog = false">取 消</el-button>
        <el-button type="primary" @click="creSubnet()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除网络dialog -->
    <el-dialog title="删除网络" :visible.sync="deleteNetwork.dialog" width="500px">
      <el-form label-width="100px">
        确认删除该网络？
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteNetwork.dialog = false">取 消</el-button>
        <el-button type="primary" @click="delNetwork()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import subNet from '../../table_column/subnet'
  import createNetwork from '../../menu/network/createNetwork'
  import deleteNetwork from '../../menu/network/deleteNetwork'
  import networkVue from '../../network.vue';

  export default {
    data() {
      return {
        activeName: 'subnet',
        tableData3: [],
        multipleSelection: [],
        updateNetwork: {
          dialog: false,
          network_name: '',
          admin_state_up: '',
          is_share: false
        },
        createSubnet: {
          dialog: false,
          name: '',
          IPs: [{
              name: 'IPv4',
              value: 4
            },
            {
              name: 'IPv6',
              value: 6
            }
          ],
          ip_version: 4,
          cidr: "",
          allocation_pools: ""

        },
        deleteNetwork: {
          dialog: false
        },
        table_loading: true,
      }
    },
    components: {
      subNet,
      createNetwork,
      deleteNetwork
    },
    mounted: function () {
      this.updateView()
    },
    filters: {
      shared: function (value) {
        return value ? '是' : '否'
      },
      status: function (value) {
        return value == 'ACTIVE' ? '运行中' : '停止'
      },
      admin_state_up: function (value) {
        return value ? 'UP' : 'Down'
      },
      is_router_external: function (value) {
        return value ? '是' : '否'
      },
      networkName: function (value) {
        if(!value.name){
          let values = value.id.split('-')
          return values[0]+ '-' + values[1]
        }
        return value.name
      }
    },
    methods: {
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
      updNetworkDialog(network) {
        this.updateNetwork.network_name = network.name
        this.updateNetwork.admin_state_up = network.admin_state_up
        this.updateNetwork.is_share = network.shared
        this.updateNetwork.dialog = true
        this.updateNetwork.id = network.id
      },
      creSubnetDialog(network) {
        this.createSubnet.dialog = true
        this.createSubnet.id = network.id
      },
      delNetworkDialog(network) {
        this.deleteNetwork.dialog = true
        this.deleteNetwork.id = network.id
      },
      updNetwork() {
        this.updateNetwork.dialog = false
        axios.post('/network/updateNetwork', {
            network_id: this.updateNetwork.id,
            network_name: this.updateNetwork.network_name,
            admin_state_up: this.updateNetwork.admin_state_up,
            is_share: this.updateNetwork.is_share
          })
          .then(() => {
            this.updateView()
          })
      },
      creSubnet() {
        this.createSubnet.dialog = false
        axios.post('/network/createSubnet', {
          network_id: this.createSubnet.id,
          name: this.createSubnet.name,
          cidr: this.createSubnet.cidr,
          ip_version: this.createSubnet.ip_version,
          allocation_pools: this.createSubnet.allocation_pools
        })
      },
      delNetwork() {
        this.deleteNetwork.dialog = false
        axios.post('/network/deleteNetwork', {
            network_id: this.deleteNetwork.id
          })
          .then(() => {
            this.updateView()
          })
      },

      tabs(network) {
        this.$emit('tabs', network)
      },

      updateView() {
        axios.get('/network/listnetworks')
          .then((res) => {
            this.tableData3 = res.data['networkInfo']
            this.table_loading = false
          })
      }
    }
  }
</script>

<style>

</style>