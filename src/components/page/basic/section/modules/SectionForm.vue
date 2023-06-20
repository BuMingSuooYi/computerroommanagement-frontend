<template>
    <el-dialog :title="actionType + '节次'" :visible.sync='showDialog' @close='closeDialog(0)'>
        <el-form :model='sectionForm' :rules='rules' ref='sectionForm' label-width='100px' class='demo-sectionForm'>
            <el-form-item label='节次' prop='number'>
                <el-input v-model='sectionForm.number' placeholder='请输入节次'></el-input>
            </el-form-item>
            <el-form-item label='起始时间' prop='licensePlate'>
                <el-date-picker
                    v-model='sectionForm.startTime'
                    type='date'
                    placeholder='请选择起始日期'>
                </el-date-picker>
            </el-form-item>
            <el-form-item label='结束时间' prop='licensePlate'>
                <el-date-picker
                    v-model='sectionForm.endTime'
                    type='date'
                    placeholder='请选择结束日期'>
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button @click='closeDialog(0)'>取消</el-button>
                <el-button type='primary' @click="submitForm('sectionForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { addSection, editSection } from '@/api/basic/section';

export default {
    name: 'SectionForm',
    props: {
        actionType: {
            type: String,
            default: '添加节次'
        },
        selectedSection: {
            type: Object
        }
    },
    data() {
        return {
            showDialog: false,
            // 表单数据
            sectionForm: { ...this.selectedSection },
            // 表单校验规则
            rules: {
                number: [
                    { required: true, message: '请输入节次', trigger: 'blur' },
                    { min: 1, max: 1, message: '长度为 1 个字符长度', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        this.changeShowData();
    },
    methods: {
        /**
         * 为了展示需要编辑的表单数据
         * 1. 性别由数字转字符串
         * 2. 区域码由字符串转数组
         */
        changeShowData() {
            if (this.actionType === '编辑') {
                this.sectionForm.type = this.sectionForm.type.toString();
                this.sectionForm.status = this.sectionForm.status.toString();
            }
        },
        /**
         * 关闭对话框
         * @param changeInfo 数据是否需要刷新
         */
        closeDialog(changeInfo) {
            // 重置表单
            this.$refs['sectionForm'].resetFields();
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
                    let params = { ...this.sectionForm };
                    if (this.actionType === '新增') {
                        /**
                         * 新增车辆信息
                         */
                        addSection(params).then(res => {
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
                         * 编辑车辆信息
                         */
                        editSection(params).then(res => {
                            if (res.code === 200) {
                                this.$message({ type: 'success', message: '车辆信息更新成功！' });
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
