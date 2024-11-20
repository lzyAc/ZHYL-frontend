import request from '@/utils/request'

// 查询养老机构信息列表
export function listOrganization(query) {
  return request({
    url: '/InstitutionInfo/organization/list',
    method: 'get',
    params: query
  })
}

// 查询养老机构信息详细
export function getOrganization(orgId) {
  return request({
    url: '/InstitutionInfo/organization/' + orgId,
    method: 'get'
  })
}

// 新增养老机构信息
export function addOrganization(data) {
  return request({
    url: '/InstitutionInfo/organization',
    method: 'post',
    data: data
  })
}

// 修改养老机构信息
export function updateOrganization(data) {
  return request({
    url: '/InstitutionInfo/organization',
    method: 'put',
    data: data
  })
}

// 删除养老机构信息
export function delOrganization(orgId) {
  return request({
    url: '/InstitutionInfo/organization/' + orgId,
    method: 'delete'
  })
}
