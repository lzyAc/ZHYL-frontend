import request from '@/utils/request'

// 查询健康档案记录列表
export function listHealthRecord(query) {
  return request({
    url: '/healthRecord/healthRecord/list',
    method: 'get',
    params: query
  })
}

// 查询健康档案记录详细
export function getHealthRecord(recordId) {
  return request({
    url: '/healthRecord/healthRecord/' + recordId,
    method: 'get'
  })
}

// 新增健康档案记录
export function addHealthRecord(data) {
  return request({
    url: '/healthRecord/healthRecord',
    method: 'post',
    data: data
  })
}

// 修改健康档案记录
export function updateHealthRecord(data) {
  return request({
    url: '/healthRecord/healthRecord',
    method: 'put',
    data: data
  })
}

// 删除健康档案记录
export function delHealthRecord(recordId) {
  return request({
    url: '/healthRecord/healthRecord/' + recordId,
    method: 'delete'
  })
}
