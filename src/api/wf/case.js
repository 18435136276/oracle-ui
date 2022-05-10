import request from '@/utils/request'

// 查询流程实例列表
export function listCase(query) {
  return request({
    url: '/wf/case/list',
    method: 'get',
    params: query
  })
}

// 查询流程实例详细
export function getCase(caseId) {
  return request({
    url: '/wf/case/' + caseId,
    method: 'get'
  })
}

// 新增流程实例
export function addCase(data) {
  return request({
    url: '/wf/case',
    method: 'post',
    data: data
  })
}

// 修改流程实例
export function updateCase(data) {
  return request({
    url: '/wf/case',
    method: 'put',
    data: data
  })
}

// 提交流程实例
export function auditCase(caseId) {
  return request({
    url: `/wf/case/${caseId}`,
    method: 'put'
  })
}
