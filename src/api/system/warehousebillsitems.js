import request from '@/utils/request'

// 查询仓库明细从列表
export function listWarehousebillsitems(query) {
  return request({
    url: '/system/warehousebillsitems/list',
    method: 'get',
    params: query
  })
}

// 查询仓库明细从详细
export function getWarehousebillsitems(fId) {
  return request({
    url: '/system/warehousebillsitems/' + fId,
    method: 'get'
  })
}

// 新增仓库明细从
export function addWarehousebillsitems(data) {
  return request({
    url: '/system/warehousebillsitems',
    method: 'post',
    data: data
  })
}

// 修改仓库明细从
export function updateWarehousebillsitems(data) {
  return request({
    url: '/system/warehousebillsitems',
    method: 'put',
    data: data
  })
}

// 删除仓库明细从
export function delWarehousebillsitems(fId) {
  return request({
    url: '/system/warehousebillsitems/' + fId,
    method: 'delete'
  })
}
