import request from '../utils/request.js'


//查询所有菜单渲染菜单树
export function getAllMenus() {
    return request({
        url: '/admin/authManage/getAllMenus',
        method: 'get'
    })
}
//
export  function getPathByMenuId(param){
    return request({
        url: '/admin/authManage/getPathByMenu/'+param,
        method: 'get'
    })
}


//查询该角色的所有权限
export function getPermissions(param) {
    return request({
        url: '/admin/authManage/getPermissions/'+param,
        method: 'get'
    })
}

//增加权限addPermissions
export function addPermissions(params) {
    return request({
        url: '/admin/authManage/addPermissions',
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        data: params
    })
}


//移除权限
export function removePermissions(params) {
    return request({
        url: '/admin/authManage/removePermissions',
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        data: params
    })
}
