<template>
  <div class="tableBox">
    <!-- 安全组 -->
    <div v-if="tab">
      <el-row class="right">
        <deleteSecGro @updateView="updateView()" :multipleSelection="multipleSelection"></deleteSecGro>
        <createSecGro @updateView="updateView()"></createSecGro>
      </el-row>
      <el-table ref="multipleTable" :data="listSecGro.list" v-loading="listSecGro.loading" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column prop="security_group_id" label="安全组ID">
        </el-table-column>
        <el-table-column prop="description" label="描述">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="190px">
          <template slot-scope="scope">
            <el-button size="mini" @click="listSecGroRules(scope.$index, scope.row)">管理规则</el-button>
            <el-dropdown trigger="click">
              <el-button size="mini" class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="updateSecGroDialog(scope.$index, scope.row)">编辑安全组</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="deleteSecGroDialog(scope.$index, scope.row)">删除安全组</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 安全组规则 -->
    <div v-if="!tab">
      <el-row class="table_menu">
        <div class="table_menu_left">
          <div class="backup self-margin" @click="backup">
            <i class="fa fa-angle-left"></i>
          </div>
        </div>
        <div class="table_menu_right">
          <deleteSecGroRule class="self-margin" @updateView="updateView()" :multipleSelection="multipleSelection"></deleteSecGroRule>
          <createSecGroRule class="self-margin" @updateView="updateView()" :securityGroupId="security_group_id"></createSecGroRule>
        </div>
      </el-row>
      <el-table ref="multipleTable" :data="listSecGroRule.list" v-loading="listSecGroRule.loading" tooltip-effect="dark"
        style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="direction" label="方向">
          <template slot-scope="scope">
            {{ scope.row.direction === 'egress' ? '出口' : '入口' }}
          </template>
        </el-table-column>
        <el-table-column prop="ethertype" label="以太网类型（EtherType）" width="190px">
        </el-table-column>
        <el-table-column label="IP协议">
          <template slot-scope="scope">
            <div>{{ scope.row.remote_ip_prefix }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="端口范围">
          <template slot-scope="scope">
            <div>{{ scope.row.port_range_max }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="远端IP前缀">
        </el-table-column>
        <el-table-column prop="description" label="远端安全组">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150px">
          <template slot-scope="scope">
            <el-button size="mini" @click="listSecGroRule(scope.$index, scope.row)">管理规则</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <!-- 编辑安全组 dialog -->
      <el-dialog title="编辑安全组" :visible.sync="updateSecGro.dialog" width="400px">
        <el-form label-width="100px">
          <el-form-item label="名称" size='mini'>
            <el-input v-model="updateSecGro.name" size='mini'></el-input>
          </el-form-item>
          <el-form-item label="描述" size="mini">
            <el-input v-model="updateSecGro.description" size='mini'></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateSecGro.dialog = false">取 消</el-button>
          <el-button type="primary" @click="updateSecGros()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 删除安全组 dialog -->
      <el-dialog title="删除安全组" :visible.sync="deleteSecGro.dialog" width="400px">
        <div>确认删除该安全组？</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteSecGro.dialog = false">取 消</el-button>
          <el-button type="primary" @click="deleteSecGros()">确 定</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import createSecGro from './menu/SecurityGroups/createSecGro'
  import deleteSecGro from './menu/SecurityGroups/deleteSecGro'
  import createSecGroRule from './menu/SecGroRule/create'
  import deleteSecGroRule from './menu/SecGroRule/delete'
  import axios from 'axios'
  export default {
    data() {
      return {
        multipleSelection: [],
        table_loading: true,
        tab: true,
        listSecGro: {
          list: [],
          loading: true
        },
        listSecGroRule: {
          list: [],
          loading: false
        },
        updateSecGro: {
          dialog: false,
          name: '',
          description: ''
        },
        deleteSecGro: {
          dialog: false
        },
        securityGroupId: {}
      }
    },
    mounted: function () {
      this.updateView(this)
    },
    methods: {
      updateView() {
        axios.get('/network/listSecGro')
          .then((res) => {
            this.listSecGro.list = res.data['security_group_info']
            this.listSecGro.loading = false
          })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      listSecGroRules(index, row) {
        this.tab = false
        this.security_group_id = row.security_group_id
        this.listSecGroRule.list = row.security_group_rules
      },

      updateSecGroDialog(index,row){
        this.updateSecGro.dialog = true
        this.updateSecGro.security_group_id = row.security_group_id
        this.updateSecGro.name = row.name
        this.updateSecGro.description = row.description
      },
      updateSecGros(){
        this.updateSecGro.dialog = false
        axios.post('/network/updateSgroup',{
          security_group_id: this.updateSecGro.security_group_id,
          name: this.updateSecGro.name,
          description: this.updateSecGro.description,
        })
        .then(()=>{
          this.updateView()
        })
      },
      deleteSecGroDialog(index,row){
        this.deleteSecGro.dialog = true
        this.deleteSecGro.security_group_id = row.security_group_id
      },
      deleteSecGros(index,row){
        this.deleteSecGro.dialog = false
        axios.post('/network/deleteSgroup',{
          security_groups_id: this.deleteSecGro.security_group_id,
        })
        .then(()=>{
          this.updateView()
        })
      },

      backup() {
        this.tab = true
        this.updateView()
      },
    },
    components: {
      createSecGro,
      deleteSecGro,
      createSecGroRule,
      deleteSecGroRule,
    }
  }
</script>

<style scoped>
  .table_menu {
    display: flex;
    flex-direction: inherit;
  }

  .table_menu_right {
    display: flex;
    flex-direction: row-reverse;
    flex-grow: 1;
  }

  .backup {
    padding: 0 15px;
    background: #fff;
    border: solid 1px #ddd;
    border-radius: 3px;
    color: #777;
    cursor: pointer;
  }

  .self-margin+.self-margin {
    margin-right: 5px;
  }

  .self-margin {
    margin-bottom: 5px;
  }
</style>