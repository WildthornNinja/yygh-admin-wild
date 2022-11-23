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
            mothod: "post",
            data: searchObj, ////用json方式传递
        })
    }
}