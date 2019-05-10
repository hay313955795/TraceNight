import request from '../utils/request.js'

export function login(params) {
    return request({
        url: '/auth/jwt/admin/userAuth',
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        data: params
    })
}

export function getUserInfo(param) {
    return request({
        url: '/admin/userManage/getUser?search='+param,
        method: 'get'
    })
}

export function deleteUser(param) {
    return request({
        url: '/admin/userManage/deleteUser/'+param,
        method: 'post'
    })
}

export function resetPwd(param){
    return request({
        url: '/admin/userManage/resetPwd/'+param,
        method: 'post'
    })
}
export  function saveUser(param) {
    return request({
        url: '/admin/userManage/editUser',
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        data: param
    })
}

export function sendSMS(params) {
    return request({
        url: '/pc/sendsms',
        method: 'get',
        params: params
    })
}
