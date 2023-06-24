/**
 * 机房不可用时间段管理api
 */
import request from '@/utils/axios';
// 机房不可用时间段管理基本路径
const baseURL = '/rejectRecord';

/**
 * 分页查询机房不可用时间段
 * @param params  (page: 第几页, pageSize: 每页大小, machineRoom: 机房主键(下拉框), time: 日期(日期选择器))
 * @returns {AxiosPromise} Axios请求
 * @example params: {page: 1,pageSize: 1, machineRoom: '18798564789568789',time: 'date'}
 */
export const getRejectRecordByPage = (params) => {
    return request({
        url: `${baseURL}/page`,
        method: 'GET',
        params
    });
};

/**
 * 根据机房ID查询指定机房不可用时间段
 * @param machineRoom 机房ID
 * @returns {AxiosPromise} Axios请求
 * @example params: {machineRoom: '18798564789568789'}
 */
export const getRejectRecordById = (machineRoom) => {
    return request({
        url: `${baseURL}`,
        method: 'GET',
        params: { machineRoom }
    });
};

/**
 * 添加机房不可用时间段
 * @param params RejectRecord对象
 * @returns {AxiosPromise} Axios请求
 */
export const addRejectRecord = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'POST',
        data: { ...params }
    });
};

/**
 * 根据ID删除机房不可用时间段
 * @param id 机房不可用时间段ID
 * @returns {AxiosPromise} Axios请求
 */
export const deleteRejectRecordById = (id) => {
    return request({
        url: `${baseURL}`,
        method: 'DELETE',
        params: { id }
    });
};

/**
 * 修改机房不可用时间段
 * @param params RejectRecord对象
 * @returns {AxiosPromise} Axios请求
 */
export const editRejectRecord = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'PUT',
        data: { ...params }
    });
};

/**
 * 导出不可用时间段
 * @returns {*}
 */
export const exportRejectRecord = () => {
    return request({
        url: `${baseURL}/download`,
        method: 'GET',
        responseType: 'blob'
    });
};
