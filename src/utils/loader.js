//加载第三方js  css 文件
export function importScript(path, success, error) {
    var oS = document.createElement('script')
    oS.src = path
    document.getElementsByTagName('head')[0].appendChild(oS)
    oS.onload = function () {
        success && success()
    };

    oS.onerror = function () {
        error && error()
    }
}


export function importCss(path, success, error) {
    var oS = document.createElement('link')
    oS.href = path
    document.getElementsByTagName('head')[0].appendChild(oS)
    oS.onload = function () {
        success && success()
    };

    oS.onerror = function () {
        error && error()
    }
}
