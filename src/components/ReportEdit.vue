<template>
  <div class="hello">
     <LeftMenu>
      <el-breadcrumb separator="/" style="padding:10px;background-color:#fafafa">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">数据列表</el-breadcrumb-item>
        <el-breadcrumb-item>修改数据</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form :model="reportInfo" :rules="rules" ref="ruleForm" label-width="80px" style="margin:20px;" size="mini">
        <el-form-item label="上报地点" style="width:500px;" prop="c_addr">
          <el-input v-model="reportInfo.c_addr" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="经度" style="width:500px;" prop="currenLon">
          <el-input v-model.number="reportInfo.currenLon"></el-input>
        </el-form-item>
        <el-form-item label="纬度" style="width:500px;"  prop="currenLat">
          <el-input v-model.number="reportInfo.currenLat"></el-input>
        </el-form-item>
        <el-form-item label="死亡人数" style="width:400px;">
          <el-input-number size="medium" style="width:420px;" v-model="reportInfo.death_count" :step="10"></el-input-number>          
        </el-form-item>
        <el-form-item label="死亡原因" style="width:500px;">
          <el-input  v-model="reportInfo.death_cause" ></el-input>
        </el-form-item>
        <el-form-item label="重伤人数" style="width:400px;">
          <el-input-number size="medium" style="width:420px;"  v-model="reportInfo.injured_count" :step="10"></el-input-number>
        </el-form-item>
        <el-form-item label="轻伤人数" style="width:400px;">
          <el-input-number size="medium" style="width:420px;"  v-model="reportInfo.wound_count" :step="10"></el-input-number>
        </el-form-item>
        <el-form-item label="房屋结构" style="width:500px;">
          <el-select v-model="reportInfo.house_type" placeholder="请选择房屋结构" style="width:420px;">
            <el-option label="钢混" value="钢混"></el-option>
            <el-option label="砖混" value="砖混"></el-option>
            <el-option label="砖木" value="砖木"></el-option>
            <el-option label="土木" value="土木"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
           <el-form-item label="破坏程度" style="width:500px;">
          <el-select v-model="reportInfo.house" placeholder="请选择破坏程度" style="width:420px;">
            <el-option label="毁坏" value="毁坏"></el-option>
            <el-option label="严重破坏" value="严重破坏"></el-option>
            <el-option label="中等破坏" value="中等破坏"></el-option>
            <el-option label="轻微破坏" value="轻微破坏"></el-option>
            <el-option label="基本完好" value="基本完好"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="初判烈度" style="width:500px;">
          <el-select v-model="reportInfo.intensity" placeholder="请选择" style="width:420px;">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
            <el-option label="6" value="6"></el-option>
            <el-option label="7" value="7"></el-option>
            <el-option label="8" value="8"></el-option>
            <el-option label="9" value="9"></el-option>
            <el-option label="10" value="10"></el-option>
            <el-option label="11" value="11"></el-option>
            <el-option label="12" value="11"></el-option>
          </el-select>
        </el-form-item>
       
        <el-form-item label="上报时间" style="width:500px;">
          <el-col :span="11">
            <el-date-picker type="datetime" placeholder="选择日期"
             v-model="reportInfo.updatetime" style="width:420px;">
            </el-date-picker>
          </el-col>
        </el-form-item>        
        <el-form-item label="其他" style="width:500px;">
          <el-input type="textarea" v-model="reportInfo.content"></el-input>
        </el-form-item>
        <el-upload :action="bUrl+'/report/update_img'" ref="upload"
          style="width:500px;"
          list-type="picture-card" 
          :before-remove="beforeRemove"
          :on-preview="handlePictureCardPreview" 
          :on-remove="handleChange"
          :on-success="handleSuccess"
          :file-list="formatImgs()"
          accept=".jpg, .jpeg, .png, .gif, .bmp, .JPG, .JPEG, .PBG, .GIF, .BMP"
          :with-credentials='true'
          :http-request='customUpload'
          >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-form-item>
          <el-button type="primary" @click="updateReportById('ruleForm')">修改</el-button>
          <el-button  @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>      
      <div style="margin:50px;"></div>
     </LeftMenu>
  </div>
