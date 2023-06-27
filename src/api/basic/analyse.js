/**
 * 数据统计
 */
import request from '@/utils/axios';
// 机房管理基本路径
const baseURL = '/analyse';
/**
 * 获取每个机房上机总学时
 */
export const getPeriodByMachineRoom = () => {
    return request({
        url: `${baseURL}/eachMachineRoom`,
        method: 'GET'
    });
};
/**
 * 获取班级上机学时
 */
export const getPeriodByClazz = () => {
    return request({
        url: `${baseURL}/eachClazz`,
        method: 'GET'
    });
};
/**
 * 获取维修次数最多的n台电脑
 */
export const getMaximumMaintenance = () => {
    return request({
        url: `${baseURL}/maximumMaintenance`,
        method: 'GET'
    });
};

/**
 * 获取自己和目标学时的差
 * @param account
 * @returns {*}
 */
export const getPeriod = (account) => {
    return request({
        url: `${baseURL}/period`,
        method: 'GET',
        params: { account }
    });
};

/**
 * 根据账户ID查询排名
 * @param account
 * @returns {*}
 */
export const getStudentRanking = (account) => {
    return request({
        url: `${baseURL}/studentRanking`,
        method: 'GET',
        params: { account }
    });
};

/**
 * 获取电脑状态信息
 * @returns {*}
 */
export const getComputerInformation = () => {
    return request({
        url: `${baseURL}/computerInformation`,
        method: 'GET'
    });
};
