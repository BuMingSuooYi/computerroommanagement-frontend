/**
 * 账户管理api
 */
import request from '@/utils/axios';
// 账户基本路径
const baseURL = '/account';

/**
 * 分页查询账户
 * @param params  (page: 第几页, pageSize: 每页大小, username: 用户名(输入框), type: 人员类型（下拉框）, isDisabled: 是否禁用（下拉框）)
 * @returns {AxiosPromise} Axios请求
 * @example params: {page: 1,pageSize: 1, username: '张三',type: 0, idDisabled: 0}
 */
export const getAccountByPage = (params) => {
    return request({
        url: `${baseURL}/page`,
        method: 'GET',
        params
    });
};

/**
 * 添加账户
 * @param params Account对象
 * @returns {AxiosPromise} Axios请求
 */
export const addAccount = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'POST',
        data: { ...params }
    });
};

/**
 * 根据ID删除账户
 * @param id 账户ID
 * @returns {AxiosPromise} Axios请求
 */
export const deleteAccountById = (id) => {
    return request({
        url: `${baseURL}`,
        method: 'DELETE',
        params: { id }
    });
};

/**
 * 修改账户
 * @param params Account对象
 * @returns {AxiosPromise} Axios请求
 */
export const editAccount = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'PUT',
        data: { ...params }
    });
};
/**
 * 用户登录
 * @param params
 * @returns {*}
 */
export const login = (params) => {
    return request({
        url: `${baseURL}/login`,
        method: 'POST',
        params
    });
};
/**
 * 导出账户
 * @returns {*}
 */
export const exportAccount = () => {
    return request({
        url: `${baseURL}/download`,
        method: 'GET',
        responseType: 'blob' // 设置响应类型为二进制数据
    });
};
