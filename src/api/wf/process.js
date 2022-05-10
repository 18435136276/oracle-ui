import request from '@/utils/request'

// 查询流程定义列表
export function listProcess(query) {
  return request({
    url: '/wf/process/list',
    method: 'get',
    params: query
  })
}

// 查询流程定义详细
export function getProcess(processId) {
  return request({
    url: '/wf/process/' + processId,
    method: 'get'
  })
}

// 新增流程定义
export function addProcess(data) {
  return request({
    url: '/wf/process',
    method: 'post',
    data: data
  })
}

// 修改流程定义
export function updateProcess(data) {
  return request({
    url: '/wf/process',
    method: 'put',
    data: data
  })
}

// 删除流程定义
/*export function delProcess(processId) {
  return request({
    url: '/wf/process/' + processId,
    method: 'delete'
  })
}*/

// 选择流程
export function selectProcess() {
  return request({
    url: '/wf/process/select',
    method: 'get'
  })
}
