import request from '@/utils/request'

const api_name ="/admin/hosp/hospitalSet"

export default {
    /**
     * 带查询条件的分页查询
     * @param {*} page 当前第几页
     * @param {*} limit 每页条目数
     * @param {*} searchObj 查询条件vo对象
     * @returns 
     */
    pageQuery(page,limit,searchObj){
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: "post",
            data: searchObj, //用json方式传递
        })
    },
    /**
     * 通过id删除医院设置信息
     * @param {*} id 
     * @returns 
     */
    removeById(id){
        return request ({
            url: `${api_name}/delete/${id}`,
            method: "delete"
        })

    },
    /**
     * 添加医院设置
     * @param {*} hospitalSet 
     * @returns 
     */
    addHospSet(hospitalSet){
        return request({
            url: `${api_name}/add`,
            method:"post",
            data: hospitalSet
        })
    },
    /**
     * 数据回显 通过id查询设置信息
     * @param {*} id 
     * @returns 
     */
    getHospSetById(id){
        return request({
            url: `${api_name}/getById/${id}`,
            method: "get"
        })
    },
    /**
     * 修改医院设置
     * @param {*} hospitalSet 
     * @returns 
     */
    updateHospSet(hospitalSet){
        return request({
            url: `${api_name}/update`,
            method:"put",
            data: hospitalSet
        })
    },
    /**
     * 
     * 批量删除医院设置
     * @param {*} idList 
     * @returns 
     */
    bachRemove(idList){
        return request({
            url: `${api_name}/bachRemove`,
            method: "delete",
            data: idList
        })

    },
    /**
     * 对医院设置进行
     * 锁定和取消锁定
     * @param {*} id 
     * @param {*} status 
     * @returns 
     */
    lockHospSet(id,status){
        return request({
            url:`${api_name}/lock/${id}/${status}`,
            method:"put"
        })
    }





}