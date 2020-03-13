<template>
  <div class="hello">
     <LeftMenu>
      <el-breadcrumb separator="/" style="padding:10px;background-color:#fafafa">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>灾情数据</el-breadcrumb-item>
      </el-breadcrumb>
      <el-collapse v-model="activeNames" @change="handleChange" accordion>
        <el-collapse-item :key="eq_info.id" v-for="(eq_info,index) in eq_list" :name="index"
                                style="border-right: none">
          <template slot="title">
            <i class="el-icon-location"></i>
            <div style="width:90%;text-align:left;margin-left:10px">
            {{eq_info.Location_cname}} , 在{{eq_info.O_time|dateformat('YYYY年MM月DD HH时mm分')}} 
            发生<span style="font-weight:bold" >&nbsp;{{eq_info.M}}&nbsp;</span>级地震 ， 经度：{{eq_info.Lon}},纬度{{eq_info.Lat}} 
            ，震源深度{{eq_info.Depth}} 公里 
            </div>
            <el-badge :value="eq_info.reports.length" style="float：right"  v-if="eq_info.reports.length>0"/>
          </template>
          <div>
            <el-row>
              <div v-for="report in eq_info.reports" :key="report.index"  >
                <el-col :span="6" style="padding:2px;">
                  <el-card :body-style="{ padding: '5px' }">
                    <div v-if="report.pic_path" >
                      <span v-for="img in formatImgs(report.pic_path)" :key="img.index" >
                        <a v-bind:href="bUrl+img" target="_blank">
                          <img v-bind:src="bUrl+img" class="image" 
                            :style="'width:'+100/(formatImgs(report.pic_path).length)+'%;'">
                        </a>
                      </span>
                    </div>
                    <div v-else >
                      <img  v- src="../../static/img/nopic.png" style="width:100px;height:100px">
                    </div>
                    <div style="padding: 1px;text-align:left"  class="report-el-row">
                      <el-row>
                        <el-col :span="8"><div class="grid-content bg-purple">烈度:</div></el-col>
                        <el-col :span="16"><div class="grid-content bg-purple-light">{{report.intensity}}</div></el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8"><div class="grid-content bg-purple">震感:</div></el-col>
                        <el-col :span="16"><div class="grid-content bg-purple-light">{{report.fell}}</div></el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8"><div class="grid-content bg-purple">房屋损失:</div></el-col>
                        <el-col :span="16"><div class="grid-content bg-purple-light">{{report.house}}</div></el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8"><div class="grid-content bg-purple">人员伤亡:</div></el-col>
                        <el-col :span="16"><div class="grid-content bg-purple-light">{{report.person}}</div></el-col>
                      </el-row>
                        <el-row>
                        <el-col :span="8"><div class="grid-content bg-purple">上报地点:</div></el-col>
                        <el-col :span="16"><div class="grid-content bg-purple-light">{{report.c_addr}}</div></el-col>
                      </el-row>
                        <el-row>
                        <el-col :span="8"><div class="grid-content bg-purple">经纬度:</div></el-col>
                        <el-col :span="16"><div class="grid-content bg-purple-light">{{report.currenLon}}，{{report.currenLat}}</div></el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8"><div class="grid-content bg-purple">其他:</div></el-col>
                        <el-col :span="16"><div class="grid-content bg-purple-light">{{report.content}}</div></el-col>
                      </el-row>
                        <el-row>
                        <el-col :span="8">
                          <div class="grid-content bg-purple">
                            <el-button type="text" class="button" style="height:20px;padding:0px" 
                        v-on:click="jumpMap(report.cata_id)">查看地图</el-button>
                          </div>
                        </el-col>
                        <el-col :span="16"><div class="grid-content bg-purple-light"></div></el-col>
                      </el-row>
                    </div>
                  </el-card>
                </el-col>
              </div>
            </el-row>
          </div>
        </el-collapse-item>   
      </el-collapse>
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

<style>
   @import '../assets/css/Index.css';
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
    name: 'ReportView',
    mounted:function(){
       this.updateEqInfo()
    },
    data() {
      return {
        p_username:sessionStorage['username'],
        eq_list:[],
        page_index:1,
        page_size:10,
        page_total:100,
        activeNames: ['1'],
        bUrl:this.baseUrl
      }
    },
    methods: {
      handleChange(val) {
        console.log(val);
      },
      jumpMap:function(cata_id){
        // let newPage = this.$router.resolve({name: '/login', params: {id: id}})
        // window.open(newPage.href,'_blank')
        this.$router.push({path: '/bdmap', query: {cata_id: cata_id}})
      },
      handleSizeChange(val) {
        this.page_size = val;
        this.updateEqInfo()
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.page_index = val;
        this.updateEqInfo()
        console.log(`当前页: ${val}`);
      },
      updateEqInfo:function(){
        var that = this;
        that.$axios.get(this.baseUrl+'/report/ht_eq_infos', 
        {
          params:{
            'page_index': that.page_index,
            'page_size': that.page_size,
            'is_wx':1,
          }      
        },{withCredentials: true}).then(function (response) {
              if(response.data.ok==1){
                  that.eq_list = response.data.info;
                  that.page_total =  response.data.page_total;
              }else{
                  alert(response.data.info)
              }
        }).catch(function (error) {
            console.log(error);
        });
      },
      formatImgs:function(value){
          return value.split(',')              
      }
    },
    components: {
      LeftMenu
    }
  };
</script>