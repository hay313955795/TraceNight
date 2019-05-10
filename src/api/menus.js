import request from '../utils/request.js'

export function getAuthMenus() {
    return request({
        url: '/admin/commonUrl/getAuthMenus',
        method: 'get'
    })
}


export function saveMenus(param) {
    return request({
        url: '/admin/menuManage/edit',
        method: 'post',
        data:param,
        headers: {'Content-Type': 'application/json'},
    })
}

export function savePath(param) {
    return request({
        url: '/admin/menuManage/savePath',
        method: 'post',
        data:param,
        headers: {'Content-Type': 'application/json'},
    })
}
