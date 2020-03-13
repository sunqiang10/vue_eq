<template>
  <div class="hello">
     <LeftMenu>
      <el-breadcrumb separator="/" style="padding:10px;background-color:#fafafa">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>灾情数据</el-breadcrumb-item>
      </el-breadcrumb> 
      <el-table highlight-current-row stripe :data="eq_list" :show-header="false"
          :row-key="getRowKey" :expand-row-keys="expandRows"
          @row-click="selectHandle" ref="mainTable"
          class="main_table" :default-sort = "{prop: 'O_time', order: 'descending'}">
          <el-table-column type="expand" style="padding:0px">
            <template slot-scope="props">
              <el-table highlight-current-row stripe border :data="props.row.reports" 
                class="sub_table" :default-sort = "{prop: 'updatetime', order: 'descending'}">
                <el-table-column label="" width="30">
                  <template slot-scope="scope">
                      <el-checkbox :label="scope.row.id" name="chooseReport"></el-checkbox>                 
                  </template>
                </el-table-column>
                <el-table-column prop="updatetime" :formatter="formatDate" label="日期" width="85"></el-table-column>
                <el-table-column prop="user.p_user" label="负责人" width="60"></el-table-column>
                <el-table-column prop="user.nickname" label="调查人" width="60"></el-table-column>
                <el-table-column prop="user.tel" label="手机" width="95"></el-table-column>
                <el-table-column prop="c_addr" label="地址" width="140" ></el-table-column>
                <el-table-column prop="currenLat" label="北纬" width="60" :formatter="formatLat"></el-table-column>
                <el-table-column prop="currenLon" label="东经" width="60" :formatter="formatLng"></el-table-column>

                <el-table-column prop="death_count" label="死亡人数" width="45"></el-table-column>
                <el-table-column prop="injured_count" label="重伤人数" width="45"></el-table-column>
                <el-table-column prop="wound_count" label="轻伤人数" width="45"></el-table-column>
                <el-table-column prop="death_cause" label="死亡原因" width="70" ></el-table-column>
                <el-table-column prop="house_type" label="房屋结构" width="50"></el-table-column>
                <el-table-column prop="house" label="破坏程度" width="50"></el-table-column>
                <el-table-column prop="intensity" label="初判烈度" width="50"></el-table-column>
                <el-table-column prop="content" label="其他" width="70"></el-table-column>
                <el-table-column prop="pic_path" label="图片" width="70">
                  <template slot-scope="scope">
                  <div v-if="scope.row.pic_path" >
                        <span v-for="img in formatImgs(scope.row.pic_path)" :key="img.index" >
                          <a v-bind:href="bUrl+img" target="_blank">
                            <img v-bind:src="bUrl+img" class="image" 
                              :style="'width:'+100/(formatImgs(scope.row.pic_path).length)+'%;'">
                          </a>
                        </span>
                      </div>
                  </template>
                </el-table-column>   
                <el-table-column prop="pic_path" label="操作" width="95">
                  <template slot-scope="scope">
                    <el-button type="mini" icon="el-icon-edit" circle @click="handleEdit(scope.row.id)"></el-button>
                    <el-button type="mini" icon="el-icon-delete" circle @click="handleDel(scope.row.id)"></el-button>
                  </template>
                </el-table-column>                    
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label=""> 
            <template slot-scope="scope">
              <i class="el-icon-location"></i>
              <span style="width:90%;text-align:left;margin-left:10px">
                {{scope.row.Location_cname}} , 在{{scope.row.O_time|dateformat('YYYY年MM月DD HH时mm分')}} 
                发生<span style="font-weight:bold" >&nbsp;{{scope.row.M}}&nbsp;</span>级地震 ，
                {{formatLng4EQ(scope.row.Lon)}},{{formatLat4EQ(scope.row.Lat)}} 
                ，震源深度{{scope.row.Depth}} 公里 
              </span>
            </template>
          </el-table-column>

          <el-table-column label="" width="40"> 
            <template slot-scope="scope">
              <el-badge :value="scope.row.reports.length" style="float：right"  v-if="scope.row.reports.length>0"/>
            </template>
          </el-table-column>

          <el-table-column label="" width="200"> 
            <template slot-scope="scope">
              <el-button type="mini" @click="jumpMap(scope.row.cata_id)">地图</el-button>
              <el-button size="mini" @click="handleExport()">导出</el-button>
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

