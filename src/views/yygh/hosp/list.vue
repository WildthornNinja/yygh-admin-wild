<template>
    <div class="app-container">
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <el-select v-model="searchObj.provinceCode" placeholder="请选择省" @change="provinceChanged">
                    <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-select v-model="searchObj.cityCode" placeholder="请选择市">
                    <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-input v-model="searchObj.hosname" placeholder="医院名称" />
            </el-form-item>

            <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
            <el-button type="default" @click="resetData()">清空</el-button>
        </el-form>

        <!-- banner列表 -->
        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>

            <el-table-column label="序号" width="60" align="center">
                <template slot-scope="scope">
                    {{ (page - 1) * limit + scope.$index + 1 }}
                </template>
            </el-table-column>

            <el-table-column label="医院logo">
                <template slot-scope="scope">
                    <img :src="'data:image/jpeg;base64,' + scope.row.logoData" width="80">
                </template>
            </el-table-column>

            <el-table-column prop="hosname" label="医院名称" />
            <el-table-column prop="param.hostypeString" label="等级" width="90" />
            <el-table-column prop="param.fullAddress" label="详情地址" />
            <el-table-column label="状态" width="80">
                <template slot-scope="scope">
                    {{ scope.row.status === 0 ? '未上线' : '已上线' }}
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" />

            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <router-link :to="'/yygh/hospset/hospital/show/' + scope.row.id">
                        <el-button type="primary" size="mini">查看</el-button>
                    </router-link>
                    <router-link :to="'/yygh/hospset/hospital/schedule/' + scope.row.hoscode">
                        <el-button type="primary" size="mini">排班</el-button>
                    </router-link>

                    <el-button v-if="scope.row.status == 1" type="primary" size="mini"
                        @click="updateStatus(scope.row.id, 0)">下线</el-button>
                    <el-button v-if="scope.row.status == 0" type="danger" size="mini"
                        @click="updateStatus(scope.row.id, 1)">上线</el-button>
                </template>

            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination :current-page="page" :total="total" :page-size="limit" :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
            style="padding: 30px 0; text-align: center;" layout="sizes, prev, pager, next, jumper, ->, total, slot"
            @current-change="fetchData" @size-change="changeSize" />
    </div>
</template>
<script>
import hospApi from '@/api/yygh/hosp'
import dictApi from '@/api/yygh/dict'

export default {
    data(){
        return{
            listLoading: true, // 数据是否正在加载
            list: null, // 医院列表数据集合
            total: 0, // 数据库中的总记录数
            page: 1, // 默认页码
            limit: 10, // 每页记录数
            searchObj: {
                provinceCode:'',//下拉列表属性需要初始化
                cityCode:''
            }, // 查询表单对象
            provinceList: [], //所有省集合
            cityList: []   //所有市集合
        }
    },
    created(){
        //加载省份信息【联机查询第一级】
        this.getProvinceList();
        //初始化查询查询列表
        this.fetchData();
    },
    methods:{
        //加载省份数据
        getProvinceList(){
            dictApi.findByDictCode("Province")
            .then(response=>{
                this.provinceList=response.data.list;
            })
        },
        fetchData(page=1){
            this.page=page;
            //查询医院列表
            hospApi.hospPageInfo(this.page,this.limit,this.searchObj)
            .then(response=>{
                this.list = response.data.pageModel.content;
                this.total = response.data.pageModel.totalElements;
                this.listLoading=false;//取消转圈加载
            })
        },
        //点击某个省，显示里面市（联动）,省市二级联动查询
        provinceChanged(){
             //先清空
             //清空二级市信息，
             this.cityList=[];
             //清空查询条件
             this.searchObj.cityCode = '';
             //调用方法，根据省id，查询下面子节点
             //根据省id查询市集合
             console.log("provinceCode",this.searchObj.provinceCode);
             dictApi.findChildData(this.searchObj.provinceCode)
             .then(response=>{
                this.cityList=response.data.dictList;
             })
        },
        updateStatus(id,status){
            hospApi.updateStatus(id,status)
            .then(response=>{
                this.$message({
                    type:"success",
                    message:"操作成功!"
                });
                //重新查询数据，刷新页面
                this.fetchData();
            })
        },

        //分页，页码变化,切换每页记录数
        changeSize(){
            this.limit = size;
            this.fetchData(1);
        },
        //清空方法
        resetData(){
            this.searchObj={
                provinceCode:'',
                cityCode:''
            }
            this.fetchData();
        },
    }

}
</script>