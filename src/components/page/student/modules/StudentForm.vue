<template>
    <el-dialog :title="actionType + '学生'" :visible.sync='showDialog' @close='closeDialog(0)'>
        <el-form :model='studentForm' :rules='rules' ref='studentForm' label-width='100px' class='demo-studentForm'>
            <el-form-item label='学号' prop='studentNo'>
                <el-input v-model='studentForm.studentNo' placeholder='请输入学号'></el-input>
            </el-form-item>
            <el-form-item label='姓名' prop='name'>
                <el-input v-model='studentForm.name' placeholder='请输入学生姓名'></el-input>
            </el-form-item>

            <el-form-item label='班级' prop='clazz'>
                <el-input v-model='studentForm.clazz' placeholder='请输入班级'></el-input>
            </el-form-item>

            <el-form-item label='性别' prop='sex'>
                <el-select v-model='studentForm.sex' placeholder='请选择性别' clearable>
                    <el-option v-for='item in sex' :key='item.value' :label='item.label' :value='item.value'>
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label='联系电话' prop='telephone'>
                <el-input v-model='studentForm.telephone' placeholder='请输入联系电话'></el-input>
            </el-form-item>


            <el-form-item>
                <el-button @click='closeDialog(0)'>取消</el-button>
                <el-button type='primary' @click="submitForm('studentForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { editStudent } from '@/api/basic/student';
import { checkValidPhone } from '@/utils/validate';

export default {
    name: 'StudentForm',
    props: {
        actionType: {
            type: String,
            default: '添加学生'
        },
        selectedStudent: {
            type: Object
        }
    },
    data() {
        // 自定义验证手机号码规则
        return {
            showDialog: false,
            driverOptions: [],//选中的驾驶员
            sex: [
                { label: '女', value: '0' },
                { label: '男', value: '1' }
            ],
            // 表单数据
            studentForm: { ...this.selectedStudent },
            // 表单校验规则
            rules: {
                type: [
                    { required: true, message: '请输入学号', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度至少 6 个字符长度', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                clazz: [
                    { required: true, message: '请输入班级', trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ],
                telephone: [
                    { required: true, message: '请输入正确的电话号码', trigger: 'blur', validator: checkValidPhone }
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
            this.$refs['studentForm'].resetFields();
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
                    let params = { ...this.studentForm };
                    if (this.actionType === '新增') {

                    } else {
                        /**
                         * 编辑学生信息
                         */
                        editStudent(params).then(res => {
                            if (res.code === 200) {
                                this.$message({ type: 'success', message: '学生信息更新成功！' });
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
