/**
 * 学生管理api
 */
import request from '@/utils/axios';
// 学生管理基本路径
const baseURL = '/student';

/**
 * 分页查询学生
 * @param params  (page: 第几页, pageSize: 每页大小, studentNo: 学号(输入框), name: 姓名(输入框), clazz: 班级(输入框))
 * @returns {AxiosPromise} Axios请求
 * @example params: {page: 1,pageSize: 1, studentNO: '20208081',name: '张三', clazz: '202008'}
 */
export const getStudentByPage = (params) => {
    return request({
        url: `${baseURL}/page`,
        method: 'GET',
        params
    });
};

/**
 * 根据学生姓名查询学生
 * @param name
 * @returns {*}
 */
export const getStudentByName=(name)=>{
    return request({
        url: `${baseURL}/name`,
        method: 'GET',
        params: {name}
    })
}


/**
 * 添加学时
 * @param params Student对象
 * @returns {AxiosPromise} Axios请求
 */
export const addStudent = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'POST',
        data: { ...params }
    });
};


/**
 * 根据ID删除学生
 * @param id 学生ID
 * @returns {AxiosPromise} Axios请求
 */
export const deleteStudentById = (id) => {
    return request({
        url: `${baseURL}`,
        method: 'DELETE',
        params: { id }
    });
};

/**
 * 修改学生
 * @param params Student对象
 * @returns {AxiosPromise} Axios请求
 */
export const editStudent = (params) => {
    return request({
        url: `${baseURL}`,
        method: 'PUT',
        data: { ...params }
    });
};
