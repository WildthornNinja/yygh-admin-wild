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

export default{
    data(){
        return {
            data: [], //科室集合信息
            defaultProps: {
                children: 'children', //当前节点的子节点
                label: 'depname' //科室名称
            },//科室默认节点信息
            hoscode: "", //排班所传参数，【医院编码】

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
            })

        },
    }
}
</script>