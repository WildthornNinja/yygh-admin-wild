<template>
  <div class="app-container">
      <h2>医院设置列表</h2>

       <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
              <el-input v-model="searchObj.hosname" placeholder="医院名称"/>
          </el-form-item>

          <el-form-item>
              <el-input v-model="searchObj.hoscode" placeholder="医院编号"/>
          </el-form-item>

          <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
          <el-button type="default" @click="resetData()">清空</el-button>
          <el-button type="success" icon="el-icon-edit" circle  @click="toFormPage()">新增</el-button>
      </el-form>
      <!-- 跳转新增页面按钮 -->
      <!-- 复选框工具条 -->
      <div>
        <el-button type="danger" size="mini" @click="removeRows()">批量删除</el-button>
      </div>
      <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="数据加载中"
          border
          fit
          :row-class-name="tableRowColor"
          highlight-current-row 
          @selection-change="handleSelectionChange"
          >
      <el-table-column type="selection" width="55"/>
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

      <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
              <router-link :to="'/yygh/hospset/edit/'+scope.row.id">
                  <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
              </router-link>&nbsp;
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
              <el-button v-if="scope.row.status==1" type="primary" size="mini" 
                    icon="el-icon-delete" @click="lockHostSet(scope.row.id,0)">锁定</el-button>
              <el-button v-if="scope.row.status==0" type="danger" size="mini" 
                    icon="el-icon-delete" @click="lockHostSet(scope.row.id,1)">取消锁定</el-button>
          </template>
    </el-table-column>
  </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
      />

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
      limit: 4, // 每页记录数
      searchObj: {},// 查询条件
      multipleSelection: [] // 批量选择中选择的记录列表
    }
  },
  created(){// 当页面加载时获取数据
    this.fetchData();//可以调用有参的fetchData()方法,因为JavaScript为弱类型语言
  },
  methods:{
    fetchData(page=1){//page= 1 默认参数
      this.page = page;
      //console.log("searchObj",this.searchObj);
      // 调用api层获取数据库中的数据
        hospsetApi.pageQuery(this.page,this.limit,this.searchObj)
        .then(response=>{
          //console.log("response",response);
          this.total=response.data.total;
          this.list=response.data.records;
          //设置加载图表状态为false,停止加载动画
          this.listLoading=false;
        })

    },
    /**
     * 批量删除
     */
     removeRows(){
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        //1.创建参数结果集 idList
        let idList=[];
        //2.遍历集合multipleSelection，取出被选中的行数据
        for(let i=0;i<this.multipleSelection.length;i++){
          let hospitalSet = this.multipleSelection[i];
          let hospSetId = hospitalSet.id;
          //3.取出id 存入参数结果集
          idList.push(hospSetId);
        };
        console.log("idList",idList);
        //4.调用api接口执行批量删除
        hospsetApi.bachRemove(idList)
        .then(response=>{
          this.$message({
            type: "success",
            message:"删除成功!"
          });
          this.fetchData();
        })
      }).catch(()=>{
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        })
     },
     /**
      * 对医院设置进行锁定和取消锁定
      */
    lockHostSet(id,status) {
      console.log("id,status",id,status);
        hospsetApi.lockHospSet(id,status)
        .then(response => {
          this.$message({
              type:"success",
              message:"操作成功"
            });
         //刷新
         this.fetchData()
      })
    },


    /**
     * 当表格复选框选项发生变化的时候触发
     */
    handleSelectionChange(selection) {
        //console.log(selection);
        //selection为一个集合，集合元素为所选中的每行数据
        this.multipleSelection = selection;
        //console.log("multipleSelection",this.multipleSelection);
    },
    /**
     * 通过id删除医院设置信息
     */
    removeDataById(id){
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          hospsetApi.removeById(id)
          .then(response=>{
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetchData();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

    },
    /**
     * 跳转至医院设置form表单页面
     */
     toFormPage(){
      //使用内置路由对象router实现页面跳转
      this.$router.push({ path: "/yygh/hospset/create" });
     },
    /**
     * 清空查询表单数据
     */
    resetData() {
      this.searchObj = {};
      this.fetchData();
    },

    /**
     * 表格行颜色
     */
     tableRowColor({row, rowIndex}){
      if (rowIndex === 1) {
          return 'one-row';
        } else if (rowIndex === 3) {
          return 'two-row';
        }
        return 'three-row';
      }
     }
  }
</script>
<style>
  .el-table .one-row {
    background: #DFEEFD;
  }

  .el-table .two-row {
    background: #FAF0D5;
  }
  .el-table .three-row {
    background: #f0f9eb;
  }
</style>