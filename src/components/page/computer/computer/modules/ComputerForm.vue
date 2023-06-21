<template>
    <el-dialog :title="actionType + '电脑'" :visible.sync='showDialog' @close='closeDialog(0)'>
        <el-form :model='computerForm' :rules='rules' ref='computerForm' label-width='100px' class='demo-computerForm'>
            <el-form-item label='电脑编号' prop='number'>
                <el-input v-model='computerForm.number' placeholder='请输入电脑编号'></el-input>
            </el-form-item>

            <el-form-item label='电脑配置' prop='configuration'>
                <el-select v-model='computerForm.configuration' placeholder='请选择电脑配置'
                           @visible-change='queryAllComputerConfiguration' clearable>
                    <el-option v-for='(item, index) in computerConfigurationOptions' :label='item.name'
                               :value='item.id'
                               :key='index'></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label='隶属机房' prop='machineRoom'>
                <el-select v-model='computerForm.machineRoom' placeholder='请选择隶属机房'
                           @visible-change='queryAllMachineRoom' clearable>
                    <el-option v-for='(item, index) in machineRoomOptions' :label='item.name'
                               :value='item.id'
                               :key='index'></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label='机位' prop='cameraStand'>
                <el-input v-model='computerForm.cameraStand' placeholder='请输入机位'></el-input>
            </el-form-item>

            <el-form-item label='状态' prop='state'>
                <el-select v-model='computerForm.state' placeholder='请选择性别' clearable>
                    <el-option key='0' label='空闲' value='0'>
                    </el-option>
                    <el-option key='1' label='使用中' value='1'>
                    </el-option>
                    <el-option key='2' label='维修中' value='2'>
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button @click='closeDialog(0)'>取消</el-button>
                <el-button type='primary' @click="submitForm('computerForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { addComputer, editComputer } from '@/api/basic/computer';
import { getAllMachineRoom } from '@/api/basic/machineRoom';
import { getAllComputerConfiguration } from '@/api/basic/computerConfiguration';

export default {
    name: 'ComputerForm',
    props: {
        actionType: {
            type: String,
            default: '添加电脑'
        },
        selectedComputer: {
            type: Object
        }
    },
    data() {
        // 自定义验证手机号码规则
        return {
            showDialog: false,
            selectedOptions: [],  // 选中的省市区
            // 表单数据
            computerForm: { ...this.selectedComputer },
            machineRoomOptions: [],
            computerConfigurationOptions: [],
            // 表单校验规则
            rules: {
                number: [
                    { required: true, message: '请输入电脑编号', trigger: 'blur' }
                ],
                cameraStand: [
                    { required: true, message: '请填写机位', trigger: 'blur' }
                ],
                state: [
                    { required: true, message: '请选择机器状态', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        this.changeShowData();
    },
    methods: {
        /**
         * 查询所有机房
         */
        queryAllMachineRoom() {
            getAllMachineRoom().then(res => {
                if (res.code === 200) {
                    this.machineRoomOptions = res.data;
                }
            }).catch(err => {
                this.$message.error('请求出错了：' + err);
            });
        },
        /**
         * 查询所有电脑配置
         */
        queryAllComputerConfiguration() {
            getAllComputerConfiguration().then(res => {
                if (res.code === 200) {
                    this.computerConfigurationOptions = res.data;
                }
            }).catch(err => {
                this.$message.error('请求出错了：' + err);
            });
        },
        /**
         * 为了展示需要编辑的表单数据
         */
        changeShowData() {
            if (this.actionType === '编辑') {
                console.log(this.computerForm)
                this.computerForm.configuration=this.computerForm.computerConfigurationObject.name;
                this.computerForm.machineRoom=this.computerForm.machineRoomObject.name;
                this.computerForm.state = this.computerForm.state.toString();
            }
        },
        /**
         * 关闭对话框
         * @param changeInfo 数据是否需要刷新
         */
        closeDialog(changeInfo) {
            // 重置表单
            this.$refs['computerForm'].resetFields();
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
                    let params = { ...this.computerForm };
                    console.log(params)
                    if (this.actionType === '新增') {
                        /**
                         * 新增电脑信息
                         */
                        addComputer(params).then(res => {
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
                         * 编辑电脑信息
                         */
                        editComputer(params).then(res => {
                            if (res.code === 200) {
                                this.$message({ type: 'success', message: '电脑信息更新成功！' });
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
