/**
 * 电脑管理api
 */
import request from '@/utils/axios';
// 电脑管理基本路径
const baseURL = '/computer';

/**
 * 分页查询电脑
 * @param params  (page: 第几页, pageSize: 每页大小, number: 编号(输入框), machineRoom: 隶属机房(下拉框), state: 状态(下拉框))
 * @returns {AxiosPromise} Axios请求
 * @example params: {page: 1,pageSize: 1, number: 'A0001',machineRoom: 'D301', state: 0}
 */
export const getComputerByPage = (params) => {
    return request({
        url: `${baseURL}/page`,
        method: 'GET',
        params
    });
};

/**
 * 添加电脑
 * @param params Computer对象
 * @returns {AxiosPromise} Axios请求
 */
export const addComputer = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'POST',
        data: { ...params }
    });
};

/**
 * 根据ID删除电脑
 * @param id 电脑ID
 * @returns {AxiosPromise} Axios请求
 */
export const deleteComputerById = (id) => {
    return request({
        url: `${baseURL}`,
        method: 'DELETE',
        params: { id }
    });
};

/**
 * 修改电脑
 * @param params Computer对象
 * @returns {AxiosPromise} Axios请求
 */
export const editComputer = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'PUT',
        data: { ...params }
    });
};
