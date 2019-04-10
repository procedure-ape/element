<template>
  <div class="tableBox">
    <el-row class="right" @updateView="updateView">
      <createFlavor></createFlavor>
      <deleteFlavor :multipleSelection="multipleSelection"></deleteFlavor>
    </el-row>
    <el-table ref="multipleTable" :data="tableData3" v-loading="table_loading" tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column prop="vcpus" label="vcpu(个)">
        <template slot-scope="scope">
          {{ scope.row.vcpus | zero }}
        </template>
      </el-table-column>
      <el-table-column prop="ram" label="内存(MB)">
        <template slot-scope="scope">
          {{ scope.row.ram | zero }}
        </template>
      </el-table-column>
      <el-table-column label="根磁盘(GB)">
        <template slot-scope="scope">
          {{ scope.row.disk | zero }}
        </template>
      </el-table-column>
      <el-table-column label="临时磁盘(GB)">
        <template slot-scope="scope">
          {{ scope.row.ephemeral | zero }}
        </template>
      </el-table-column>
      <el-table-column label="Swap磁盘(MB)">
        <template slot-scope="scope">
          {{ scope.row.swap | zero }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button size="mini">
              更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="delFlavorWin(scope.row)">删除配置</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <!-- 删除虚拟机配置dialog -->
      <el-dialog title="删除配置" :visible.sync="delFlavors.dialog" width="400px">
        <el-form>
          确认删除该虚拟机配置？
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delFlavors.dialog = false">取 消</el-button>
          <el-button type="primary" @click="delFlavor()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import createFlavor from './menu/flavor/createFlavor'
  import deleteFlavor from './menu/flavor/deleteFlavor'
  import axios from 'axios'
  export default {
    data() {
      return {
        tableData3: [],
        multipleSelection: [],
        delFlavors: {
          dialog: false
        },
        table_loading: true,
      }
    },
    mounted: function () {
      this.updateView()
    },
    filters: {
      zero(v){
        if(v == ''){
          return 0
        }
        return v
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
      delFlavorWin(v) {
        this.delFlavors.flavor_id = v.flavor_id
        this.delFlavors.dialog = true
      },

      delFlavor() {
        this.delFlavors.dialog = false
        axios.post('/api/delFlavor', {
            flavor_id: this.delFlavors.flavor_id
          })
          .then(() => {
            this.updateView()
          })
      },

      updateView() {
        axios.get('/api/listflavors')
          .then((res) => {
            this.tableData3 = res.data['flavorInfo']
            this.table_loading = false
          })
      }
    },
    components: {
      createFlavor,
      deleteFlavor
    }
  }
</script>

<style scoped>

</style>
