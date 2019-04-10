<template>
  <div class="tableBox">
    <el-row class="right">
      <createStorage @updateView="updateView()"></createStorage>
      <deleteStorage :multipleSelection="multipleSelection" @updateView="updateView()"></deleteStorage>
    </el-row>
    <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" v-loading="table_loading" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="卷名称">
        <template slot-scope="scope">
          <div>{{ scope.row.name?scope.row.name:scope.row.id }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="volume_type" label="卷类型">
      </el-table-column>
      <el-table-column label="连接到">
        <template slot-scope="scope">
          <div>{{ scope.row | connection }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status | storageStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="size" label="大小(GB)">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button size="mini" style="marggin">
              更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="delVolumeDialog(scope.row)">删除卷</el-dropdown-item>
              <el-dropdown-item @click.native="extVolumesDialog(scope.row)">扩展卷</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="extVolumesDialog(scope.row)">编辑卷</el-dropdown-item> -->
              <el-dropdown-item @click.native="manageVolumesDialog(scope.row)">管理链接</el-dropdown-item>
              <el-dropdown-item @click.native="createSnapshotDialog(scope.row)">创建卷快照</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="test(scope.row)">更新卷状态</el-dropdown-item> -->
              <!-- <el-dropdown-item @click.native="test(scope.row)">非管理卷</el-dropdown-item> -->
              <!-- <el-dropdown-item @click.native="test(scope.row)">迁移卷</el-dropdown-item> -->
              <!-- <el-dropdown-item @click.native="test(scope.row)">更新元数据</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div>

      <!-- 删除卷dialog -->
      <el-dialog title="删除卷" :visible.sync="del_volume.dialog" width="300px">
        <el-form>
          确认删除卷？
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="del_volume.dialog = false">取 消</el-button>
          <el-button type="primary" @click="delVolumes()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 扩展卷dialog -->
      <el-dialog title="扩展卷" :visible.sync="ext_volume.dialog" width="300px">
        <el-form label-width="100px">
          <el-form-item label="卷名称">
            <el-input v-model="ext_volume.name" size="mini" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="大小">
            <el-input-number v-model="ext_volume.size" controls-position="right" @change="handleChange" :min="1"
              size="mini"></el-input-number>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ext_volume.dialog = false">取 消</el-button>
          <el-button type="primary" @click="extVolumes()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 创建卷快照dialog -->
      <el-dialog title="创建卷快照" :visible.sync="createSnapshot.dialog" width="400px" @close="close('createSnapshot')">
        <el-form label-width="100px" :model="createSnapshot" :rules="rules" ref="createSnapshot" class="demo-ruleForm">
          <el-form-item label="快照名称" prop="snapshot_name">
            <el-input v-model="createSnapshot.snapshot_name" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入快照描述"
              v-model="createSnapshot.description"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="createSnapshot.dialog = false">取 消</el-button>
          <el-button type="primary" @click="createSnapshots('createSnapshot')">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 管理链接dialog -->
      <el-dialog v-if="manage_volume.volume.status==='in-use'" title="分离卷" :visible.sync="manage_volume.dialog"
        width="400px">
        <el-form label-width="100px">
          <el-form-item label="卷名称">
            <el-input v-model="manage_volume.volume.name" size="mini" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item v-if="manage_volume.volume.status == 'in-use'" label="实例">
            <el-input v-model="manage_volume.volume.attachments.server_name" size="mini" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item v-else label="连接实例">
            <el-select v-model="ConnectionVolume.server_id" size="mini" placeholder="请选择">
              <el-option v-for="server in servers" :key="server.server_id" :label="server.display_name"
                :value="server.server_id">
                <span style="float: left">{{ server.display_name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="manage_volume.dialog = false">取 消</el-button>
          <el-button v-if="manage_volume.volume.status == 'in-use'" type="primary" @click="SeparationVolumes()">确
            定</el-button>
          <el-button v-else type="primary" @click="ConnectionVolumes()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog v-else title="连接卷" :visible.sync="manage_volume.dialog" width="400px">
        <el-form label-width="100px">
          <el-form-item label="卷名称">
            <el-input v-model="manage_volume.volume.name" size="mini" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item v-if="manage_volume.volume.status == 'in-use'" label="实例">
            <el-input v-model="manage_volume.volume.attachments.server_name" size="mini" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item v-else label="连接实例">
            <el-select v-model="ConnectionVolume.server_id" size="mini" placeholder="请选择">
              <el-option v-for="server in servers" :key="server.server_id" :label="server.display_name"
                :value="server.server_id">
                <span style="float: left">{{ server.display_name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="manage_volume.dialog = false">取 消</el-button>
          <el-button v-if="manage_volume.volume.status == 'in-use'" type="primary" @click="SeparationVolumes()">确
            定</el-button>
          <el-button v-else type="primary" @click="ConnectionVolumes()">确 定</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import createStorage from './menu/storage/createStorage'
  import deleteStorage from './menu/storage/deleteStorage'
  import rules from '@/components/rules/rules'

  export default {
    data() {
      return {
        tableData3: [],
        multipleSelection: [],
        table_loading: true,
        del_volume: {
          dialog: false
        },
        upd_volume: {
          dialog: false
        },
        ext_volume: {
          dialog: false,
          size: 1
        },
        manage_volume: {
          dialog: false,
          volume: {
            status: 'in-use',
            attachments: {
              server_name: ''
            }
          }
        },
        ConnectionVolume: {
          servers: [],
          server_id: ''
        },
        SeparationVolume: {

        },
        servers: [],
        createSnapshot: {
          dialog: false,
          name: '',
          snapshot_name: '',
          description: '',
        }
      }
    },

    computed: {
      rules: function () {
        return rules.rules
      }
    },

    filters: {
      connection: (value) => {
        if (value.attachments.length != 0) {
          return value.attachments.server_name + '上的' + value.attachments.device
        }
        return ''
      },
      storageStatus: (value) => {
        switch (value) {
          case 'available':
            return '可用'
            break
          case 'in-use':
            return '使用中'
            break
          case 'detaching':
            return '分离中'
            break
          case 'reserved':
            return '保留'
            break
          default:
            return '未知'
        }
      },
    },

    mounted: function () {
      this.updateView()
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

      // 窗口
      delVolumeDialog(v) {
        this.del_volume.dialog = true
        this.del_volume.volume_id = v.id
      },
      extVolumesDialog(v) {
        this.ext_volume.dialog = true
        this.ext_volume.volume_id = v.id
        this.ext_volume.name = v.name
        this.ext_volume.size = v.size
      },
      manageVolumesDialog(v) {
        this.manage_volume.dialog = true
        this.manage_volume.volume = v
        if (this.manage_volume.volume.status != 'in-use') {
          axios.get('/api/listservers')
            .then((res) => {
              this.servers = res.data.instanceInfo
              this.updateView()
            })
        }
      },

      delVolumes() {
        this.del_volume.dialog = false
        axios.post('/store/delVolume', {
            volume_id: this.del_volume.volume_id
          })
          .then(() => {
            this.updateView()
          })
      },
      extVolumes() {
        this.ext_volume.dialog = false
        axios.post('/store/extendVolume', {
            volume_id: this.ext_volume.volume_id,
            size: this.ext_volume.size
          })
          .then(() => {
            this.updateView()
          })
      },
      // 连接到实例
      ConnectionVolumes() {
        this.manage_volume.dialog = false
        axios.post('/api/createVolumeAtt', {
            server_id: this.ConnectionVolume.server_id,
            volume_id: this.manage_volume.volume.id
          })
          .then((res) => {
            this.updateView()
          })
      },
      // 分离连接
      SeparationVolumes() {
        this.manage_volume.dialog = false
        axios.post('/api/delVolumeAtt', {
            id: this.manage_volume.volume.id,
            server_id: this.manage_volume.volume.attachments.server_id
          })
          .then(() => {
            this.updateView()
          })
      },

      updateView() {
        axios.get('/store/listVolumes')
          .then((res) => {
            this.tableData3 = res.data['volumeInfo']
            this.table_loading = false
          })
      },

      handleChange(v) {

      },

      // 创建卷快照
      createSnapshotDialog(v) {
        this.createSnapshot.volume_id = v.id
        this.createSnapshot.dialog = true
      },
      createSnapshots(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createSnapshot.dialog = false
            axios.post('/store/createSnapshot', {
              snapshot_name: this.createSnapshot.snapshot_name,
              volume_id: this.createSnapshot.volume_id,
              description: this.createSnapshot.description
            })
          } else {
            return false;
          }
        });
      },

      close(formName) {
        this.$refs[formName].resetFields()
      }
    },
    components: {
      createStorage,
      deleteStorage,
      rules
    }
  }
</script>

<style scoped>

</style>