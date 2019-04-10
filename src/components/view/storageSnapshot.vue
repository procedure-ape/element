<template>
  <div class="tableBox">
    <el-row class="right">
      <deleteStorageSnapshot :multipleSelection="multipleSelection" @updateView="updateView()"></deleteStorageSnapshot>
    </el-row>
    <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" v-loading="table_loading" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="size" label="大小(GB)"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status | storageStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="volume_id" label="卷名称" min-width="150px">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button size="mini" style="marggin">
              更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="createVolumeDialog(scope.row)">创建卷</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="updateSnapshotDialog(scope.row)">编辑快照</el-dropdown-item> -->
              <el-dropdown-item @click.native="delSnapshotDailog(scope.row)">删除快照</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div>

      <!-- 从快照创建卷dialog -->
      <el-dialog title="从快照创建卷" :visible.sync="createVolume.dialog" width="400px" @close="close('createVolume')">
        <el-form label-width="100px" :model="createVolume" :rules="rules" ref="createVolume" class="demo-ruleForm">
          <el-form-item label="卷名称" size='mini' prop="volume_name">
            <el-input size='mini' v-model="createVolume.volume_name"></el-input>
          </el-form-item>
          <el-form-item label='描述' size='mini'>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"
              v-model="createVolume.description">
            </el-input>
          </el-form-item>
          <el-form-item label='大小(GiB)' size='mini'>
            <el-input-number size="mini" v-model="createVolume.volume_size"></el-input-number>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="createVolume.dialog = false">取 消</el-button>
          <el-button type="primary" @click="createVolumes('createVolume')">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑卷快照dialog -->
      <el-dialog title="编辑卷" :visible.sync="updateSnapshot.dialog" width="400px">
        <el-form label-width="100px">
          <el-form-item label="卷名称" size='mini'>
            <el-input size='mini' v-model="updateSnapshot.volume_name"></el-input>
          </el-form-item>
          <el-form-item label='描述' size='mini'>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"
              v-model="updateSnapshot.description">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateSnapshot.dialog = false">取 消</el-button>
          <el-button type="primary" @click="updateSnapshots()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 删除卷快照dialog -->
      <el-dialog title="删除卷快照" :visible.sync="delSnapshot.dialog" width="400px">
        确认删除卷快照？
        <span slot="footer" class="dialog-footer">
          <el-button @click="delSnapshot.dialog = false">取 消</el-button>
          <el-button type="primary" @click="delSnapshots()">确 定</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import deleteStorageSnapshot from './menu/storageSnapshot/deleteStorageSnapshot'
  import rules from '@/components/rules/rules'

  export default {
    data() {
      return {
        tableData3: [],
        multipleSelection: [],
        table_loading: true,
        createVolume: {
          dialog: false,
          volume_name: '',
          volume_size: 1,
          description: ''
        },
        updateSnapshot: {
          dialog: false,
          volume_name: '',
          description: ''
        },
        delSnapshot: {
          dialog: false
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

      updateView() {
        axios.get('/store/listVolSnapshots')
          .then((res) => {
            this.tableData3 = res.data['snapshotInfo']
            this.table_loading = false
          })
      },

      // 从快照创建卷
      createVolumeDialog(v) {
        this.createVolume.dialog = true
        this.createVolume.snapshot_id = v.id
        this.createVolume.volume_name = v.name
        this.createVolume.volume_size = v.size
        this.createVolume.description = v.description
      },

      createVolumes() {
        this.createVolume.dialog = false
        axios.post('/store/createVolume', {
          volume_name: this.createVolume.volume_name,
          snapshot_id: this.createVolume.snapshot_id,
          description: this.createVolume.description,
          volume_size: this.createVolume.volume_size
        })
      },

      // 编辑卷快照
      updateSnapshotDialog(v) {
        this.updateSnapshot.dialog = true
        this.updateSnapshot.snapshot_id = v.id
        this.updateSnapshot.volume_name = v.name
        this.updateSnapshot.description = v.description
      },

      updateSnapshots() {
        this.updateSnapshot.dialog = false
        axios.post('/store/updateSnapshot', {
          snapshot_id: this.updateSnapshot.snapshot_id,
          name: this.updateSnapshot.volume_name,
          description: this.updateSnapshot.description,
        })
      },

      // 删除卷快照
      delSnapshotDailog(v) {
        this.delSnapshot.dialog = true
        this.delSnapshot.snapshot_id = v.id
      },

      delSnapshots() {
        this.delSnapshot.dialog = false
        axios.post('/store/delSnapshot', {
            snapshot_id: this.delSnapshot.snapshot_id,
          })
          .then(() => {
            this.updateView()
          })
      },
      close(formName){
        this.$refs[formName].resetFields()
      }
    },
    components: {
      deleteStorageSnapshot,
      rules
    }
  }
</script>

<style scoped>

</style>