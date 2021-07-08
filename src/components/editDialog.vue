<template>
  <el-dialog title="编辑数据" :visible.sync="addDialogVisible" width="50%" class="addDialog">
    <div class="Dialog">
      <el-form ref="addRule" :rules="addFormRules" :model="addRule" label-width="80px" class="addform">
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="addRule.ruleName" width="200px" clearable></el-input>
        </el-form-item>
        <el-form-item label="启动状态" prop="status">
          <el-switch v-model="addRule.status" active-value="1" inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="告警分类" prop="bugClass">
          <el-select v-model="addRule.bugClass">
            <el-option v-for="item in bugList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="源IP" prop="rootIP">
          <el-input v-model="addRule.rootIP" width="200px" clearable></el-input>
        </el-form-item>
        <el-form-item label="源端口" prop="rootPort">
          <el-input v-model="addRule.rootPort" width="200px" clearable></el-input>
        </el-form-item>
        <el-form-item label="目的IP" prop="destIP">
          <el-input v-model="addRule.destIP" width="200px" clearable></el-input>
        </el-form-item>
        <el-form-item label="目的端口" prop="destPort">
          <el-input v-model="addRule.destPort" width="200px" clearable></el-input>
        </el-form-item>
        <el-form-item label="指令" prop="command">
          <el-input v-model="addRule.command" width="200px" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="submitrule('addRule')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import Vue from 'vue'
import { ruleData, bugClass } from '../assets/js/data.js'
export default {
  props: ['msg'],
  mounted () {
    this.getBugList()
    this.getEditRule()
  },
  watch: {
    msg: function (newval) {
      this.addRule = newval
    }
  },
  components: {
  },
  data () {
    var checkNum = (rule, value, cb) => {
      const regNum = /^[1-9]\d*$/
      if (regNum.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的端口号'))
    }
    var checkIP = (rule, value, cb) => {
      const regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      if (regIP.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的IP'))
    }
    return {
      addFormRules: {
        ruleName: [
          { required: true, message: '请输入规则', trigger: 'blur' }
        ],
        bugClass: [
          { required: true, message: '请选择告警分类', trigger: 'blur' }
        ],
        rootIP: [
          { required: true, message: '请输入源IP', trigger: 'blur' },
          { validator: checkIP, trigger: 'blur' }
        ],
        rootPort: [
          { required: true, message: '请输入源端口', trigger: 'blur' },
          { validator: checkNum, trigger: 'blur' }
        ],
        destIP: [
          { required: true, message: '请输入目的IP', trigger: 'blur' },
          { validator: checkIP, trigger: 'blur' }
        ],
        destPort: [
          { required: true, message: '请输入目的端口', trigger: 'blur' },
          { validator: checkNum, trigger: 'blur' }
        ],
        command: [
          { required: true, message: '请输入指令', trigger: 'blur' }
        ]
      },
      addDialogVisible: false,
      step: 0,
      hasNew: false,
      addRule: {
        ruleID: this.msg.ruleID,
        status: this.msg.status,
        ruleName: this.msg.ruleName,
        bugClass: this.msg.bugClass,
        creator: this.msg.creator,
        createTime: this.msg.createTime,
        latest: this.msg.latest,
        rootIP: this.msg.rootIP,
        destIP: this.msg.destIP,
        rootPort: this.msg.rootPort,
        destPort: this.msg.destPort,
        command: this.msg.command
      },
      bugList: []
    }
  },
  methods: {
    getEditRule () {
      this.addRule = this.msg
      this.addRule.rootIP = this.msg.rootIP
      this.addRule.destIP = this.msg.destIP
    },
    AaddDialogVisible () {
      this.addDialogVisible = true
    },
    getBugList () {
      this.bugList = bugClass
    },
    cancle () {
      this.addDialogVisible = false
    },
    changeTimestyle (oldtime) {
      var datejson = new Date(oldtime).toJSON()
      var date = new Date(new Date(datejson) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      return date
    },
    submitrule (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        for (const items of bugClass) {
          if (this.addRule.bugClass === items.value) {
            this.addRule.bugClass = items.label
          }
        }
        this.addRule.latest = this.changeTimestyle(new Date())
        const obj = {
          ruleID: this.addRule.ruleID,
          status: this.addRule.status,
          ruleName: this.addRule.ruleName,
          bugClass: this.addRule.bugClass,
          creator: this.addRule.creator,
          createTime: this.addRule.createTime,
          latest: this.addRule.latest,
          rootIP: this.addRule.rootIP,
          destIP: this.addRule.destIP,
          rootPort: this.addRule.rootPort,
          destPort: this.addRule.destPort,
          command: this.addRule.command
        }
        for (let item of ruleData) {
          if (item.ruleID === obj.ruleID) {
            item = obj
          }
        }

        // ruleData.push(obj)
        // Vue.set(ruleData, this.addRule)
        // this.$forceUpdate()
        this.addDialogVisible = false
        this.$emit('reloadRuleData')
      }
      )
    }
  }
}
</script>
<style lang="less">
.baserule{
  margin: 20px;
  .el-input{
    width: 300px;
  }
  .el-form-item__content{
    height: 36px;
    display:flex;
    align-items: center;
  }
}
.morerule{
  margin: 20px;
  .el-input{
    width: 300px;
  }
  .el-form-item__content{
    height: 36px;
    display:flex;
    align-items: center;
  }
}
</style>
