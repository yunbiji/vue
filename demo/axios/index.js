import Vue from 'vue'
import store from '../store'
import axios from 'axios'

let $axios = axios.create({
    baseURL: 'http://bpi.shizu.me/', 
    timeout: 10000,
    headers: {
       'Access-Control-Allow-Origin': '*',
       //"token": store.state.token || localStorage.token || ''
    },
    transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
            if(typeof data[it] =='string'){
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }else{
                try{
                    ret += data[it].name + '=' +data[it].value +"&"
                }catch(e){
                }
            }
        }
        return ret
    }]
})

// 添加请求拦截器
$axios.interceptors.request.use(function (config) {
    if(config.headers.token){

    }else if (store.state.token || localStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Token = `${store.state.token||localStorage.token}`;
        //config.headers.Authorization = `token ${store.state.token||localStorage.token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
$axios.interceptors.response.use(function (response) {
    if(response.data.code == 9){
        swal({
            type: "warning",
            title: "登录信息已过期,请重新登录",
            timer: 3000
        },function(isConfirm){
            if(isConfirm){
                localStorage.clear();
                Vue.prototype.$$router.push('/login');
            }
        })
        return false;
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});

export default $axios
