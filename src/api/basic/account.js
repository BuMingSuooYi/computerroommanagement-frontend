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
