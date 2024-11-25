import request from '@/utils/request'

// 查询服务人员管理列表
export function listStaff(query) {
  return request({
    url: '/InstitutionInfo/staff/list',
    method: 'get',
    params: query
  })
}

// 查询服务人员管理详细
export function getStaff(id) {
  return request({
    url: '/InstitutionInfo/staff/' + id,
    method: 'get'
  })
}

// 新增服务人员管理
export function addStaff(data) {
  return request({
    url: '/InstitutionInfo/staff',
    method: 'post',
    data: data
  })
}

// 修改服务人员管理
export function updateStaff(data) {
  return request({
    url: '/InstitutionInfo/staff',
    method: 'put',
    data: data
  })
}

// 删除服务人员管理
export function delStaff(id) {
  return request({
    url: '/InstitutionInfo/staff/' + id,
    method: 'delete'
  })
}
