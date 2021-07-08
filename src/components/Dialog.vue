<template>
  <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" class="addDialog">
    <div class="Dialog">
      <el-steps :active="step" finish-status="success" simple>
        <el-step title="基础配置" icon="el-icon-edit">
        </el-step>
        <el-step title="高级配置" icon="el-icon-setting"></el-step>
      </el-steps>
      <el-form ref="addRule" :rules="addFormRules" :model="addRule" label-width="80px" class="addform">
        <div v-show="step ==0" class="baserule">
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
          <el-form-item></el-form-item>
          <el-form-item></el-form-item>
          <el-form-item></el-form-item>
        </div>
        <div v-show="step ==1" class="morerule">
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
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button @click="prev" v-show="step==1">上一步</el-button>
      <el-button @click="next" v-show="step==0">下一步</el-button>
      <el-button type="primary" @click="submitrule('addRule')" v-if="step==1">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import Vue from 'vue'
import { ruleData, bugClass, obj } from '../assets/js/data.js'
export default {
  props: ['msg'],
  mounted () {
    this.getBugList()
    this.getcreator()
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
        ruleID: '',
        status: '1',
        ruleName: '',
        bugClass: '',
        creator: '',
        createTime: '',
        latest: '',
        rootIP: '',
        destIP: '',
        rootPort: '',
        destPort: '',
        command: ''
      },
      bugList: []
    }
  },
  methods: {
    AaddDialogVisible () {
      this.addDialogVisible = true
    },
    next (evt) {
      let target = evt.target
      if (target.nodeName === 'SPAN') {
        target = evt.target.parentNode
      }
      target.blur()
      this.$refs.addRule.validateField()
      if (this.step++ > 1) this.step = 0
    },
    prev (evt) {
      if (this.step-- < 0) this.step = 1
      let target = evt.target
      if (target.nodeName === 'SPAN') {
        target = evt.target.parentNode
      }
      target.blur()
    },
    getID () {
      this.addRule.ruleID = obj.nowid
      let num = parseInt(obj.nowid)
      num++
      console.log(num)
      obj.nowid = num.toString()
      console.log(obj.nowid)
    },
    getBugList () {
      this.bugList = bugClass
    },
    getcreator () {
      this.addRule.creator = window.sessionStorage.getItem('username')
    },
    rst1 () {
      this.step = 0
      this.addRule.ruleID = ''
      this.addRule.status = '1'
      this.addRule.ruleName = ''
      this.addRule.bugClass = ''
      this.addRule.creator = ''
      this.addRule.createTime = ''
      this.addRule.latest = ''
      this.addRule.rootIP = ''
      this.addRule.destIP = ''
      this.addRule.rootPort = ''
      this.addRule.destPort = ''
      this.addRule.command = ''
    },
    cancle () {
      this.addDialogVisible = false
      setTimeout(this.rst1, 1000)
    },
    changeTimestyle (oldtime) {
      // 时间转换
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
        this.getID()
        this.addRule.latest = this.changeTimestyle(new Date())
        this.addRule.createTime = this.changeTimestyle(new Date())
        this.getcreator()
        console.log(this.addRule)
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
        console.log(obj.rootIP)
        ruleData.push(obj)
        // Vue.set(ruleData, this.addRule)
        // this.$forceUpdate()
        this.addDialogVisible = false
        this.rst1()
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
