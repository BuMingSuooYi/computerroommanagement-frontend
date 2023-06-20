/**
 * 维修记录管理api
 */
import request from '@/utils/axios';
// 维修记录基本路径
const baseURL = '/maintenanceRecord';

/**
 * 分页查询维修记录
 * @param params  (page: 第几页, pageSize: 每页大小, number: 电脑编号(输入框，参考电脑表))
 * @returns {AxiosPromise} Axios请求
 * @example params: {page: 1,pageSize: 1, number: '小新air7-001'}
 */
export const getMaintenanceRecordByPage = (params) => {
    return request({
        url: `${baseURL}/page`,
        method: 'GET',
        params
    });
};

/**
 * 根据电脑ID查询指定电脑所有维修记录
 * @param computer 电脑ID
 * @returns {AxiosPromise} Axios请求
 * @example params: {computer: '18798564789568789'}
 */
export const getMaintenanceRecordById = (computer) => {
    return request({
        url: `${baseURL}`,
        method: 'GET',
        params: { computer }
    });
};

/**
 * 添加维修记录
 * @param params MaintenanceRecord对象
 * @returns {AxiosPromise} Axios请求
 */
export const addMaintenanceRecord = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'POST',
        data: { ...params }
    });
};

/**
 * 根据ID删除维修记录
 * @param id 维修记录ID
 * @returns {AxiosPromise} Axios请求
 */
export const deleteMaintenanceRecordById = (id) => {
    return request({
        url: `${baseURL}`,
        method: 'DELETE',
        params: { id }
    });
};

/**
 * 修改维修记录(确认维修完成)
 * @param params MaintenanceRecord对象
 * @returns {AxiosPromise} Axios请求
 */
export const editMaintenanceRecord = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'PUT',
        data: { ...params }
    });
};
