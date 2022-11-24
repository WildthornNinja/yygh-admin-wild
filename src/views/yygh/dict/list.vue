<template>
    <div  class="app-container">
        <!-- 
            1.row-key="id" 每行数据关键字，支持子节点数据异步加载
            2.lazy 懒加载
            3. 通过 row 对象的hasChildren属性判断是否有子节点数据
            4.:load="load" 加载数据函数
         -->
    <el-table
        :data="list"
        style="width: 100%"
        row-key="id"
        border
        lazy
        :load="load"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

        <el-table-column
        prop="name"
        label="名称"
        width="150">
        </el-table-column>

        <el-table-column
        prop="dictCode"
        label="编码"
        width="150">
        </el-table-column>

        <el-table-column
        prop="value"
        label="值"
        width="150">
        </el-table-column>

        <el-table-column
        prop="createTime"
        label="创建时间">
        </el-table-column>

    </el-table>
    </div>
</template>
<script>
import dictApi from '@/api/yygh/dict';
export default{
    data(){
        return {
            list:[] //数据字典列表数组
        }
    },
    created(){
        this.getDictList(1);//默认记载 父id为1的dict对象
    },
    methods:{
         //根据数据id查询子数据列表
        getDictList(id){
            //调用api查询dictList数据
            dictApi.findChildData(id)
            .then(response=>{
                this.list = response.data.dictList;
            });
        },
        //树形表格组件 内置load加载数据函数 load(row, treeNode, resolve){} 
        /**
         * 
         * @param {*} row  该节点信息
         * @param {*} treeNode 节点的层级信息
         * @param {*} resolve 懒加载函数
         */
        load(row, treeNode, resolve){
            console.log("row",row);
            console.log("threeNode",treeNode);
            //懒加载 ，继续调用api查询 该节点下的子节点数据
            dictApi.findChildData(row.id)
            .then(response=>{
                //resolve 懒加载方法 局部更新数据
                resolve(response.data.dictList);
            })
        }

    }
}
</script>