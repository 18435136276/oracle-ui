import request from '@/utils/request'

// 查询商品详情列表
export function listGoods(query) {
  return request({
    url: '/system/goods/list',
    method: 'get',
    params: query
  })
}

// 查询商品详情详细
export function getGoods(fId) {
  return request({
    url: '/system/goods/' + fId,
    method: 'get'
  })
}

// 新增商品详情
export function addGoods(data) {
  return request({
    url: '/system/goods',
    method: 'post',
    data: data
  })
}

// 修改商品详情
export function updateGoods(data) {
  return request({
    url: '/system/goods',
    method: 'put',
    data: data
  })
}

// 删除商品详情
export function delGoods(fId) {
  return request({
    url: '/system/goods/' + fId,
    method: 'delete'
  })
}
