<template>
    <el-dialog :title="actionType + '账户'" :visible.sync='showDialog' @close='closeDialog(false)'>
        <el-form :model='accountForm'
                 :rules='rules'
                 ref='accountForm'
                 label-width='120px'
                 class='demo-accountForm'>

            <el-form-item label='用户名' prop='username'>
                <el-input v-model='accountForm.username' placeholder='请输入客户姓名'></el-input>
            </el-form-item>

            <el-form-item label='密码' prop='password'>
                <el-input show-password v-model='accountForm.password' placeholder='请输入密码'></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click='closeDialog(false)'>取消</el-button>
                <el-button type='primary' @click="submitForm('accountForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>

import { checkValidPassword } from '@/utils/validate';
import { addAccount } from '@/api/basic/account';

export default {
    name: 'AccountForm',
    props: {
        actionType: {
            type: String,
            default: '添加账户'
        },
        selectedAccount: {
            type: Object
        }
    },
    data() {
        // 自定义验证手机号码规则
        return {
            showDialog: false,
            // 表单数据
            accountForm: { ...this.selectedAccount },
            // 表单校验规则
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入正确的密码格式，长度为6-18位',
                        trigger: 'blur',
                        validator: checkValidPassword
                    }
                ]
            }
        };
    },
    created() {
    },
    methods: {
        /**
         * 关闭对话框
         * @param changeInfo 数据更新, true:更新，false:未更新
         */
        closeDialog(changeInfo) {
            // 重置表单
            this.$refs['accountForm'].resetFields();
            // 关闭对话框
            this.showDialog = false;
            // 传递事件给父组件
            this.$emit('closeDialog', changeInfo);
        },
        /**
         * 提交表单
         * @param formName
         */
        submitForm(formName) {
            // 校验数据合法性
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = { ...this.accountForm };
                    console.log(params);
                    if (this.actionType === '新增') {
                        /**
                         * 新增客户信息
                         */
                        addAccount(params).then(res => {
                            if (res.code === 200) {
                                this.$message({ type: 'success', message: '添加成功！' });
                                // 关闭对话框同时需要刷新数据
                                this.closeDialog(true);
                            }
                        }).catch(err => {
                            this.$message.error('请求出错了：' + err);
                        });
                    }
                } else {
                    this.$message({ type: 'error', message: '提交失败，请检验数据是否合法！' });
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped></style>
