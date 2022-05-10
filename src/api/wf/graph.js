import request from '@/utils/request'

// 查询流程定义列表
export function listGraph(processId) {
  return request({
    url: `/wf/graph/list/${processId}`,
    method: 'get'
  })
}

// 查询流程定义详细
export function getGraph(processId, version) {
  return request({
    url: `/wf/graph/${processId}/${version}`,
    method: 'get'
  })
}

// 新增流程定义
//data:{wfGraph:{},nodes:{}}
export function addGraph(data) {
  return request({
    url: '/wf/graph',
    method: 'post',
    data: data
  })
}

// 追踪流程图
export function caseGraph(caseId) {
  return request({
    url: `/wf/graph/${caseId}`,
    method: 'get'
  })
}
