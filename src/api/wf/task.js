import request from '@/utils/request'

// 查询任务管理列表
export function listTask(query) {
  return request({
    url: '/wf/task/list',
    method: 'get',
    params: query
  })
}

// 查询任务管理详细
export function getTask(taskId) {
  return request({
    url: '/wf/task/' + taskId,
    method: 'get'
  })
}

// 提交任务
export function auditTask(data) {
  return request({
    url: '/wf/task',
    method: 'put',
    data: data
  })
}