<style>
   @import '../assets/css/Index.css';
   .report-el-row {
     border: solid 1px #f0f0f0;
     background: #fdfdfd;
   }
    .report-el-row .el-row{
     padding-left: 3px;
   }
   .el-table__expanded-cell[class*=cell]{
     padding: 0px;
   }
   .main_table{
     width: 100%;font-size:12px
   }
   .sub_table{
      width: 100%;font-size:12px
   }
</style>

<script>
import LeftMenu from '../components/menu/LeftMenu'
import moment from 'moment'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

  export default {
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
        checkboxGroup6: [],
        expandRows:[],
        bUrl:this.baseUrl
      }
    },
    methods: {
      jumpMap:function(cata_id){
        this.$router.push({path: '/bdmap', query: {cata_id: cata_id}})
      },
      handleEdit:function(id){
        this.$router.push({path: '/reportEdit', query: {id: id}})
      },
      handleDel(id) {
        var _this = this
        this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          _this.$axios.get(this.baseUrl + '/report/delete_reports', 
          {
            params:{
              'id':id
            }      
          },{withCredentials: true}).then(function (response) {
              var json = response.data ;
              if(json.ok==1){
                _this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                _this.updateEqInfo()
              }else{
                  alert(json.info)
              }
          }).catch(function (error) {
              console.log(error);
          });         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
        that.$axios.get(this.baseUrl + '/report/ht_eq_infos', 
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
      },
      formatDate(dataStr) {
          return moment(dataStr.updatetime).utc().format('YYYY-MM-DD HH:mm:ss')
      },
      formatLat(dataStr){    
        if (dataStr.currenLat < 0) {
            return (0 - dataStr.currenLat.toFixed(2));
        } else {
            return dataStr.currenLat.toFixed(2);
        }
      },
      formatLng(dataStr){
        if (dataStr.currenLon < 0) {
            return (0 - dataStr.currenLon.toFixed(2));
        } else {
            return dataStr.currenLon.toFixed(2);
        }
      },
      formatLat4EQ(dataStr){    
        if (dataStr < 0) {
            return "南纬" + (0 - dataStr.toFixed(2)) + "度";
        } else {
            return "北纬" + dataStr.toFixed(2) + "度";
        }
      },
      formatLng4EQ(dataStr){
        if (dataStr < 0) {
            return "西经" + (0 - dataStr.toFixed(2)) + "度";
        } else {
            return "东经" + dataStr.toFixed(2) + "度";
        }
      },
      handleExport:function(){
        // var inputs=document.getElementsByName("chooseReport");
        // for(var i=0, len=inputs.length;i<len;i++){//inputs是动态数组，每次循环都会重新访问dom树，用len保存优化JS
        //     if(inputs[i].checked){
        //         let checkVal=inputs[i].value;
        //         console.log(checkVal);
        //     }
        // }
        // for (let index = 0; index < this.checkboxGroup6.length; index++) {
        //   let element = this.checkboxGroup6[index];
        //   console.log(element);
        // }
        /* generate workbook object from table */
        //表名
        var wb = XLSX.utils.table_to_book(document.querySelector('.sub_table'))
        /* get binary string as output */
        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'order.xlsx')
        } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
        return wbout
      },
      selectHandle:function(row, event, column){        
        if(this.expandRows.indexOf(row.cata_id)>=0){
          let index = this.expandRows.indexOf(row.cata_id)
          console.log(index)
          this.expandRows.splice(index,1);
        }else{
          this.expandRows.push(row.cata_id);
        }
        console.log(this.expandRows)
      },
      getRowKey (row) {
        return row.cata_id
      }
    },
    components: {
      LeftMenu
    }
  };
</script>