</template>

<style>

</style>

<script>
import LeftMenu from '../components/menu/LeftMenu'
  export default {
    mounted:function(){      
      this.reportId = this.$route.query.id
      this.getReportById()
    },
    data() {
      return {
        p_username:sessionStorage['username'],
        reportId:0,
        reportInfo:{},
        dialogImageUrl: '',
        dialogVisible: false,
        bUrl:this.baseUrl,
        rules:{
          c_addr: [
            { required: true, message: '请输入地点', trigger: 'blur' },
          ],
          currenLat: [
            { type: 'number',required: true, message: '请正确输入纬度', trigger: 'change' }
          ],
          currenLon: [
            { type: 'number', required: true, message: '请正确输入经度', trigger: 'change' }
          ]
        },
        myHeader: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    },
    methods: {  
      customUpload:function(params){
        var that = this
        ,file = params.file
        ,fileType = file.type
        var index = that.$refs.upload.uploadFiles.length;
        var file_url = that.$refs.upload.uploadFiles[index-1].url;
        // console.log(file_url)
       
        let formData = new FormData();
        formData.append('file', file);
        that.$axios.post(that.bUrl+'/report/update_img'
        , formData, 
        { headers: { 'Content-Type': 'multipart/form-data' }})
        .then(function (res) {
          that.$refs.upload.uploadFiles[index-1].url = res.data.info
          that.handleSuccess(res.data, file, that.$refs.upload.uploadFiles)
        })
      },
      handleSuccess(response, file, fl) {
        if(response && response.ok==1){
          file.url = response.info
          let path = "";
          let old_imgs = "";   
          fl.forEach(element => {
            path = path +','+ element.url.replace(this.baseUrl,'')     
            old_imgs = old_imgs +','+ element.name
          });
          if(path.length>0){
            this.reportInfo.pic_path = path.substring(1)
            this.reportInfo.old_pic_path = old_imgs.substring(1)
          }
        }else{
          alert(response.info)
        }       
      },
      handleChange(file, fl) {
        let path = "";
        fl.forEach(element => {
          path = path +','+ element.url.replace(this.baseUrl,'')      
        });
        if(path.length>0){
          this.reportInfo.pic_path = path.substring(1)
        }
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },  
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },    
      formatImgs:function(){
        let fileList=[];
        if(this.reportInfo && this.reportInfo.pic_path){
          let imgs = this.reportInfo.pic_path.split(',')  
          if(this.reportInfo.old_pic_path){
            let old_imgs = this.reportInfo.old_pic_path.split(',')    
            for (let index = 0; index < imgs.length; index++) {
              let path = imgs[index]
              fileList.push({'name':old_imgs[index] , url:  this.baseUrl+path})           
            }
          }         
        }         
        return fileList      
      }
      ,getReportById:function(){
        var that = this;
        that.$axios.get(this.baseUrl+'/report/ht_reports_by_id', 
        {
          params:{
            'id': that.reportId
          }      
        },{withCredentials: true}).then(function (response) {
            var json = eval('(' + response.data + ')');
            if(json.ok==1){
                that.reportInfo = json.info;
            }else{
                alert(json.info)
            }
        }).catch(function (error) {
            console.log(error);
        });
      }
      ,updateReportById:function(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        var that = this;
        that.$axios.get(this.baseUrl + '/report/update_reports', 
        {
          params:{
            'reportInfo':that.reportInfo
          }      
        },{withCredentials: true}).then(function (response) {
            var json = eval('(' + response.data + ')');
            if(json.ok==1){
                alert('保存成功')
                that.$router.replace('/')
            }else{
                alert(json.info)
            }
        }).catch(function (error) {
            console.log(error);
        });
      },
      resetForm(formName) {
        // this.$refs[formName].resetFields();
        this.$router.go(-1)
      }
    },
    components: {
      LeftMenu
    }
  };
</script>