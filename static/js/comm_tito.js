// 自定义封装ajax
function ajax(url, type='json', method='get', data=''){
    return new Promise((resolve, reject)=>{
        // 1.创建xhr
        let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp');
        // 2.创建请求
        xhr.open(method, url, true);
        // 3.设置回调
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == 4)
                if(xhr.status == 200)
                    if(type.toLowerCase() == 'json')
                        resolve(JSON.parse(xhr.responseText));
                    else
                        resolve(xhr.responseText);
                else
                    reject('ajax出错=>'+xhr.status);
        }
        // 4.设置请求头
        if(method.toLowerCase() == 'post')
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // 5.发送请求
        xhr.send(data);
    });
}
