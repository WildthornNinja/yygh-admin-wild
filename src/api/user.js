import request from '@/utils/request'

const api_name ='/admin/hosp/hospitalSet'

/**
 * 登陆
 * @param {*} data 
 * @returns 
 */
export function login(data) {
  return request({
    url: `${api_name}/login`,
    method: 'post',
    data
  })
}
/**
 * 返回用户登陆信息
 * @param {*} token 
 * @returns 
 */
export function getInfo(token) {
  return request({
    url: `${api_name}/info`,
    method: 'get',
    params: { token }
  })
}


export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
