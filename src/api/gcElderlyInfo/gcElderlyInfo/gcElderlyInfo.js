import request from '@/utils/request'

// 查询老人信息列表
export function listGcElderlyInfo(query) {
  return request({
    url: '/gcElderlyInfo/gcElderlyInfo/list',
    method: 'get',
    params: query
  })
}

// 查询老人信息详细
export function getGcElderlyInfo(elderlyId) {
  return request({
    url: '/gcElderlyInfo/gcElderlyInfo/' + elderlyId,
    method: 'get'
  })
}

// 新增老人信息
export function addGcElderlyInfo(data) {
  return request({
    url: '/gcElderlyInfo/gcElderlyInfo',
    method: 'post',
    data: data
  })
}

// 修改老人信息
export function updateGcElderlyInfo(data) {
  return request({
    url: '/gcElderlyInfo/gcElderlyInfo',
    method: 'put',
    data: data
  })
}

// 删除老人信息
export function delGcElderlyInfo(elderlyId) {
  return request({
    url: '/gcElderlyInfo/gcElderlyInfo/' + elderlyId,
    method: 'delete'
  })
}
