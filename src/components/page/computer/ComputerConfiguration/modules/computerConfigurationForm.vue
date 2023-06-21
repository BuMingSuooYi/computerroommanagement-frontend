<template>
    <el-dialog :title="actionType + '电脑配置'" :visible.sync='showDialog' @close='closeDialog(0)'>
        <el-form :model='computerConfigurationForm' :rules='rules' ref='computerConfigurationForm' label-width='120px'
                 class='demo-computerConfigurationForm'>

            <el-form-item label='电脑配置名称' prop='name'>
                <el-input v-model='computerConfigurationForm.name' placeholder='请输入硬件配置'></el-input>
            </el-form-item>

            <el-form-item label='软件配置' prop='software'>
                <el-input v-model='computerConfigurationForm.software' placeholder='请输入软件配置'></el-input>
            </el-form-item>

            <el-form-item label='硬件配置' prop='hardware'>
                <el-input v-model='computerConfigurationForm.hardware' placeholder='请输入硬件配置'></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click='closeDialog(0)'>取消</el-button>
                <el-button type='primary' @click="submitForm('computerConfigurationForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { addComputerConfiguration, editComputerConfiguration } from '@/api/basic/computerConfiguration';

export default {
    name: 'ComputerConfigurationForm',
    props: {
        actionType: {
            type: String,
            default: '添加电脑配置'
        },
        selectedComputerConfiguration: {
            type: Object
        }
    },
    data() {
        // 自定义验证手机号码规则
        return {
            showDialog: false,
            // 表单数据
            computerConfigurationForm: { ...this.selectedComputerConfiguration },
            // 表单校验规则
            rules: {
                name: [
                    { required: true, message: '请输入配置名称', trigger: 'blur' }
                ],
                hardware: [
                    { required: true, message: '请输入硬件配置', trigger: 'blur' }
                ],
                software: [
                    { required: true, message: '请输入软件配置', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
    },
    methods: {
        /**
         * 关闭对话框
         * @param changeInfo 数据是否需要刷新
         */
        closeDialog(changeInfo) {
            // 重置表单
            this.$refs['computerConfigurationForm'].resetFields();
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
                    let params = { ...this.computerConfigurationForm };
                    if (this.actionType === '新增') {
                        /**
                         * 新增电脑配置信息
                         */
                        addComputerConfiguration(params).then(res => {
                            if (res.code === 200) {
                                this.$message({ type: 'success', message: '添加成功！' });
                                // 关闭对话框同时需要刷新数据
                                this.closeDialog(1);
                            }
                        }).catch(err => {
                            this.$message.error('请求出错了：' + err);
                        });
                    } else {
                        /**
                         * 编辑电脑配置信息
                         */
                        editComputerConfiguration(params).then(res => {
                            if (res.code === 200) {
                                this.$message({ type: 'success', message: '电脑配置信息更新成功！' });
                                // 关闭对话框同时需要刷新数据
                                this.closeDialog(1);
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
