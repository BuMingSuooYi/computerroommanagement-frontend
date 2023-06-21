<template>
    <el-dialog :title="actionType + '节次'" :visible.sync='showDialog' @close='closeDialog(0)'>
        <el-form :model='sectionForm' :rules='rules' ref='sectionForm' label-width='100px' class='demo-sectionForm'>
            <el-form-item label='节次' prop='number'>
                <el-input v-model='sectionForm.number' placeholder='请输入节次'></el-input>
            </el-form-item>
            <el-form-item label='起始时间' prop='licensePlate'>
                <el-time-picker
                    v-model='sectionForm.startTime'
                    placeholder='请选择起始时间'
                    type='time'
                    value-format='HH:mm:ss'
                >
                </el-time-picker>

            </el-form-item>
            <el-form-item label='结束时间' prop='licensePlate'>
                <el-time-picker
                    v-model='sectionForm.endTime'
                    type='time'
                    value-format='HH:mm:ss'
                    placeholder='请选择结束时间'
                >
                </el-time-picker>
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
                    console.log(params);
                    if (this.actionType === '新增') {
                        /**
                         * 新增节次信息
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
                         * 编辑节次信息
                         */
                        editSection(params).then(res => {
                            if (res.code === 200) {
                                this.$message({ type: 'success', message: '节次信息更新成功！' });
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
