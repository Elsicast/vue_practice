<template>
  <el-container id="rule">
    <el-header height="auto">
      <el-form ref="queryinfo" :model="queryinfo" label-width="100px">
        <el-row>
          <el-col :span='6'>
            <el-form-item label="规则名称">
              <el-input v-model="queryinfo.ruleName" class="el-input1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='6'>
            <el-form-item label="告警分类">
              <el-select small v-model="queryinfo.bugClass" placeholder="全部">
                <el-option v-for="item in bugList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='6'>
            <el-form-item label="启用状态">
              <el-select small v-model="queryinfo.status">
                <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='6'>
            <el-form-item label="创建人">
              <el-input v-model="queryinfo.creator" class="el-input1"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="buttons">
        <el-button icon="el-icon-plus" @click="showDialog">添加</el-button>
        <el-button icon=".
        confont icon-weibiaoti518" @click="startSelection">启用</el-button>
        <el-button icon="iconfont icon-tingzhi" @click="stopSelection">停用</el-button>
        <el-button icon="el-icon-delete" @click="deleteSelection">批量删除</el-button>
        <el-button icon="el-icon-download">导出</el-button>
        <el-button icon="el-icon-upload2">导入</el-button>
      </div>
      <div></div>
      <div>
        <el-button type="primary" icon="el-icon-search" class="searchButton" @click="searchdata">搜索</el-button>
      </div>
    </el-header>
    <el-main height="580px">
      <el-table :data="ruleData" tooltip-effect="dark" style="width: 100%" ref="multipleTable"
        @selection-change="handleSelectionChange" class="ruleTable">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="ruleID" label="规则ID"></el-table-column>
        <el-table-column prop="ruleName" label="规则名称"></el-table-column>
        <el-table-column prop="bugClass" label="告警分类"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column sortable prop="createTime" label="创建时间"></el-table-column>
        <el-table-column sortable prop="latest" label="最后修改时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑" effect="dark" placement="right">
              <el-button icon="el-icon-setting" @click="editData(scope.row)" class="editButton" type="primary">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer id="footer1">
      <el-pagination class="pagination1" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="querypageinfo.pagenum" :page-sizes="[10, 20, 50, 100]" :page-size="querypageinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-footer>
    <Dialog @reloadRuleData="createRule" :msg="addDialogVisible" ref="Dialog"></Dialog>
    <editdialog @reloadRuleData="editRule" :msg='editRuleData' ref="editDialog"></editdialog>
  </el-container>

</template>

