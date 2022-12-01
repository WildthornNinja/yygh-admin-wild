import request from '@/utils/request'

const api_name="/admin/hosp/hospital";

export default{
   //带条件带分页查询医院列表
   hospPageInfo(page,limit,searchObj) {
    return request ({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
}