<template>
    <el-dialog :title="actionType + '上机记录'" :visible.sync='showDialog' @close='closeDialog(0)'>
        <el-form :model='computerRecordForm' :rules='rules' ref='computerRecordForm' label-width='100px'
                 class='demo-computerRecordForm'>

            <el-form-item label='学生姓名'>
                <el-input v-model='computerRecordForm.student' placeholder='请输入学生' @blur='checkStudent'></el-input>
            </el-form-item>

            <el-form-item label='电脑' prop='computer'>
                <el-select v-model='computerRecordForm.computer'
                           placeholder='请选择电脑'
                           @visible-change='queryAllComputer'
                           clearable
                           filterable>
                    <el-option v-for='(item, index) in computerOptions'
                               :label='item.number'
                               :value='item.id'
                               :key='index'></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label='起始时间' prop='startTime'>
                <el-date-picker v-model='computerRecordForm.startTime'
                                clearable
                                value-format='yyyy-MM-dd HH:mm:ss'
                                type='datetime'
                                placeholder='选择日期'
                ></el-date-picker>
            </el-form-item>

            <el-form-item label='结束时间' prop='endTime'>
                <el-date-picker v-model='computerRecordForm.endTime'
                                clearable
                                value-format='yyyy-MM-dd HH:mm:ss'
                                type='datetime'
                                placeholder='选择日期'
                ></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button @click='closeDialog(0)'>取消</el-button>
                <el-button type='primary' @click="submitForm('computerRecordForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { addComputerRecord, editComputerRecord } from '@/api/basic/computerRecord';
import { getAllComputer } from '@/api/basic/computer';
import { getStudentByName } from '@/api/basic/student';

export default {
    name: 'ComputerRecordForm',
    props: {
        actionType: {
            type: String,
            default: '添加车辆'
        },
        selectedComputerRecord: {
            type: Object
        }
    },
    data() {
        // 自定义验证手机号码规则
        return {
            showDialog: false,
            machineRoomOptions: [],//选中的机房
            computerOptions: [], //选中的电脑
            // 表单数据
            computerRecordForm: { ...this.selectedComputerRecord },
            // 表单校验规则
            rules: {
                student: [
                    { required: true, message: '请输入学生名称', trigger: 'blur' }
                ],
                machineRoom: [
                    { required: true, message: '请选择机房', trigger: 'blur' }
                ],
                computer: [
                    { required: true, message: '请选择电脑', trigger: 'blur' }
                ],
                startTime: [
                    { required: true, message: '请选择起始时间', trigger: 'blur' }
                ]
            },
            validateStudent: false,
            studentObject: '',
        };
    },
    created() {
        console.log(this.selectedComputerRecord)
        // this.changeShowData();
    },
    methods: {
        checkStudent() {
            this.queryStudentByName();
        },
        /**
         * 查询所有电脑
         */
        queryAllComputer() {
            getAllComputer().then(res => {
                if (res.code === 200) {
                    this.computerOptions = res.data;
                }
            }).catch(err => {
                this.$message.error('请求出错了：' + err);
            });
        },
        queryStudentByName() {
            getStudentByName(this.computerRecordForm.student).then(res => {
                if (res.code === 200) {
                    if (res.data===null) {
                        this.validateStudent = false;
                    }else {
                        this.validateStudent=true;
                        this.studentObject=res.data
                    }
                    if (this.validateStudent === false) {
                        this.computerRecordForm.student = '';
                        this.$message.error('该学生不存在');
                        return false;
                    }
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
            this.$refs['computerRecordForm'].resetFields();
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
                    this.computerRecordForm.student=this.studentObject.id;
                    let params = { ...this.computerRecordForm };
                    if (this.actionType === '新增') {
                        /**
                         * 新增车辆信息
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
                        /**
                         * 编辑车辆信息
                         */
                        editComputerRecord(params).then(res => {
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
