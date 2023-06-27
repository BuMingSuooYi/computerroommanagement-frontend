/**
 * 机房管理api
 */
import request from '@/utils/axios';
// 机房管理基本路径
const baseURL = '/machineRoom';

/**
 * 分页查询机房
 * @param params  (page: 第几页, pageSize: 每页大小, name: 名称(输入框), principle: 负责人(输入框), state: 开放状态(下拉框))
 * @returns {AxiosPromise} Axios请求
 * @example params: {page: 1,pageSize: 1, name: 'D301',principle: '张三', state: 0}
 */
export const getMachineRoomByPage = (params) => {
    return request({
        url: `${baseURL}/page`,
        method: 'GET',
        params
    });
};

/**
 * 获取所有机房
 * @returns {AxiosPromise} Axios请求
 */
export const getAllMachineRoom = () => {
    return request({
        url: `${baseURL}`,
        method: 'GET'
    });
};

/**
 * 根据机房名称查询所有电脑
 * @param id
 * @returns {*}
 */
export const getComputerByMachineRoom = (id) => {
    return request({
        url: `${baseURL}/page/computer`,
        method: 'GET',
        params: { id }
    });
};

/**
 * 添加机房
 * @param params machineRoom对象
 * @returns {AxiosPromise} Axios请求
 */
export const addMachineRoom = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'POST',
        data: { ...params }
    });
};

/**
 * 根据ID删除机房
 * @param id 机房ID
 * @returns {AxiosPromise} Axios请求
 */
export const deleteMachineRoomById = (id) => {
    return request({
        url: `${baseURL}`,
        method: 'DELETE',
        params: { id }
    });
};

/**
 * 修改机房
 * @param params machineRoom对象
 * @returns {AxiosPromise} Axios请求
 */
export const editMachineRoom = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'PUT',
        data: { ...params }
    });
};


