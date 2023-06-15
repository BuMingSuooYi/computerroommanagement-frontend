import request from '@/utils/axios';

/**
 * 分页查询账户
 * @param params  (page 第几页 pageSize 每页大小 number账户工号 name  账户姓名)
 * @returns {*}
 */
export const getAccountByPage = (params) => {
    return request({
        url: `/account/page`,
        method: 'GET',
        params
    });
};

/**
 * 添加账户
 * @param params 账户对象
 * @returns {AxiosPromise}
 */
export const addAccount = (params) => {
    return request({
        url: `/account`,
        method: 'POST',
        data: { ...params }
    });
};
/**
 * 根据id删除账户
 * @param id
 * @returns {*}
 */
export const deleteAccountById = (id) => {
    return request({
        url: `/account`,
        method: 'DELETE',
        params: { id }
    });
};

/**
 * 修改账户
 * @param params 账户对象
 * @returns {AxiosPromise}
 */
export const editAccount = (params) => {
    return request({
        url: '/account',
        method: 'PUT',
        data: { ...params }
    });
};
