<template>
    <div  class="app-container">
        <div class="el-toolbar">
            <div class="el-toolbar-body" style="justify-content: flex-start;">
                <el-button type="text" @click="exportData"><i class="fa fa-plus"/> 导出</el-button>
                <el-button type="text" @click="importData"><i class="fa fa-plus"/> 导入</el-button>
            </div>
            
        </div>
        <!-- 
            1.row-key="id" 每行数据关键字，支持子节点数据异步加载
            2.lazy 懒加载
            3. 通过 row 对象的hasChildren属性判断是否有子节点数据
            4.:load="load" 加载数据函数
         -->
    <el-table
        v-loading="listLoading"
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
    <el-dialog title="导入" :visible.sync="dialogImportVisible" width="480px">
            <el-form label-position="right" label-width="170px">
                <el-form-item label="文件">
                    <el-upload
                            :multiple="false"
                            :on-success="onUploadSuccess"
                            :action="BASE_API"
                            class="upload-demo">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传xls文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogImportVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import dictApi from '@/api/yygh/dict';
export default{
    data(){
        return {
            listLoading: true, // 是否显示loading信息
            list:[], //数据字典列表数组
            BASE_API: `${process.env.VUE_APP_BASE_API}admin/cmn/dict/importData`,//上传地址
            dialogImportVisible: false, //Dialog 对话框是否显示
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
                this.listLoading = false;
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
        },
        /**
         * 导出数据
         */
         exportData(){
            //内置window对象
            window.open(`${process.env.VUE_APP_BASE_API}admin/cmn/dict/exportData`);
         },
         /**
          * 打开Dialog对话框
          */
          importData(){
            this.dialogImportVisible = true
          },
          /**
           * 上传数据，实现导入数据功能
           */
           onUploadSuccess(){
            this.$message({
                type:"success",
                message: "上传成功!"
            });
            //关闭对话框
            this.dialogImportVisible = false
            //刷新数据
            this.getDictList();
           }

    }
}
</script>