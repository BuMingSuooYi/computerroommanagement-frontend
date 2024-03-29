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

/**
 * 手机号码校验规则
 * @param phone 手机号码
 * @returns {boolean}
 */
function isValidPhone(phone) {
    const reg = /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/;
    return reg.test(phone);
}

/**
 * 校验手机号码合法性
 * @param rule 规则
 * @param value 值
 * @param callback 回调
 */
export const checkValidPhone = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请输入电话号码'));
    } else if (!isValidPhone(value)) { //判断用户输入的值是否符合规则
        callback(new Error('请输入正确的11位手机号码'));
    } else {
        callback();
    }
};
/**
 * 校验排列模式
 * @param rule
 * @param value
 * @param callback
 */
export const checkValidPattern = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请输入排列模式'));
    } else {
        const regex = /^(?!0\d)\d{1,2}\*\d{1,2}$/;
        if (!regex.test(value)) {
            callback(new Error('请输入大于0且小于等于20的数字*数字形式'));
        } else {
            const [num1, num2] = value.split('*').map(Number);
            if (num1 > 20 || num2 > 20) {
                callback(new Error('请输入大于0且小于等于20的数字*数字形式'));
            } else {
                callback();
            }
        }
    }
};



