<template>
    <el-dialog :title="'添加上机记录'" :visible.sync='showDialog' @close='closeDialog(0)'>
        <el-form :model='addComputerRecordForm' :rules='rules' ref='addComputerRecordForm' label-width='100px'
                 class='demo-computerForm'>
            <el-form-item label='学生姓名' prop='student'>
                <el-input v-model='addComputerRecordForm.student' placeholder='请输入学生姓名'></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click='closeDialog(0)'>取消</el-button>
                <el-button type='primary' @click="submitForm('addComputerRecordForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { getStudentByName } from '@/api/basic/student';
import { addComputerRecord } from '@/api/basic/computerRecord';

export default {
    name: 'addComputerRecordForm',
    props: {
        machineRoom: {
            type: Object
        },
        selectedComputer: {}
    },

    data() {
        // 自定义验证手机号码规则
        return {
            showDialog: false,
            selectedOptions: [],  // 选中的省市区
            // 表单数据
            addComputerRecordForm: {
                student: '',
                computer: ''
            },
            computerConfigurationOptions: [],
            // 表单校验规则
            rules: {
                student: [
                    { required: true, message: '请输入学生姓名', trigger: 'blur' }
                ]
            },
            validateStudent: false,
            studentObject: ''
        };
    },
    created() {
        // 确定电脑
        this.addComputerRecordForm.computer = this.selectedComputer.id;
    },
    methods: {
        checkStudent() {
            this.queryStudentByName();
        },
        queryStudentByName() {
            getStudentByName(this.addComputerRecordForm.student).then(res => {
                if (res.code === 200) {
                    if (res.data === null) {
                        this.validateStudent = false;
                    } else {
                        this.validateStudent = true;
                        this.studentObject = res.data;
                    }
                    if (this.validateStudent === false) {
                        this.addComputerRecordForm.student = '';
                        this.$message.error('该学生不存在');
                        return false;
                    }
                    return true;
                }
            }).catch(err => {
                this.$message.error('请求出错了：' + err);
            });
        },
        /**
         * 关闭对话框
         * @param changeInfo 数据是否需要刷新
         */
        closeDialog(changeInfo) {
            // 重置表单
            this.$refs['addComputerRecordForm'].resetFields();
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
            // 校验学生
            this.checkStudent();
            if (!this.validateStudent) {
                return;
            }
            // 校验数据合法性
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = { ...this.addComputerRecordForm };
                    params.student = this.studentObject.id;
                    /**
                     * 新增电脑信息
                     */
                    addComputerRecord(params).then(res => {
                        if (res.code === 200) {
                            this.$message({ type: 'success', message: '添加成功！' });
                            // 关闭对话框同时需要刷新数据
                            this.closeDialog(1);
                        }
                    }).catch(err => {
                        this.$message.error('请求出错了：' + err);
                    });
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
