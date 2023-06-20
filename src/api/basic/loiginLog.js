/**
 * 登录日志管理api
 */
import request from '@/utils/axios';
// 登录日志基本路径
const baseURL = '/LoginLog';

/**
 * 分页查询登录日志
 * @param params  (page: 第几页, pageSize: 每页大小, username: 用户名(输入框))
 * @returns {AxiosPromise} Axios请求
 * @example params: {page: 1,pageSize: 1, username: '张三'}
 */
export const getLoginLogByPage = (params) => {
    return request({
        url: `${baseURL}/page`,
        method: 'GET',
        params
    });
};

/**
 * 根据ID删除登录日志
 * @param id 登录日志ID
 * @returns {AxiosPromise} Axios请求
 */
export const deleteLoginLogById = (id) => {
    return request({
        url: `${baseURL}`,
        method: 'DELETE',
        params: { id }
    });
};
