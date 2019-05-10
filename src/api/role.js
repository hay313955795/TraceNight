import request from '../utils/request.js'


export function getRoleInfo(param) {
    return request({
        url: '/admin/roleManage/getRole?search='+param,
        method: 'get'
    })
}

export function getAllotUser(param) {
    return request({
        url: '/admin/roleManage/getAllotUser/'+param,
        method: 'get'
    })
}

export function saveRoleInfo(param) {
    return request({
        url: '/admin/roleManage/editRole',
        method: 'post',
        data:param,
        headers: {'Content-Type': 'application/json'},
    })
}

export function allotUser(param) {
    return request({
        url: '/admin/roleManage/allotUser',
        method: 'post',
        data:param,
        headers: {'Content-Type': 'application/json'},
    })
}

export function removeUser(param) {
    return request({
        url: '/admin/roleManage/removeUser',
        method: 'post',
        data:param,
        headers: {'Content-Type': 'application/json'},
    })
}


export function deleteRole(param) {
    return request({
        url: '/admin/roleManage/deleteRole/'+param,
        method: 'post',
    })
}
