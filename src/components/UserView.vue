<template>
  <div class="hello">
     <LeftMenu>
      <el-breadcrumb separator="/" style="padding:10px;background-color:#fafafa">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div> 
        <el-form :model="user_new[0]" :rules="rules" ref="ruleForm" :inline="true">
          <el-table highlight-current-row stripe :data="user_new"  :show-header="false"
          class="sub_table" :default-sort = "{prop: 'login_time', order: 'descending'}">
            <el-table-column prop="p_user" label="负责人" >
              <template slot-scope="scope">
                <el-form-item prop="p_user"  label="负责人">
                  <el-input v-model="scope.row.p_user" placeholder="负责人"></el-input>   
                </el-form-item>   
              </template>
            </el-table-column>
            <el-table-column prop="nickname" label="调查人">
              <template slot-scope="scope">
                <el-form-item prop="nickname" label="调查人">
                  <el-input v-model="scope.row.nickname" placeholder="调查人"></el-input> 
                </el-form-item>     
              </template>
            </el-table-column>
            <el-table-column prop="tel" label="手机">
              <template slot-scope="scope">
                <el-form-item prop="tel" label="手机">
                  <el-input v-model="scope.row.tel" placeholder="手机"></el-input>     
                </el-form-item> 
              </template>
            </el-table-column>
            <el-table-column prop="password" label="密码">
              <template slot-scope="scope">
                <el-form-item prop="password" label="密码">
                  <el-input v-model="scope.row.password" type="password" 
                            placeholder="密码" ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="dept" label="备注">
              <template slot-scope="scope">
                <el-form-item prop="dept" label="备注">
                <el-input v-model="scope.row.dept" placeholder="备注" ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="dept" label="操作" width="150" >
              <template>
                <el-form-item label="操作">
                  <el-button type="primary" style="float:left" @click="addUser('ruleForm')">添加用户</el-button>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>    
        </el-form>      
      </div>
      <el-breadcrumb separator="/" style="padding:10px;background-color:#fafafa">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table highlight-current-row stripe :data="user_list" 
        class="sub_table" :default-sort = "{prop: 'login_time', order: 'descending'}">
        <el-table-column prop="p_user" label="负责人" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.p_user" placeholder="负责人"></el-input>      
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="调查人" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.nickname" placeholder="调查人"></el-input>      
          </template>
        </el-table-column>
        <el-table-column prop="tel" label="手机" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.tel" placeholder="手机"></el-input>      
          </template>
        </el-table-column>
        <el-table-column prop="new_password" label="密码" width="150" >
           <template slot-scope="scope">
            <el-input v-model="scope.row.new_password" type="password" 
                        placeholder="密码" ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="dept" label="备注" width="150" >
           <template slot-scope="scope">
            <el-input v-model="scope.row.dept" placeholder="备注" ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="dept" label="操作" width="150" >
           <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle @click="editUser(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="delUser(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>      
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
            background
          :current-page="page_index"
          :page-sizes="[10, 50, 100]"
          :page-size="page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page_total" style="margin:20px">
        </el-pagination>
      </div>
      <div style="margin:50px;"></div>
     </LeftMenu>
  </div>
</template>

<style scoped>
   .report-el-row {
     border: solid 1px #f0f0f0;
     background: #fdfdfd;
   }
    .report-el-row .el-row{
     padding-left: 3px;
   }
</style>

<script>
import LeftMenu from '../components/menu/LeftMenu'
  export default {
    mounted:function(){
       this.updateUserInfos()
    },
    data() {
      return {
        user_list:[],
        user_new:[{
          'dept':'',
          'p_user':'',
          'nickname':'',
          'username':'',
          'tel':'',
          'password':'',
          'is_wx':2
        }],
        page_index:1,
        page_size:10,
        page_total:100,
        activeNames: ['1'],
        rules:{
          tel: [
            { required: true, message: '请输入电话', trigger: 'blur' },
          ],
          nickname: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
          ]
          ,p_user: [
            { required: true, message: '请输入负责人', trigger: 'blur' },
          ]
          ,password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
          ]
        }
      }
    },
    methods: {     
      delUser:function(id){
         let that = this
         this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          that.$axios.post(this.baseUrl + '/user/ht_delete_user', 
          {
            params:{
            'id': id
            }      
            },{withCredentials: true}).then(function (response) {
              if(response.data.ok==1){
               that.$message({
                type: 'info',
                message: '删除成功'
              });
                that.updateUserInfos()
              }else{
                  alert(response.data.info)
              }
            }).catch(function (error) {
                console.log(error);
            });
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: e
            });
          });
      },
      addUser:function(formName){
        var that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
             console.log('error submit!!');
            return false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        let user = that.user_new[0]
        that.$axios.post(this.baseUrl+'/user/ht_update_user', 
        {          
          params:{
           'user_new': user
          }      
        },{withCredentials: true}).then(function (response) {
          if(response.data.ok==1){
            alert("添加成功")
            that.updateUserInfos()
          }else{
              alert(response.data.info)
          }
        }).catch(function (error) {
            console.log(error);
        });
      },
      editUser:function(id){
        var that = this;
        let user
        that.user_list.forEach(u => {
          if(u.id === id){
            user = u
          }
        });
        if(!user.tel || user.tel.trim() == "" || user.tel.trim().length<=0){
           that.$message({type: 'error',message: '电话不能为空!'});
          return 
        }
        if(!user.p_user || user.p_user.trim() == "" || user.p_user.trim().length<=0){
           that.$message({type: 'error',message: '负责人不能为空!'});
          return 
        }
        if(!user.nickname || user.nickname.trim() == "" || user.nickname.trim().length<=0){
           that.$message({type: 'error',message: '调查人不能为空!'});
          return 
        }
        that.$axios.post(this.baseUrl + '/user/ht_update_user',
        {
          params:{
           'user_new': user
          }      
        },{ responseType: 'json',withCredentials: true}).then(function (response) {
          if(response.data.ok==1){
            alert("修改成功")
            that.updateUserInfos()
          }else{
              alert(response.data.info)
          }
        }).catch(function (error) {
            console.log(error);
        });
      },
      jumpMap:function(cata_id){
        
      },
      handleSizeChange(val) {
        this.page_size = val;
        this.updateUserInfos()
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.page_index = val;
        this.updateUserInfos()
        console.log(`当前页: ${val}`);
      },
      updateUserInfos:function(){
        var that = this;
        that.$axios.get(this.baseUrl + '/user/ht_user_infos', 
        {
          params:{
            'page_index': that.page_index,
            'page_size': that.page_size,
          }      
        },{withCredentials: true}).then(function (response) {
              if(response.data.ok==1){
                  that.user_list = response.data.info;
                  that.page_total =  response.data.page_total;
              }else{
                  alert(response.data.info)
              }
        }).catch(function (error) {
            console.log(error);
        });
      }
    },
    components: {
      LeftMenu
    }
  };
</script>