import request from '@/utils/request'

// 查询地域信息列表
export function listArea(query) {
  return request({
    url: '/demo/area/list',
    method: 'get',
    params: query
  })
}

// 查询地域信息详细
export function getArea(areaId) {
  return request({
    url: '/demo/area/' + areaId,
    method: 'get'
  })
}

// 新增地域信息
export function addArea(data) {
  return request({
    url: '/demo/area',
    method: 'post',
    data: data
  })
}

// 修改地域信息
export function updateArea(data) {
  return request({
    url: '/demo/area',
    method: 'put',
    data: data
  })
}

// 删除地域信息
export function delArea(areaId) {
  return request({
    url: '/demo/area/' + areaId,
    method: 'delete'
  })
}
