<template>
    <div class="login">
        <!-- <div class="bg-mask" :style="{backgroundImage: 'url(' + bg2 + ')'}">           
        </div>         -->
        <div class="bg-mask">      
            <transition name="fade">
                <img v-if="!show" :style="{backgroundImage: 'url(' + bg2 + ')'}">     
            </transition>
        </div>     
        <div class="bg-mask"> 
            <transition name="fade">
                <img v-if="show" :style="{backgroundImage: 'url(' + bg2 + ')'}">
            </transition>
        </div>
        <div class="content-center">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-row>
                    <el-col :span="24"> 
                        <el-form-item prop="username">
                            <i class="el-icon-mobile-phone"></i> 用户名 ：
                            <el-input v-model="ruleForm.username" placeholder="用户名"  class="input_username"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">  
                        <el-form-item prop="password">
                            <i class="el-icon-view" ></i> <span style="padding-right:18px;">密码 ： </span>
                            <el-input v-model="ruleForm.password" type="password" placeholder="密码"  class="input_password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="input_button">
                    <el-col :span="24">  
                        <el-button type="primary" @click="submitForm('ruleForm')">登陆</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-col>
                </el-row>       
            </el-form>                        
        </div>
    </div>
</template>
<script>
var imgIndex = 1;
export default {
    name: 'Login',
    mounted:function(){    
        this.timer = setTimeout(this.changeImg, 4000);
    },
    beforeDestroy:function(){
         clearTimeout(this.timer);
    },
    data() {
      return {
        show: true,
        bg2:'../../static/img/bg'+imgIndex+'.jpg',
        ruleForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名或手机号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
        changeImg:function(){
            var that = this;    
            // 某些定时器操作        
            if(imgIndex<10)
                imgIndex++;                
            else{
                imgIndex = 1;
            }
            that.show = !that.show
            that.bg2 ='../../static/img/bg'+imgIndex+'.jpg';
            that.timer = setTimeout(that.changeImg, 4000);
        },
        submitForm:function(formName) {
            var that = this;    
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.$axios.post(this.baseUrl+'/user/user_login', 
              {
              username: that.ruleForm.username,
              password: that.ruleForm.password
              },
              { responseType: 'json',withCredentials: true}).then(function (response) {
                    if(response.data.ok==1){
                        that.$message(response.data.info);
                        sessionStorage.clear();
                        localStorage.clear();
                        localStorage.token = response.data.info.token;
                        localStorage.username = that.ruleForm.username;
                        sessionStorage['token'] = response.data.info.token
                        sessionStorage['username'] = that.ruleForm.username
                        that.$router.push("/")
                    }else{
                        alert(response.data.info)
                    }
            }).catch(function (error) {
                console.log(error);
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm:function(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
  
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import '../assets/css/login.css';
.fade-enter-active{
  transition: opacity 2s;
}
.el-form-item >>> .el-form-item__error{
    left: 150px;
}
.fade-leave-active {
  transition: opacity 2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
