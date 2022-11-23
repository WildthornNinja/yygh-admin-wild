<template>
  <div class="app-container">
      医院设置列表
      <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="数据加载中"
          border
          fit
          highlight-current-row>

      <el-table-column
            label="序号"
            width="70"
            align="center">
        <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
    </el-table-column>

    <el-table-column prop="hosname" label="医院名称" width="180" />

    <el-table-column prop="hoscode" label="医院编号" width="160" />

    <el-table-column prop="apiUrl" label="地址" width="200"/>

    <el-table-column prop="contactsName" label="联系人"/>

    <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
            {{ scope.row.status===1?'可用':'不可用' }}
        </template>
    </el-table-column>

      <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
              <router-link :to="'/yygh/hospset/edit/'+scope.row.id">
                  <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
              </router-link>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
          </template>
    </el-table-column>
  </el-table>
  </div>
   
</template>
<script>
//导入 api 接口
import hospsetApi from '@/api/yygh/hospset';

export default{
  data(){// 定义数据
    return{
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 5, // 每页记录数
      searchObj: {}// 查询条件
    }
  },
  created(){// 当页面加载时获取数据
    this.fetchDat();//可以调用有参的fetchData()方法,因为JavaScript为弱类型语言
  },
  methods:{
    fetchDat(page=1){//page= 1 默认参数
      hospsetApi.pageQuery(this.page,this.limit,this.searchObj)
      .then(response=>{
        //console.log("response",response);
        this.total=response.data.total;
        this.list=response.data.records;
        //设置加载图表状态为false,停止加载动画
        this.listLoading=false;
      })

    }
  }
}
</script>