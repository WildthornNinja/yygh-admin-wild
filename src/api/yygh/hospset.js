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
    }


}