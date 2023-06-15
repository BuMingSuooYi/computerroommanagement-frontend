/**
 * 密码校验规则
 * @param password 密码
 * @returns {boolean}
 */
function isValidPassword(password) {
    if (password.length >= 6 && password.length <= 18) {
        return true;
    }
}

/**
 * 校验密码合法性
 * @param rule 规则
 * @param value 值
 * @param callback 回调
 */
export const checkValidPassword = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请输入密码'));
    } else if (!isValidPassword(value)) { //判断用户输入的值是否符合规则
        callback(new Error('请输入正确的长度的密码'));
    } else {
        callback();
    }
};
