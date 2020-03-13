<template>
  <div class="hello">
    <LeftMenu>       
      <el-breadcrumb separator="/" style="padding:10px;background-color:#fafafa">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">灾情数据</el-breadcrumb-item>
        <el-breadcrumb-item>查看地图</el-breadcrumb-item>
      </el-breadcrumb>
      <div id="allmap"></div> 
      <div v-for="report in reports" :key="report.index" :id='"custom_div_"+report.id' class="custom_div">
        <el-card :body-style="{ padding: '5px' }">
          <div v-if="report.pic_path" >
            <span v-for="img in formatImgs(report.pic_path)" :key="img.index" >
              <a v-bind:href="bUrl+img" target="_blank">
                <img v-bind:src="bUrl+img" class="image" 
                  :style="'width:'+100/(formatImgs(report.pic_path).length)
                  +'%;height:'+100/(formatImgs(report.pic_path).length)+'%;'">
              </a>
            </span>
          </div>
          <div v-else >
            <img  v- src="../../static/img/nopic.png" style="width:100%;">
          </div>
          <div style="padding: 1px;text-align:left;font-size:12px;"  class="report-el-row">
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
          </div>
        </el-card>
      </div>           
    </LeftMenu>    
  </div>
</template>

<style>
#allmap{
  width:100%;
  height: 95%;
}
.custom_div{
  position:absolute;
  width: 50px;
  height: 50px;
  overflow: hidden;
  top: 0px;
  left: 0px;
  /* display: none; */
}
.report-el-row div{
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
}
</style>

<script>
import LeftMenu from '../components/menu/LeftMenu'
// import loadJs from '../utils/loadJs'
import BaiduMap from 'BMap'
  export default {
    data() {
      return {
        reportId:0,
        reports:[],
        bUrl:this.baseUrl
      }
    },
    methods: {
      initEqMap:function() {
        // loadJs('http://api.map.baidu.com/api?v=3.0&ak=xCbW6W90R0cuQuw4QddGlbbN').then(()=>{
        //   var map = new BMap.Map("allmap");
        // })
        let _this = this
        
        _this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 7);
        // 添加带有定位的导航控件
        var navigationControl = new BMap.NavigationControl({
          // 靠左上角位置
          anchor: BMAP_ANCHOR_TOP_LEFT,
          // LARGE类型
          type: BMAP_NAVIGATION_CONTROL_LARGE,
             // 启用显示定位
          enableGeolocation: true
        });
        _this.map.addControl(navigationControl);
        _this.map.enableScrollWheelZoom();     //关闭鼠标滚轮缩放
        // 添加定位控件
        var geolocationControl = new BMap.GeolocationControl();
        geolocationControl.addEventListener("locationSuccess", function(e){
          // 定位成功事件
          var address = '';
          address += e.addressComponent.province;
          address += e.addressComponent.city;
          address += e.addressComponent.district;
          address += e.addressComponent.street;
          address += e.addressComponent.streetNumber;          
        });

        geolocationControl.addEventListener("locationError",function(e){
          // 定位失败事件
          alert(e.message);
        });
        _this.map.addControl(geolocationControl);
        var geolocation = new BMap.Geolocation()
        geolocation.getCurrentPosition(function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            const myGeo = new BMap.Geocoder()
            myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), data => {
              if (data.addressComponents) {
                const result = data.addressComponents                
                const location = {
                  creditLongitude: r.point.lat, // 经度
                  creditLatitude: r.point.lng, // 纬度
                  creditProvince: result.province || '', // 省
                  creditCity: result.city || '', // 市
                  creditArea: result.district || '', // 区
                  creditStreet: (result.street || '') + (result.streetNumber || '') // 街道
                }
                let signlocation = location.creditProvince+location.creditCity+location.creditArea+location.creditStreet
                console.log(signlocation)
                sessionStorage.setItem('location',signlocation)
              }
            })
          }
        })
      },
      bdMapAddOverlay:function(){
        let _this = this
        // 复杂的自定义覆盖物
        function ComplexCustomOverlay(point,divId){
          this._point = point;
          this.divId = divId;

        }
        ComplexCustomOverlay.prototype = new BMap.Overlay();
        ComplexCustomOverlay.prototype.initialize = function(map){
          this._map = map;
          var div = this._div = document.getElementById(this.divId) 
          div.onmouseover = function(){
            this.style.width = "300px";
            this.style.overflow = "visible";
             this.style.zIndex = 999;
          }
          div.onmouseout = function(){
            this.style.width = "50px";
            this.style.height = "50px";
            this.style.overflow = "hidden";
            this.style.zIndex = 99;
          }
          map.getPanes().labelPane.appendChild(div);
          div.style.display = '';
          return div;      
        }
        ComplexCustomOverlay.prototype.draw = function(){
          var map = this._map;
          var pixel = map.pointToOverlayPixel(this._point);
          this._div.style.left = pixel.x + "px";
          this._div.style.top  = pixel.y + "px";
        }
        _this.reports.forEach(report => {
          let p = new BMap.Point(report.currenLon,report.currenLat)
          var myCompOverlay = new ComplexCustomOverlay(p,'custom_div_'+report.id);
          _this.map.addOverlay(myCompOverlay);
          if(report.intensity && report.intensity.length>0){            
            var numReg = /^[0-9].*$/
            var numRe = new RegExp(numReg)
            if (numRe.test(report.intensity)) {          
              var circle = new BMap.Circle(p,10000*report.intensity,{fillColor:"red", strokeWeight: 1 
              ,fillOpacity: 0.2, strokeOpacity: 0.1});//设置覆盖物的参数，中心坐标，半径，颜色
              _this.map.addOverlay(circle);//在地图上显示圆形覆盖物
            }    
          }      
        });
      },
      updateEqInfo:function(){
        var that = this;
        that.$axios.get(this.baseUrl + '/report/ht_reports_by_cata_id', 
        {
          params:{
            'cata_id':that.cata_id,
            'is_wx':1,
          }      
        },{withCredentials: true}).then(function (response) {
              if(response.data.ok==1){
                  that.reports = response.data.info;
                  that.initEqMap()
              }else{
                  alert(response.data.info)
              }
        }).catch(function (error) {
            console.log(error);
        });
      },
      formatImgs:function(value){
          if (value)
            return value.split(',')       
          else
          return []       
      }
    },
    components: {
      LeftMenu
    },
    beforeMount:function(){ 

    },
    mounted:function(){     
      var that = this;
      that.map = new BMap.Map("allmap")
      that.cata_id = this.$route.query.cata_id
      if(that.cata_id && that.cata_id.length>0){
        that.updateEqInfo()
      }    
    }
    ,updated:function(){     
      this.bdMapAddOverlay()    
    }
  };
</script>