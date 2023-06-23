<template>
    <el-dialog :title="actionType + '机房'" :visible.sync='showDialog' @close='closeDialog(0)'>
        <el-form :model='machineRoomForm' :rules='rules' ref='MachineRoomForm' label-width='100px'
                 class='demo-machineRoomForm'>

            <el-form-item label='机房名称' prop='name'>
                <el-input v-model='machineRoomForm.name' placeholder='请输入机房名称'></el-input>
            </el-form-item>

            <el-form-item label='排列模式' prop='pattern'>
                <el-input v-model='machineRoomForm.pattern' placeholder='请输入排列模式'></el-input>
            </el-form-item>

            <el-form-item label='负责人' prop='principal'>
                <el-input v-model='machineRoomForm.principal' placeholder='请输入负责人'></el-input>
            </el-form-item>

            <el-form-item label='状态' prop='state'>
                <el-select v-model='machineRoomForm.state' placeholder='请选择开放状态' clearable>
                    <el-option v-for='item in state' :key='item.value' :label='item.label'
                               :value='item.value'>
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button @click='closeDialog(0)'>取消</el-button>
                <el-button type='primary' @click="submitForm('MachineRoomForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { addMachineRoom, editMachineRoom } from '@/api/basic/machineRoom';
import { checkValidPattern } from '@/utils/validate';

export default {
    name: 'MachineRoomForm',
    props: {
        actionType: {
            type: String,
            default: '添加机房'
        },
        selectedMachineRoom: {
            type: Object
        }
    },
    data() {
        return {
            showDialog: false,
            driverOptions: [],//选中的驾驶员
            state: [
                { label: '未开放', value: '0' },
                { label: '开放', value: '1' }
            ],
            // 表单数据
            machineRoomForm: { ...this.selectedMachineRoom },
            // 表单校验规则
            rules: {
                name: [
                    { required: true, message: '请输入机房名称', trigger: 'blur' }
                ],
                pattern: [
                    { required: true, trigger: 'blur', validator: checkValidPattern }
                ],
                principal: [
                    { required: true, message: '请输入负责人', trigger: 'blur' }
                ],
                state: [
                    { required: true, message: '请选择机房状态', trigger: 'blur' }
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
                this.machineRoomForm.state = this.machineRoomForm.state.toString();
            }
        },
        /**
         * 关闭对话框
         * @param changeInfo 数据是否需要刷新
         */
        closeDialog(changeInfo) {
            // 重置表单
            this.$refs['MachineRoomForm'].resetFields();
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
                    let params = { ...this.machineRoomForm };
                    if (this.actionType === '新增') {
                        /**
                         * 新增机房信息
                         */
                        addMachineRoom(params).then(res => {
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
                         * 编辑机房信息
                         */
                        editMachineRoom(params).then(res => {
                            if (res.code === 200) {
                                this.$message({ type: 'success', message: '机房信息更新成功！' });
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
