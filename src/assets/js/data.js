var ruleData = [
  {
    ruleID: '1',
    status: '1',
    ruleName: '默认漏洞',
    bugClass: '漏洞',
    creator: 'admin',
    createTime: '2020-07-14 15:45:17',
    latest: '2020-07-14 15:50:11',
    rootIP: '0.0.0.1',
    destIP: '0.0.0.1',
    rootPort: '1117',
    destPort: '1114',
    command: ''
  }, {
    ruleID: '2',
    status: '2',
    ruleName: '默认漏洞',
    bugClass: '漏洞',
    creator: 'admin',
    createTime: '2020-07-14 15:45:17',
    latest: '2020-07-14 15:50:11',
    rootIP: '0.0.0.1',
    destIP: '0.0.0.1',
    rootPort: '1117',
    destPort: '1114',
    command: ''
  }
]
var obj = {
  nowid: '3'
}
var bugClass = [{
  value: '1',
  label: '漏洞'
}, {
  value: '2',
  label: '网站可用性'
}]
export {
  ruleData, bugClass, obj
}
export function addrule (ruledata) {
  ruleData.push(ruledata)
}
export default {
  data () {
    return {
      ruleData
    }
  }
}
