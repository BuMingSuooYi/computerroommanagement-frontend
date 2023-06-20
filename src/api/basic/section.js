/**
 * 节次管理api
 */
import request from '@/utils/axios';
// 节次基本路径
const baseURL = '/section';

/**
 * 获取所有节次
 * @returns {AxiosPromise} Axios请求
 */
export const getAllSection = () => {
    return request({
        url: `${baseURL}`,
        method: 'GET'
    });
};

/**
 * 添加节次
 * @param params Section对象
 * @returns {AxiosPromise} Axios请求
 */
export const addSection = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'POST',
        data: { ...params }
    });
};

/**
 * 根据ID删除节次
 * @param id 节次ID
 * @returns {AxiosPromise} Axios请求
 */
export const deleteSectionById = (id) => {
    return request({
        url: `${baseURL}`,
        method: 'DELETE',
        params: { id }
    });
};

/**
 * 修改节次
 * @param params Section对象
 * @returns {AxiosPromise} Axios请求
 */
export const editSection = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'PUT',
        data: { ...params }
    });
};
