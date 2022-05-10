import request from '@/utils/request'

// 查询客户列表
export function listCorps(query) {
  return request({
    url: '/system/corps/list',
    method: 'get',
    params: query
  })
}

// 查询客户详细
export function getCorps(fId) {
  return request({
    url: '/system/corps/' + fId,
    method: 'get'
  })
}

// 新增客户
export function addCorps(data) {
  return request({
    url: '/system/corps',
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateCorps(data) {
  return request({
    url: '/system/corps',
    method: 'put',
    data: data
  })
}

// 删除客户
export function delCorps(fId) {
  return request({
    url: '/system/corps/' + fId,
    method: 'delete'
  })
}
