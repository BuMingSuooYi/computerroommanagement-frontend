<template>
    <el-dialog :title="actionType + '电脑维修记录'" :visible.sync='showDialog' @close='closeDialog(0)'>
        <el-form :model='maintenanceRecordForm' :rules='rules' ref='maintenanceRecordForm' label-width='100px'
                 class='demo-maintenanceRecordForm'>

            <el-form-item label='电脑' prop='computer'>
                <el-select v-model='maintenanceRecordForm.computer' placeholder='请选择电脑'
                           @visible-change='queryAllComputer'>
                    <el-option v-for='(item, index) in computerOptions' :label='item.number' :value='item.id'
                               :key='index'></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label='起始时间' prop='startTime'>
                <el-date-picker v-model='maintenanceRecordForm.startTime'
                                clearable
                                value-format='yyyy-MM-dd HH:mm:ss'
                                type='datetime'
                                placeholder='选择日期'
                ></el-date-picker>
            </el-form-item>

            <el-form-item label='结束时间' prop='endTime'>
                <el-date-picker v-model='maintenanceRecordForm.endTime'
                                clearable
                                value-format='yyyy-MM-dd HH:mm:ss'
                                type='datetime'
                                placeholder='选择日期'
                ></el-date-picker>
            </el-form-item>


            <el-form-item label='备注' prop='remark'>
                <el-input v-model='maintenanceRecordForm.remark' placeholder='请输入备注'></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click='closeDialog(0)'>取消</el-button>
                <el-button type='primary' @click="submitForm('maintenanceRecordForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { addMaintenanceRecord, editMaintenanceRecord } from '@/api/basic/maintenanceRecord';
import { getAllComputer } from '@/api/basic/computer';

export default {
    name: 'MaintenanceRecordForm',
    props: {
        actionType: {
            type: String,
            default: '添加电脑维修记录'
        },
        selectedMaintenanceRecord: {
            type: Object
        }
    },
    data() {
        // 自定义验证手机号码规则
        return {
            showDialog: false,
            computerOptions: [],//选中的电脑

            // 表单数据
            maintenanceRecordForm: { ...this.selectedMaintenanceRecord },
            // 表单校验规则
            rules: {
                computer: [
                    { required: true, message: '请输入电脑编号', trigger: 'blur' }
                ],
                startTime: [
                    { required: true, message: '请选择起始日期', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
    },
    methods: {
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

        /**
         * 关闭对话框
         * @param changeInfo 数据是否需要刷新
         */
        closeDialog(changeInfo) {
            // 重置表单
            this.$refs['maintenanceRecordForm'].resetFields();
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
                    let params = { ...this.maintenanceRecordForm };
                    if (this.actionType === '新增') {
                        /**
                         * 新增电脑维修记录信息
                         */
                        addMaintenanceRecord(params).then(res => {
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
                         * 编辑电脑维修记录信息
                         */
                        editMaintenanceRecord(params).then(res => {
                            if (res.code === 200) {
                                this.$message({ type: 'success', message: '电脑维修记录信息更新成功！' });
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
