/**
 * 班级上机学时管理api
 */
import request from '@/utils/axios';
// 班级上机学时基本路径
const baseURL = '/clazzPeriod';

/**
 * 分页查询班级上机学时
 * @param params  (page: 第几页, pageSize: 每页大小, clazz: 班级(输入框))
 * @returns {AxiosPromise} Axios请求
 * @example params: {page: 1,pageSize: 1, clazz: '202008'}
 */
export const getClazzPeriodByPage = (params) => {
    return request({
        url: `${baseURL}/page`,
        method: 'GET',
        params
    });
};

/**
 * 获取所有班级上机学时
 * @returns {AxiosPromise} Axios请求
 */
export const getAllClazzPeriod = () => {
    return request({
        url: `${baseURL}`,
        method: 'GET'
    });
};

/**
 * 添加班级上机学时
 * @param params ClazzPeriod对象
 * @returns {AxiosPromise} Axios请求
 */
export const addClazzPeriod = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'POST',
        data: { ...params }
    });
};

/**
 * 根据ID删除班级上机学时
 * @param id 班级上机学时ID
 * @returns {AxiosPromise} Axios请求
 */
export const deleteClazzPeriodById = (id) => {
    return request({
        url: `${baseURL}`,
        method: 'DELETE',
        params: { id }
    });
};

/**
 * 修改班级上机学时
 * @param params ClazzPeriod对象
 * @returns {AxiosPromise} Axios请求
 */
export const editClazzPeriod = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'PUT',
        data: { ...params }
    });
};
