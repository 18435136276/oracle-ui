import request from '@/utils/request'

/**
 * 提交流程
 * @param dataId 数据ID
 * @param routePath 功能路由
 */
export function audit(dataId, routePath) {
  return request({
    url: `/wf/common/audit/${dataId}/${routePath}`,
    method: 'post'
  })
}

// 查询流程处理记录列表
export function listRecord(query) {
  return request({
    url: '/wf/record/list',
    method: 'get',
    params: query
  })
}

// 新增流程处理记录
export function handleTask(data) {
  return request({
    url: '/wf/common/handle',
    method: 'post',
    data: data
  })
}
