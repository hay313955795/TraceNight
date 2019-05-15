import request from '../utils/request.js'


//查询所有五金类型
export function getAllMetalType() {
    return request({
        url: '/admin/metalManage/getAllType',
        method: 'get'
    })
}


//根据类型查询产品信息
export function getAllMetalProductByTypeIdAndSearch(params) {
    return request({
        url: '/admin/metalManage/getProductByType/'+params,
        method: 'get'
    })
}

export  function deleteProductById(id){
    return request({
        url:'/admin/metalManage/deleteProduct/'+id,
        method:'post',
        headers: {'Content-Type': 'application/json'},
    })
}
