<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar-box">
                <img src="../assets/logo.png">
            </div>
            <el-form ref="loginFormRef" :model="loginform" :rules="rules" label-width="0px" class="login_form">
                <el-form-item prop="username" >
                    <el-input placeholder="请输入账号" v-model="loginform.username" prefix-icon="iconfont icon-yonghu"></el-input>
                </el-form-item>
                <el-form-item prop="password" >
                    <el-input placeholder="请输入密码" v-model="loginform.password" prefix-icon="iconfont icon-mima" show-password></el-input>
                </el-form-item>
                <el-form-item class="btn">
                    <el-button type="primary" @click="submitForm('loginFormRef')">登陆</el-button>
                    <el-button type="info" @click="resetForm('loginFormRef')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginform: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '输入的账号为空！', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '输入的密码为空！', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        try {
          const { data: res } = await this.$http.post('login', this.loginform)
          if (res.meta.status !== 200) return this.$message.error('用户名或密码错误！')
          this.$message.success('登录成功！')
          console.log(res)
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        } catch (error) {
          this.$message.error('网络出了点小问题哦！')
        }
      })
    },
    resetForm (formName) {
      console.log(this)
      this.$refs[formName].resetFields()
    }
  }
}

</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}

.login_box{
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}

.avatar-box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: white;
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
}

.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.btn{
    display: flex;
    justify-content: flex-end;
}

</style>
