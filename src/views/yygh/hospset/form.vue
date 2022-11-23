<template>
   <div class="app-container">
    <h2>医院设置表单</h2>
    <el-form label-width="120px">
      <el-form-item label="医院名称">
        <el-input v-model="hospset.hosname"/>
      </el-form-item>
      <el-form-item label="医院编号">
        <el-input v-model="hospset.hoscode"/>
      </el-form-item>
      <el-form-item label="api地址">
        <el-input v-model="hospset.apiUrl"/>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="hospset.contactsName"/>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="hospset.contactsPhone"/>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  
  </div>
</template>
<script>
import hospsetApi from '@/api/yygh/hospset';
export default{
  data(){
    return{
      hospset: {},//医院设置表单对象
      saveBtnDisabled: false // 保存按钮是否禁用,
    }
  },
  methods: {
    //新增或者修改的保存
    saveOrUpdate() {
      this.saveBtnDisabled = true
      this.addHospSet();
    },

    // 保存医院设置
    addHospSet() {
      hospsetApi.addHospSet(this.hospset)
      .then(response=>{
         this.$message({
            type: 'success',
            message: '保存成功!'
        })
        this.$router.push({ path: '/yygh/hospset/list' });
      }).catch(response=>{
        this.$message({
            type: 'error',
            message: '保存失败'
        })
      })
    },

  }
}
</script>