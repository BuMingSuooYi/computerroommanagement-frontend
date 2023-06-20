/**
 * 电脑配置管理api
 */
import request from '@/utils/axios';
// 电脑配置基本路径
const baseURL = '/computerConfiguration';

/**
 * 分页查询电脑配置
 * @param params  (page: 第几页, pageSize: 每页大小, hardware: 硬件(输入框), software: 软件（software）)
 * @returns {AxiosPromise} Axios请求
 * @example params: {page: 1,pageSize: 1, hardware: 'AMD',software: 'Windows10'}
 */
export const getComputerConfigurationByPage = (params) => {
    return request({
        url: `${baseURL}/page`,
        method: 'GET',
        params
    });
};

/**
 * 添加电脑配置
 * @param params ComputerConfiguration对象
 * @returns {AxiosPromise} Axios请求
 */
export const addComputerConfiguration = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'POST',
        data: { ...params }
    });
};

/**
 * 根据ID删除电脑配置
 * @param id 电脑配置ID
 * @returns {AxiosPromise} Axios请求
 */
export const deleteComputerConfigurationById = (id) => {
    return request({
        url: `${baseURL}`,
        method: 'DELETE',
        params: { id }
    });
};

/**
 * 修改电脑配置
 * @param params ComputerConfiguration对象
 * @returns {AxiosPromise} Axios请求
 */
export const editComputerConfiguration = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'PUT',
        data: { ...params }
    });
};
