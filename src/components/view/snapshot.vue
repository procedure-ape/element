<template>
  <div class="tableBox">
    <el-row class="right">
      <!-- 批量操作 -->
      <deleteSnapshot :snapshots="multipleSelection" @updateView="listSnapshots"></deleteSnapshot>
    </el-row>
    <el-table ref="multipleTable" :data="tableData3" v-loading="table_loading" tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="snapshot_name" label="快照名称">
      </el-table-column>
      <el-table-column prop="snapshot_description" label="快照描述">
      </el-table-column>
      <el-table-column prop="server_name" label="快照源">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status | snapshotStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="size" label="大小">
      </el-table-column>
      <!-- <el-table-column prop="min_ram" label="最小内存">
      </el-table-column>
      <el-table-column prop="min_disk" label="最小磁盘">
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button size="mini">
              更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updateSnapshotDialog(scope.row)">编辑快照</el-dropdown-item>
              <el-dropdown-item @click.native="deleteSnapshotDialog(scope.row)">删除快照</el-dropdown-item>
              <el-dropdown-item @click.native="rebuildServerDialog(scope.row)">恢复快照</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑快照 dialog -->
    <el-dialog title="编辑快照" :visible.sync="updateSnapshot.dialog" width="400px" @close="close('updateSnapshot')">
      <el-form label-width="100px" :model="updateSnapshot" :rules="rules" ref="updateSnapshot" class="demo-ruleForm">
        <el-form-item label="快照名称" prop="snapshot_name">
          <el-input v-model="updateSnapshot.snapshot_name" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateSnapshot.dialog = false">取 消</el-button>
        <el-button type="primary" @click="updSnapshot('updateSnapshot')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除快照 dialog -->
    <el-dialog title="删除快照" :visible.sync="deleteSnapshot.dialog" width="400px">
      <el-form label-width="100px">
        <el-form-item label="快照名称">
          <el-input v-model="deleteSnapshot.name" size="mini" disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteSnapshot.dialog = false">取 消</el-button>
        <el-button type="primary" @click="delSnapshot()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 快照恢复 dialog -->
    <el-dialog title="快照恢复" :visible.sync="rebuildServer.dialog" width="400px">
      是否将"{{ rebuildServer.snapshot.name }}"恢复到"{{ rebuildServer.snapshot.snapshot_name }}"
      <span slot="footer" class="dialog-footer">
        <el-button @click="rebuildServer.dialog = false">取 消</el-button>
        <el-button type="primary" @click="rebuildServers()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import deleteSnapshot from './menu/snapshot/delete'
  import iamgeStatus from '../filters/image'
  import rules from '@/components/rules/rules'

  export default {
    data() {
      return {
        tableData3: [],
        multipleSelection: [],
        table_loading: true,
        updateSnapshot: {
          dialog: false,
          snapshot_id: '',
          snapshot_name: '',
          description: '',
          minDisk: '',
          minRam: '',
          protected: '',
          visibility: ''
        },
        deleteSnapshot: {
          dialog: false,
          id: '',
          name: ''
        },
        rebuildServer: {
          dialog: false,
          snapshot: {
            name: '',
            snapshot_name: ''
          }
        },
        disk_formats: [
          'iso',
          'qcow2'
        ],
      }
    },
    computed: {
      rules: function () {
        return rules.rules
      }
    },
    filters: {
      snapshotStatus: (value) => {
        return iamgeStatus.imageStatus(value)
      }
    },
    mounted: function () {
      this.listSnapshots()
    },
    methods: {
      updateSnapshotDialog(v) {
        this.updateSnapshot.dialog = true
        this.updateSnapshot.snapshot_id = v.id
        this.updateSnapshot.snapshot_name = v.snapshot_name
        // this.updateSnapshot.description = v.description
        this.updateSnapshot.minDisk = v.min_disk
        this.updateSnapshot.minRam = v.min_ram
        this.updateSnapshot.protected = v.protected
        this.updateSnapshot.visibility = v.visibility == "public"
      },
      deleteSnapshotDialog(v) {
        this.deleteSnapshot.dialog = true
        this.deleteSnapshot.id = v.id
        this.deleteSnapshot.name = v.name
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      listSnapshots() {
        axios.get('/image/listImages')
          .then((res) => {
            this.tableData3 = res.data['snapshot']
            this.table_loading = false
          })
      },
      updSnapshot(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateSnapshot.dialog = false
            axios.post('/api/updatesnapshot', {
                snapshot_id: this.updateSnapshot.snapshot_id,
                snapshot_name: this.updateSnapshot.snapshot_name,
              })
              .then((res) => {
                this.listSnapshots()
              })
          } else {
            return false;
          }
        });
      },
      delSnapshot() {
        this.deleteSnapshot.dialog = false
        axios.post('/image/delsnapshot', {
            image_id: this.deleteSnapshot.id
          })
          .then((res) => {
            this.listSnapshots()
          })
      },

      // 恢复快照
      rebuildServerDialog(row) {
        this.rebuildServer.dialog = true
        this.rebuildServer.snapshot = row
      },
      rebuildServers() {
        this.rebuildServer.dialog = false
        axios.post('/api/rebuildServer', {
          server_id: this.rebuildServer.snapshot.server_id,
          snapshot_id: this.rebuildServer.snapshot.id,
          name: this.rebuildServer.snapshot.server_name
        })
        this.listSnapshots()
      },

      handleChange1() {

      },
      handleChange2() {

      },

      close(formName) {
        this.$refs[formName].resetFields()
      },
    },
    components: {
      deleteSnapshot,
      rules
    }
  }
</script>

<style scoped>

</style>