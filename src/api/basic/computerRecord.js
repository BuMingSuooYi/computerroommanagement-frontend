/**
 * 上机记录管理api
 */
import request from '@/utils/axios';
// 上机记录基本路径
const baseURL = '/computerRecord';

/**
 * 分页查询上机记录(哪个学生在哪个机房的哪台电脑上机) (最好用视图)
 * @param params  (page: 第几页, pageSize: 每页大小, student: 学生姓名(输入框), machineRoom: 机房（下拉框）, computer: 电脑（输入框）)
 * @returns {AxiosPromise} Axios请求
 * @example params: {page: 1,pageSize: 1, student: '张三',machineRoom: 'D301', computer: '小新air17-001'}
 */
export const getComputerRecordByPage = (params) => {
    return request({
        url: `${baseURL}/page`,
        method: 'GET',
        params
    });
};

/**
 * 根据学生ID查询所有上机记录
 * @param student 学生ID
 * @returns {AxiosPromise} Axios请求
 * @example params: {student: '18798564789568789'}
 */
export const getRejectRecordById = (student) => {
    return request({
        url: `${baseURL}`,
        method: 'GET',
        params: { student }
    });
};

/**
 * 添加上机记录
 * @param params ComputerRecord对象
 * @returns {AxiosPromise} Axios请求
 */
export const addComputerRecord = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'POST',
        data: { ...params }
    });
};

/**
 * 根据ID删除上机记录
 * @param id 上机记录ID
 * @returns {AxiosPromise} Axios请求
 */
export const deleteComputerRecordById = (id) => {
    return request({
        url: `${baseURL}`,
        method: 'DELETE',
        params: { id }
    });
};

/**
 * 修改上机记录
 * @param params ComputerRecord对象
 * @returns {AxiosPromise} Axios请求
 */
export const editComputerRecord = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'PUT',
        data: { ...params }
    });
};
