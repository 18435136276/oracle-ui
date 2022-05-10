import request from '@/utils/request'

// 查询仓库主(出入库)列表
export function listWarehousebills(query) {
  return request({
    url: '/system/warehousebills/list',
    method: 'get',
    params: query
  })
}

// 查询仓库主(出入库)详细
export function getWarehousebills(fId) {
  return request({
    url: '/system/warehousebills/' + fId,
    method: 'get'
  })
}

// 新增仓库主(出入库)
export function addWarehousebills(data) {
  return request({
    url: '/system/warehousebills',
    method: 'post',
    data: data
  })
}

// 修改仓库主(出入库)
export function updateWarehousebills(data) {
  return request({
    url: '/system/warehousebills',
    method: 'put',
    data: data
  })
}

// 删除仓库主(出入库)
export function delWarehousebills(fId) {
  return request({
    url: '/system/warehousebills/' + fId,
    method: 'delete'
  })
}
