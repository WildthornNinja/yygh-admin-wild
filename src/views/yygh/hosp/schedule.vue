<template>
    <div class="app-container">
      <div style="margin-bottom: 10px;font-size: 10px;">选择：</div>
      <el-container style="height: 100%">
        <el-aside width="200px" style="border: 1px silver solid">
          <!-- 部门 -->
          <el-tree
            :data="data"
            :props="defaultProps"
            :default-expand-all="true"
            @node-click="handleNodeClick"
          ></el-tree>
        </el-aside>
        <el-main style="padding: 0 0 0 20px;">
          <el-row style="width: 100%">
                    <!-- 排班日期 分页 -->
                    <el-tag v-for="(item,index) in bookingScheduleList" :key="item.id" @click="selectDate(item.workDate, index)" :type="index == activeIndex ? '' : 'info'" style="height: 60px;margin-right: 5px;margin-right:15px;cursor:pointer;">
                        {{ item.workDate }} {{ item.dayOfWeek }}<br/>
                        {{ item.availableNumber }} / {{ item.reservedNumber }}
                    </el-tag>

                    <!-- 分页 -->
                    <el-pagination
                        :current-page="page"
                        :total="total"
                        :page-size="limit"
                        class="pagination"
                        layout="prev, pager, next"
                        @current-change="getPage">
                    </el-pagination>

                </el-row>
          <el-row style="margin-top: 20px;">
            <!-- 排班日期对应的排班医生 -->
          </el-row>
        </el-main>
      </el-container>
    </div>
  </template>
<script>
import hospApi from "@/api/yygh/hosp";
import scheduleApi from '@/api/yygh/schedule';
export default{
    data(){
        return {
            data: [], //科室集合信息
            defaultProps: {
                children: 'children', //当前节点的子节点
                label: 'depname' //科室名称
            },//科室默认节点信息
            hoscode: "", //排班所传参数，【医院编码】
            activeIndex: 0, //选择的日期标签所有

            depcode: null,//选中的科室编码
            depname: null,//选择的科室名称
            workDate: null,//排班日期

            bookingScheduleList: [],//按照日期统计的排版集合
            baseMap: {},//基础信息集合

            page: 1, // 当前页
            limit: 7, // 每页个数
            total: 0, // 总页码
            listLoading: true, //表格加载状态
            scheduleList:[] //排班详情 ，表格数据

        }
    },
    created(){
        this.hoscode = this.$route.params.hoscode;
        this.getDeptVoList();
    },
    methods:{
        //查询科室集合数据
        getDeptVoList(){
            hospApi.getDeptByHoscode(this.hoscode)
            .then(response=>{
                this.data=response.data.list;
                //默认选中第一个科室
                if(this.data.length>0){
                    this.depcode = this.data[0].children[0].depcode;
                    this.depname = this.data[0].children[0].depname;
                    this.getPage();
                }
            })
        },
        //排班统计分页
        getPage(page=1){
            this.page=page;
            this.workDate=null;
            this.activeIndex=0;
            //查询前先清空历史数据
            this.scheduleList=[];
            this.getScheduleRule();
            
        },
        //获取排班统计信息
        getScheduleRule(){
            scheduleApi.getScheduleRule(this.page,this.limit,this.hoscode,this.depcode)
            .then(response=>{
                this.bookingScheduleList =response.data.bookingScheduleRuleList;
                this.total=response.data.total;
                this.baseMap=response.data.baseMap;
                //分页后。workDate为空，则默认选中第一条记录
                if(this.workDate ==null){
                    this.workDate=this.bookingScheduleList[0].workDate;
                    
                }

            })
        },
        //点选科室
        handleNodeClick(data){
            //判断。若为大科室直接返回
            if(data.children!=null){
                return;
            }else{
                this.depcode = data.depcode;
                this.depname = data.depname;
                this.getPage();
            }
        },
        //点选排班日期
        selectDate(workDate,index){
            this.workDate=workDate;
            this.activeIndex=index;
            //实现查询排班的集合明细
            
        }
    }
}
</script>