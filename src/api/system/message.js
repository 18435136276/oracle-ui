import request from '@/utils/request'

// 查询系统消息列表
export function listMessage(query) {
  return request({
    url: '/system/message/list',
    method: 'get',
    params: query
  })
}

// 查询个人未阅系统消息列表
export function selfListMessage(query) {
  return request({
    url: '/system/message/selfList',
    method: 'get',
    params: query
  })
}

// 查询个人未阅系统消息数量
export function count() {
  return request({
    url: '/system/message/count',
    method: 'get'
  })
}

// 查询系统消息详细
export function getMessage(messageId) {
  return request({
    url: '/system/message/' + messageId,
    method: 'get'
  })
}

// 已阅系统消息
export function notedMessage(messageId) {
  return request({
    url: '/system/message/' + messageId,
    method: 'put'
  })
}

// 删除系统消息
export function delMessage(messageId) {
  return request({
    url: '/system/message/' + messageId,
    method: 'delete'
  })
}
