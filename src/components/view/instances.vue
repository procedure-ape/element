<template>
  <div class="tableBox">
    <div class="menu-box">
      <!-- <el-row class='left'>
        <el-dropdown></el-dropdown>
      </el-row> -->
      <el-row class="right">
        <!-- 批量操作 -->
        <createServer @updateView="updateView()"></createServer>
        <deleteServers :servers="multipleSelection" @updateView="updateView()"></deleteServers>
        <startServers :servers="multipleSelection" @updateView="updateView()"></startServers>
        <stopServers :servers="multipleSelection" @updateView="updateView()"></stopServers>
        <softreboots :servers="multipleSelection" @updateView="updateView()"></softreboots>
      </el-row>
    </div>

    <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" v-loading="table_loading" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" prop="server_id" width="55">
      </el-table-column>
      <el-table-column prop="display_name" label="虚拟机名称">
      </el-table-column>
      <el-table-column label="电源状态">
        <template slot-scope="scope">
          {{ scope.row.power_state | power_states }}
        </template>
      </el-table-column>
      <el-table-column label="IP地址" width="130">
        <template slot-scope="scope">
          <instanceTableColumn :test="scope.row.address | instance_address"></instanceTableColumn>
        </template>
      </el-table-column>
      <el-table-column label="虚拟机状态">
        <template slot-scope="scope">
          {{ scope.row.status | status }}
        </template>
      </el-table-column>
      <el-table-column label="任务状态">
        <template slot-scope="scope">
          {{ scope.row.task_state | task_state }}
        </template>
      </el-table-column>
      <el-table-column prop="image_name" label="镜像">
      </el-table-column>
      <el-table-column prop="flavor_name" label="配置">
      </el-table-column>
      <el-table-column label="锁定">
        <template slot-scope="scope">
          {{ scope.row.locked ? '锁定':'未锁定' }}
        </template>
      </el-table-column>
      <el-table-column prop="host_name" label="节点">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="230">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="开启虚拟机" placement="top-end"
              v-if="scope.row.vm_state == 'stopped'">
              <el-button size="mini" @click.native="startServer(scope.row.server_id)" class="xz-buttonGroup-left">
                <i class="fa fa-play"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" v-else effect="dark" content="关闭虚拟机" placement="top-end">
              <el-button size="mini" @click.native="stopServer(scope.row.server_id)">
                <i class="fa fa-pause"></i>
              </el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="打开控制台" placement="top-end">
              <el-button size="mini" @click.native="serverConsole(scope.row.server_id)">
                <i class="fa fa-window-maximize"></i>
              </el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="删除虚拟机" placement="top-end">
              <el-button size="mini" @click.native="deleteServerDialog(scope.row.server_id)">
                <i class="fa fa-trash-o"></i>
              </el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="虚拟机重启" placement="top-end">
              <el-button size="mini" @click.native="soft_reboot(scope.row.server_id)">
                <i class="fa fa-refresh"></i>
              </el-button>
            </el-tooltip>

            <el-button size="mini" style="display: none">
              <i></i>
            </el-button>
          </el-button-group>
          <el-dropdown trigger="click">
            <!-- 按钮组 开启、关闭、控制台、删除、重启 -->
            <el-button-group size="mini">
              <el-button size="mini" style="display: none">
                <i></i>
              </el-button>
              <el-button class="" size="mini">
                <i class="el-icon-arrow-down"></i>
              </el-button>
            </el-button-group>
            <el-dropdown-menu slot="dropdown" style="overflow-x: visible;" size="mini">
              <!-- <el-dropdown-item v-if="scope.row.vm_state == 'stopped'" @click.native="startServer(scope.row.server_id)">开启虚拟机</el-dropdown-item>
              <el-dropdown-item v-else @click.native="stopServer(scope.row.server_id)">关闭虚拟机</el-dropdown-item> -->
              <el-dropdown-item @click.native="createServerImageDialog(scope.row)">创建快照</el-dropdown-item>
              <el-dropdown-item @click.native="updateServerWin(scope.row)">编辑虚拟机</el-dropdown-item>
              <el-dropdown-item @click.native="addNICwin(scope.row)">添加网卡</el-dropdown-item>
              <el-dropdown-item @click.native="delNICwin(scope.row.server_id)">删除网卡</el-dropdown-item>
              <el-dropdown-item @click.native="addVolumwin(scope.row.server_id)">添加卷</el-dropdown-item>
              <el-dropdown-item @click.native="delVolumwin(scope.row.server_id)">删除卷</el-dropdown-item>
              <el-dropdown-item @click.native="hardReboot(scope.row.server_id)">强制重启</el-dropdown-item>
              <el-dropdown-item @click.native="resizeWin(scope.row.server_id)">调整大小</el-dropdown-item>
              <el-dropdown trigger="click" placement="bottom-end" class="instanceSubmenu">
                <div width="100%">更多操作</div>
                <el-dropdown-menu slot="dropdown" style="overflow-x: hidden;">
                  <el-dropdown-item v-if="scope.row.vm_state == 'suspended'"
                    @click.native="resumeServer(scope.row.server_id)">取消挂起虚拟机</el-dropdown-item>
                  <el-dropdown-item v-else @click.native="suspendServer(scope.row.server_id)">挂起虚拟机</el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.vm_state == 'paused'"
                    @click.native="unpauseServer(scope.row.server_id)">取消暂停虚拟机</el-dropdown-item>
                  <el-dropdown-item v-else @click.native="pauseServer(scope.row.server_id)">暂停虚拟机</el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.locked == '0'" @click.native="lockServer(scope.row.server_id)">锁定虚拟机
                  </el-dropdown-item>
                  <el-dropdown-item v-else @click.native="unlockServer(scope.row.server_id)">取消锁定虚拟机</el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.vm_state == 'shelved_offloaded'"
                    @click.native="unshelveServer(scope.row.server_id)">取消废弃虚拟机</el-dropdown-item>
                  <el-dropdown-item v-else @click.native="shelveServer(scope.row.server_id)">废弃虚拟机</el-dropdown-item>
                  <!-- <el-dropdown-item @click.native="rebuildServerWin(scope.row.server_id)">重建虚拟机</el-dropdown-item> -->
                  <!-- <el-dropdown-item v-if="instanceFloatStatus(scope.row)" @click.native="addFloatIpWin(scope.row.server_id)">绑定浮动IP</el-dropdown-item>
                    <el-dropdown-item v-else @click.native="removeFloatIpWin(scope.row.server_id)">解绑浮动IP</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 删除虚拟机dialog -->
    <el-dialog title="删除虚拟机" :visible.sync="delete_server.dialog" width="500px">
      确认删除该虚拟机？
      <span slot="footer" class="dialog-footer">
        <el-button @click="delete_server.dialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteServer()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 更新虚拟机dialog -->
    <el-dialog title="更新虚拟机" :visible.sync="update_server.dialog" width="500px" @close="close('update_server')">
      <el-form label-width="100px" :rules="rules" :model="update_server" ref="update_server" class="demo-ruleForm">
        <el-form-item label="虚拟机名称" prop="name">
          <el-input v-model="update_server.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="update_server.dialog = false">取 消</el-button>
        <el-button type="primary" @click="updateServer('update_server')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 重建虚拟机dialog -->
    <el-dialog title="重建虚拟机" :visible.sync="rebuild_server.dialog" width="500px">
      <el-form label-width="100px">
        <el-form-item label="虚拟机名称">
          <el-input v-model="rebuild_server.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="rebuild_server.admin_password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rebuild_server.dialog = false">取 消</el-button>
        <el-button type="primary" @click="rebuildServer()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加网卡dialog -->
    <el-dialog title="添加网卡" :visible.sync="NIC.add.dialog" width="400px">
      <el-form label-width="100px">
        <el-form-item label="网络" size='mini'>
          <el-select v-model="NIC.add.NIC" size='mini'>
            <el-option v-for="net in NIC.add.nets" :key="net.id" :label="net.lable" :value="net.value" size='mini'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="固定的IP地址" size='mini'>
          <el-input placeholder="请输入IP地址" suffix-icon="el-icon-date" v-model="NIC.add.address" size='mini'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="NIC.add.dialog = false">取 消</el-button>
        <el-button type="primary" @click="addNIC()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除网卡dialog -->
    <el-dialog title="删除网卡" :visible.sync="NIC.del.dialog" width="400px">
      <el-select v-model="NIC.del.delNIC">
        <el-option v-for="net in NIC.del.NICs" :key="net.id" :label="net.lable" :value="net.value">

        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="NIC.del.dialog = false">取 消</el-button>
        <el-button type="primary" @click="delNIC()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加卷dialog -->
    <el-dialog title="添加卷" :visible.sync="Volume.add.dialog" width="400px">
      <el-select v-model="Volume.add.vol" size='mini'>
        <el-option v-for="vol in Volume.add.vols" :key="vol.value" :label="vol.lable" :value="vol.value">

        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Volume.add.dialog = false">取 消</el-button>
        <el-button type="primary" @click="addVolum()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除卷dialog -->
    <el-dialog title="删除卷" :visible.sync="Volume.del.dialog" width="400px">
      <el-select v-model="Volume.del.vol" size='mini'>
        <el-option v-for="vol in Volume.del.vols" :key="vol.value" :label="vol.lable" :value="vol.value">

        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Volume.del.dialog = false">取 消</el-button>
        <el-button type="primary" @click="delVolum()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 调整大小dialog -->
    <el-dialog title="调整大小" :visible.sync="resize.dialog" width="400px">
      <el-select v-model="resize.value">
        <el-option v-for="vol in resize.flavor_list" :key="vol.value" :label="vol.lable" :value="vol.value">

        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resize.dialog = false">取 消</el-button>
        <el-button type="primary" @click="resizeServer()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 绑定浮动IP dialog -->
    <el-dialog title="绑定浮动IP" :visible.sync="float.add.dialog" width="400px">
      <el-form label-width="100px">
        <el-form-item label="IP地址">
          <el-select v-model="float.add.ip">
            <el-option v-for="vol in float.add.ips" :key="vol.id" :label="vol.floating_ip_address" :value="vol.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="待连接的端口">
          <el-select v-model="float.add.port">
            <el-option v-for="vol in float.add.ports" :key="vol.value" :label="vol.lable" :value="vol.value"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="float.add.dialog = false">取 消</el-button>
        <el-button type="primary" @click="addFloatIp()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 解绑浮动IP dialog -->
    <el-dialog title="解绑浮动IP" :visible.sync="float.del.dialog" width="400px">
      <el-select v-model="float.del.vol">
        <el-option v-for="vol in float.del.vols" :key="vol.value" :label="vol.lable" :value="vol.value">

        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="float.del.dialog = false">取 消</el-button>
        <el-button type="primary" @click="removeFloatIp()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 创建快照 dialog -->
    <el-dialog title="创建快照" :visible.sync="ServerImage.dialog" width="400px" @close="close('createUser')">
      <el-form label-width="100px" :rules='rules' :model="ServerImage" ref="createUser" class="demo-ruleForm">
        <el-form-item label="快照名称" prop="name">
          <el-input v-model="ServerImage.name" placeholder="请输入快照名称" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="快照描述">
          <el-input type="textarea" size='mini' :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入快照描述"
            v-model="ServerImage.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ServerImage.dialog = false">取 消</el-button>
        <el-button type="primary" @click="createServerImage('createUser')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import createServer from './menu/instance/createServer'
  import deleteServers from './menu/instance/deleteServer'
  import startServers from './menu/instance/startServer'
  import stopServers from './menu/instance/stopServer'
  import softreboots from './menu/instance/softreboot'
  import instance from '../filters/instance'
  import instanceTableColumn from './table_column/instance'
  import rules from '../rules/rules'

  export default {
    components: {
      createServer,
      deleteServers,
      startServers,
      stopServers,
      softreboots,
      instanceTableColumn,
      rules,
    },
    computed: {
      rules: function () {
        return rules.rules
      }
    },
    data() {
      return {
        tableData3: [],
        multipleSelection: [],
        update_server: {
          dialog: false,
          server_id: '',
          name: ''
        },
        rebuild_server: {
          dialog: false,
        },
        delete_server: {
          dialog: false,
          server_id: ''
        },
        NIC: {
          add: {
            dialog: false,
            address: '',
            NIC: '',
            nets: []
          },
          del: {
            dialog: false,
            NICs: [],
            delNIC: []
          },
        },
        Volume: {
          add: {
            dialog: false,
            vols: [],
            vol: ''
          },
          del: {
            dialog: false,
            vols: [],
            vol: ''
          },
        },
        resize: {
          dialog: false,
          flavor_list: [],
          res: ''
        },
        float: {
          add: {
            dialog: false
          },
          del: {
            dialog: false
          }
        },
        ServerImage: {
          dialog: false,
          server_id: '',
          name: '',
          display_name: '',
          description: '',
        },
        table_loading: true,
        table_update: false,
        updateViewKey: true
      }
    },

    mounted: function () {
      this.updateView()
    },
    beforeDestroy: function () {
      this.updateViewKey = false
    },

    filters: {
      instance_state: (value) => {
        return instance.instance_states(value)
      },
      instance_address: (value) => {
        return instance.instance_address(value)
      },
      power_states: (value) => {
        return instance.power_states(value)
      },
      task_state: (value) => {
        return instance.task_states(value)
      },
      status: (value) => {
        return instance.status(value)
      }
    },

    methods: {
      close(formName) {
        this.$refs[formName].resetFields()
      },
      updateView() {
        this.table_loading = true
        axios.get('/api/listservers')
          .then((res) => {
            this.tableData3 = res.data.instanceInfo

            // for (let i in res.data.instanceInfo) {
            //   if (this.tableData3[i]) {
            //     for (let k in res.data.instanceInfo[i]) {
            //       this.tableData3[i][k] = res.data.instanceInfo[i][k]
            //     }
            //   } else {
            //     this.tableData3[i] = res.data.instanceInfo[i]
            //   }
            // }

            this.table_loading = false
            // if (this.updateViewKey) {
            //   setTimeout(() => {
            //     this.updateView()
            //   }, 2000);
            // }
          })
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
        this.multipleSelection = val
      },

      // 打开虚拟机
      startServer(server_id) {
        this.instance_action('/api/startServer', server_id)
      },

      // 关闭虚拟机
      stopServer(server_id) {
        this.instance_action('/api/stopServer', server_id)
      },

      // 删除虚拟机
      deleteServerDialog(server_id) {
        this.delete_server.server_id = server_id
        this.delete_server.dialog = true
      },
      deleteServer() {
        this.delete_server.dialog = false
        this.instance_action('/api/deleteServer', this.delete_server.server_id)
      },

      // 软重启虚拟机
      soft_reboot(server_id) {
        this.instance_action('/api/softReboot', server_id)
      },

      // 编辑虚拟机
      updateServerWin(server) {
        this.update_server.dialog = true
        this.update_server.server_id = server.server_id
        this.update_server.name = server.display_name
      },

      // 编辑虚拟机
      updateServer(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.update_server.dialog = false
            axios.post('/api/updateServer', {
              server_id: this.update_server.server_id,
              name: this.update_server.name
            })
            .then(()=>{
              this.updateView()
            })
          } else {
            return false;
          }
        });
      },

      // 硬重启虚拟机
      hardReboot(server_id) {
        this.instance_action('/api/hardReboot', server_id)
      },

      // 挂起虚拟机
      suspendServer(server_id) {
        this.instance_action('/api/suspendServer', server_id)
      },

      // 取消挂起虚拟机
      resumeServer(server_id) {
        this.instance_action('/api/resumeServer', server_id)
      },

      // 锁定虚拟机
      lockServer(server_id) {
        this.instance_action('/api/lockServer', server_id)
      },

      // 取消锁定虚拟机
      unlockServer(server_id) {
        this.instance_action('/api/unlockServer', server_id)
      },

      // 废弃虚拟机
      shelveServer(server_id) {
        this.instance_action('/api/shelveServer', server_id)
      },

      // 取消废弃虚拟机
      unshelveServer(server_id) {
        this.instance_action('/api/unshelveServer', server_id)
      },

      // 暂停虚拟机
      pauseServer(server_id) {
        this.instance_action('/api/pauseServer', server_id)
      },

      // 取消暂停虚拟机
      unpauseServer(server_id) {
        this.instance_action('/api/unpauseServer', server_id)
      },

      // 重建虚拟机dialog
      rebuildServerWin(server_id) {
        this.rebuild_server.server_id = server_id
      },

      // 重建虚拟机
      rebuildServer(server_id) {
        this.instance_action('/api/rebuildServer', {
          server_id: this.rebuild_server.server_id,
          name: this.rebuild_server.name,
          admin_password: this.rebuild_server.admin_password
        })
      },

      // 添加网卡窗口
      addNICwin(server) {
        this.NIC.add.NIC = ''
        this.NIC.add.address = ''
        this.NIC.add.nets = []
        this.NIC.add.server_id = server.server_id
        this.NIC.add.dialog = true
        axios.get('/network/listnetworks')
          .then((res) => {
            // 未完成 添加网卡的时候只能添加虚拟机目前有的网卡的类型（内部或是外部）判断条件是is_router什么什么的
            res.data.networkInfo.forEach((net) => {
              if (net.subnets_info.length != 0) {
                this.NIC.add.nets.push({
                  lable: net.name,
                  value: net.id
                })
              }
            })
          })
      },

      // 添加网卡
      addNIC() {
        this.NIC.add.dialog = false
        axios.post('/api/createSerInter', {
            server_id: this.NIC.add.server_id,
            net_id: this.NIC.add.NIC,
            ip_address: this.NIC.add.address
          })
          .then((res) => {
            this.updateView()
          })
      },

      // 删除网卡窗口
      delNICwin(server_id) {
        this.NIC.del.delNIC = ''
        this.NIC.del.dialog = true
        this.NIC.del.server_id = server_id
        axios.post('/api/listServerInter', {
            server_id
          })
          .then((res) => {
            let NICs = []
            res.data.server_interface_info.forEach((net) => {
              let data = {}
              data['value'] = net.port_id
              net.fixed_ips.forEach((ip) => {
                data['lable'] = ip.ip_address
                NICs.push(data)
              })
            })
            this.NIC.del.NICs = NICs
          })
      },

      // 删除网卡管理
      delNIC() {
        this.NIC.del.dialog = false
        axios.post('/api/delSerInter', {
            port_id: this.NIC.del.delNIC,
            server_id: this.NIC.del.server_id
          })
          .then(() => {
            this.updateView()
          })
      },

      // 添加卷窗口
      addVolumwin(server_id) {
        this.Volume.add.vol = ''
        this.Volume.add.server_id = server_id
        this.Volume.add.dialog = true
        axios.get('/store/listVolumes')
          .then((res) => {
            let vols = []
            res.data.volumeInfo.forEach((v) => {
              if (v.status == 'available') {
                vols.push({
                  lable: v.name ? v.name : v.id,
                  value: v.id
                })
              }

              this.Volume.add.vols = vols
            })
          })
      },

      // 添加卷管理
      addVolum() {
        this.Volume.add.dialog = false
        axios.post('/api/createVolumeAtt', {
            server_id: this.Volume.add.server_id,
            volume_id: this.Volume.add.vol,
          })
          .then(() => {
            this.updateView()
          })
      },

      // 删除卷窗口
      delVolumwin(server_id) {
        this.Volume.del.dialog = true
        this.Volume.del.vol = ''
        this.Volume.del.server_id = server_id
        axios.post('/api/listVolumeAtt', {
            server_id
          })
          .then((res) => {
            let vols = []
            res.data.volume_attInfo.forEach((val) => {
              let data = {}
              data.value = val.id
              data.lable = val.name ? val.name : val.id
              vols.push(data)
            })
            this.Volume.del.vols = vols
          })
      },

      // 删除卷管理
      delVolum() {
        this.Volume.del.dialog = false
        axios.post('/api/delVolumeAtt', {
            id: this.Volume.del.vol,
            server_id: this.Volume.del.server_id
          })
          .then(() => {
            this.updateView()
          })
      },

      // 虚拟机控制台
      serverConsole(server_id) {
        axios.post('/api/consoleUrl', {
            server_id
          })
          .then((res) => {
            window.open(res.data.msg.console.url)
          })
      },

      // 调整大小dialog
      resizeWin(server_id) {
        this.resize.dialog = true
        this.resize.server_id = server_id
        axios.get('/api/listflavors')
          .then((res) => {
            let data = []
            res.data.flavorInfo.forEach(val => {
              data.push({
                lable: val.name,
                value: val.flavor_id
              })
            })
            this.resize.flavor_list = data
          })
      },

      // 调整大小
      resizeServer() {
        this.resize.dialog = false
        axios.post('/api/resizeServer', {
            server_id: this.resize.server_id,
            flavor_id: this.resize.value
          })
          .then(() => {
            this.updateView()
          })
      },

      // 创建快照dialog
      createServerImageDialog(server) {
        this.ServerImage.dialog = true
        this.ServerImage.server_id = server.server_id
        this.ServerImage.display_name = server.display_name
      },

      // 创建快照
      createServerImage(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ServerImage.dialog = false
            axios.post('/api/createServerImage', {
                server_id: this.ServerImage.server_id,
                snapshot_name: this.ServerImage.name,
                server_name: this.ServerImage.display_name,
                description: this.ServerImage.description,
              })
              .then(() => {
                this.ServerImage.name = ''
                this.ServerImage.description = ''
                this.updateView()
              })
          } else {
            return false;
          }
        });

      },

      // 绑定浮动IP dialog
      addFloatIpWin() {
        this.float.add.dialog = true

      },

      // 绑定浮动IP
      addFloatIp() {
        this.float.add.dialog = false

      },

      // 解绑浮动IP dialog
      removeFloatIpWin() {
        this.float.del.dialog = true

      },

      // 解绑浮动IP
      removeFloatIp() {
        this.float.del.dialog = false

      },

      instance_action(url, server_id) {
        axios.post(url, {
            server_id
          })
          .then((res) => {
            this.updateView()
            return res
          })
      },

      // 判断虚拟机浮动IP状态
      instanceFloatStatus(row) {
        for (let i in row.address) {
          for (let net of row.address[i]) {
            if (net['OS-EXT-IPS:type'] == "floating") {
              return false
            }
          }
        }
        return true
      },

    }
  }
</script>

<style scoped lang="scss">
  .instanceSubmenu {
    list-style: none;
    line-height: 36px;
    padding: 0 20px;
    margin: 0;
    font-size: 14px;
    color: #606266;
    cursor: pointer;
    outline: 0;
    display: block;

    &:hover {
      background-color: #ecf5ff;
      color: #66b1ff;
    }
  }

  .el-button-group {
    margin-right: -4px;
  }
</style>