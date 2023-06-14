/**
 * @Author: JayHrn
 * axios封装基本配置
 */
import axios from 'axios';

// 创建axios实例
const service = axios.create({
    baseURL: 'http://localhost:9090',  // api的base_url
    timeout: 5000  // 请求超时时间
});

// 请求拦截
service.interceptors.request.use(config => {
    //拦截操作
    return config;    //必须返回回去 否则调用处取不到
}, err => {
    console.log(err);
});
// 响应拦截
service.interceptors.response.use(response => {
    //拦截操作
    return response.data;
}, error => {
    return Promise.reject(error);
});

export default service;