<script>
// import ExportExcel from './ExportExcel'
import Dialog from '../Dialog.vue'
import editdialog from '../editDialog.vue'
import { ruleData, bugClass, obj } from '../../assets/js/data.js'
export default {
  // updated () {
  //   this.getTotal()
  //   this.getRuleData()
  // },
  components: {
    Dialog,
    editdialog
    // ExportExcel
  },
  created () {
    this.getBugList()
    this.getTotal()
    this.getSearchData()
    this.getRuleData()
  },
  data () {
    return {
      total: 1,
      ruleData: [],
      searchData: [],
      addDialogVisible: false,
      querypageinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      queryinfo: {
        ruleName: '',
        bugClass: '',
        status: '0',
        creator: ''
      },
      bugList: [],
      status: [
        {
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '启用'
        }, {
          value: '2',
          label: '停用'
        }
      ],
      editRuleData: {}
    }
  },
  methods: {
    editRule () {
      this.search()
      this.getRuleData()
      this.$message.success('更改成功！')
    },
    editData (ruleinfo) {
      this.editRuleData = ruleinfo
      this.$refs.editDialog.AaddDialogVisible()
    },
    createRule () {
      this.search()
      this.getRuleData()
      this.$message.success('新建成功！')
    },
    search () {
      this.searchData = []
      this.total = 0
      this.querypageinfo.pagenum = 1
      const query = this.queryinfo
      for (const item of ruleData) {
        if (query.ruleName === '' || item.ruleName.includes(query.ruleName)) {
          if (query.bugClass === '' || item.bugClass.includes(this.bugList[parseInt(query.bugClass) - 1].label)) {
            if (query.status === '0' || item.status === query.status) {
              if (query.creator === '' || item.creator.includes(query.creator)) {
                this.total++
                // console.log(item)
                this.searchData.push(item)
              }
            }
          }
        }
      }
    },
    searchdata (evt) {
      this.search()
      this.getRuleData()
      // console.log(this.ruleData)
      this.$message.success('搜索成功！')
      let target = evt.target
      if (target.nodeName === 'SPAN') {
        target = evt.target.parentNode
      }
      target.blur()
    },
    deleteSelection (evt) {
      const that = this
      if (this.multipleSelection === '' || this.multipleSelection === undefined) {
        this.$message.warning('未选中！请重新选择')
        return
      }
      const selection = that.multipleSelection
      selection.forEach(function (item) {
        // console.log(item)
        const id = parseInt(item.ruleID)
        ruleData.splice(id - 1, 1)
      })
      obj.nowid = obj.nowid - selection.length
      // console.log(obj.nowid)
      for (let i = 0; i < ruleData.length; i++) {
        ruleData[i].ruleID = (i + 1).toString()
      }
      this.search()
      this.getRuleData()
      this.getTotal()
      this.querypageinfo.pagenum = 1
      this.$message.success('删除成功！')
      let target = evt.target
      if (target.nodeName === 'SPAN') {
        target = evt.target.parentNode
      }
      target.blur()
    },
    startSelection (evt) {
      const that = this
      if (this.multipleSelection === '' || this.multipleSelection === undefined) {
        this.$message.warning('未选中！请重新选择')
        return
      }
      const selection = that.multipleSelection
      selection.forEach(function (item) {
        // console.log(item)
        const id = parseInt(item.ruleID)
        ruleData[id - 1].status = '1'
      })
      this.search()
      this.getRuleData()
      this.$message.success('启动成功！')
      let target = evt.target
      if (target.nodeName === 'SPAN') {
        target = evt.target.parentNode
      }
      target.blur()
    },
    stopSelection (evt) {
      const that = this
      if (this.multipleSelection === '' || this.multipleSelection === undefined) {
        this.$message.warning('未选中！请重新选择')
        return
      }
      const selection = that.multipleSelection
      selection.forEach(function (item) {
        // console.log(item)
        const id = parseInt(item.ruleID)
        ruleData[id - 1].status = '2'
      })
      this.search()
      this.getRuleData()
      this.$message.success('停止成功！')
      let target = evt.target
      if (target.nodeName === 'SPAN') {
        target = evt.target.parentNode
      }
      target.blur()
    },
    showDialog () {
      this.$refs.Dialog.AaddDialogVisible()
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      // console.log(this.multipleTable)
      this.multipleSelection = val
    },
    getSearchData () {
      this.searchData = ruleData
    },
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.querypageinfo.pagesize = newSize
      this.getRuleData()
      // this.getRuleData()
      // this.getuserlist()
    },
    handleCurrentChange (newpage) {
      this.querypageinfo.pagenum = newpage
      this.getRuleData()
      // this.getRuleData()
      // this.getuserlist()
    },
    getRuleData () {
      this.ruleData = []
      const pagesize = this.querypageinfo.pagesize
      const pagenum = this.querypageinfo.pagenum
      const startid = pagesize * (pagenum - 1)
      console.log(this.total)
      const stopid = ((pagesize * pagenum <= this.total) ? (pagesize * pagenum) : this.total)
      // console.log(stopid)
      for (let i = startid; i < stopid; i++) {
        // console.log(ruleData[i])
        this.ruleData.push(this.searchData[i])
      }
      // this.ruleData = ruleData
    },
    getBugList () {
      this.bugList = bugClass
    },
    getTotal () {
      this.total = obj.nowid - 1
    }
    // handleSizeChange (newSize) {
    //   // console.log(newSize)
    //   this.queryinfo.pagesize = newSize
    //   this.getuserlist()
    // },
    // handleCurrentChange (newpage) {
    //   this.queryinfo.pagenum = newpage
    //   this.getuserlist()
    // }
  }
}
</script>

<style lang="less" scoped>
.buttons{
  position:absolute;
  line-height: 1;
}
.searchButton{
  float: right;
  margin-right: 0px;
}
.el-form-item{
  width: 100%;
  display: inline-block !important;
}
.el-form-item__label {
  width: 100px;
  line-height: 1;
  padding: 12px 12px 12px 0;
}
.el-form-item__content {
  margin-left: 3px !important;
  margin-right: 3px !important;
}
.el-button {
  margin-left:5px;
  border-radius: 24px;
  font-size: 14px;
}
.el-select ::v-deep{
    width: 100%;
    .el-input__inner{
      border: none;
      border-bottom: 1px solid #dcdfe6;
      border-radius: 0;
      color: #4d4f5c;
      height: 32px;
      line-height: 32px
    }
}
.el-input1 ::v-deep{
  .el-input__inner{
    width: 100%;
    border: none;
    border-bottom: 1px solid #dcdfe6;
    border-radius: 0;
    color: #4d4f5c;
    height: 32px;
    line-height: 32px;
  }
  &:focus {
        border-bottom: 1px solid #409eff;
      }
}
.el-header{
  padding-bottom: 20px;
}
.el-main{
  height: 580px;
  padding: 0px;
  border: 1px solid #dcdfe6;
}
.ruleTable{
  font-size: 14px !important;
}
.el-pagination{
  padding-top:5px;
  padding-right: 5px;
}
#footer1{
  border: 1px solid #dcdfe6 !important;
  text-align:right;
  height: auto;
  padding: 10px;
}
.pagination1{
  border:5px;
  padding: 0px;
  margin-top: 0;
}
.ruleTable /deep/ .el-checkbox{
    .el-checkbox__inner {
      height: 16px;
      width: 16px;
      border-radius: 6px ;
      border: 2px solid
    }
    .el-checkbox__inner::after{
      height: 7px;
      left: 4px;
    }
}
.editButton {
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin: 0 0;
}
</style>
