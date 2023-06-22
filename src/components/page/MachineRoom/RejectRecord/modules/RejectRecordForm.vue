<template>
    <el-dialog :title="actionType + '机房开放时间段'" :visible.sync='showDialog' @close='closeDialog(0)'>
        <el-form :model='rejectRecordForm' :rules='rules' ref='rejectRecordForm' label-width='100px'
                 class='demo-rejectRecordForm'>

            <el-form-item label='机房' prop='machineRoom'>
                <el-select v-model='rejectRecordForm.machineRoomObject.name'
                           placeholder='请选择机房'
                           @visible-change='queryAllMachineRoom'
                           clearable
                           filterable
                           @change='selectMachineRoom'
                           :loading='machineRoomOptionsLoading'>
                    <el-option v-for='(item, index) in machineRoomOptions'
                               :label='item.name'
                               :value='item.id'
                               :key='index'></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label='节次' prop='section'>
                <el-select v-model='rejectRecordForm.sectionObject.number'
                           placeholder='请选择节次'
                           @visible-change='queryAllSection'
                           @change='selectSection'
                           :loading='sectionOptionsLoading'
                           clearable
                           filterable>
                    <el-option v-for='(item, index) in sectionOptions'
                               :label='item.number'
                               :value='item.id'
                               :key='index'></el-option>
                </el-select>
            </el-form-item>


            <el-form-item label='日期' prop='time'>
                <el-date-picker v-model='rejectRecordForm.time'
                                clearable
                                value-format='yyyy-MM-dd HH:mm:ss'
                                type='datetime'
                                placeholder='请选择日期'
                ></el-date-picker>

            </el-form-item>

            <el-form-item>
                <el-button @click='closeDialog(0)'>取消</el-button>
                <el-button type='primary' @click="submitForm('rejectRecordForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { addRejectRecord, editRejectRecord } from '@/api/basic/rejectRecord';

import { getAllMachineRoom } from '@/api/basic/machineRoom';
import { getAllSection } from '@/api/basic/section';

export default {
    name: 'RejectRecordForm',
    props: {
        actionType: {
            type: String,
            default: '添加机房开放时间段'
        },
        selectedRejectRecord: {
            type: Object
        }
    },
    data() {
        // 自定义验证手机号码规则
        return {
            machineRoomOptionsLoading: false,
            sectionOptionsLoading: false,
            showDialog: false,
            machineRoomOptions: [],//选中的驾驶员
            sectionOptions: [], //选中的节次
            // 表单数据
            rejectRecordForm: { ...this.selectedRejectRecord },
            // 表单校验规则
            rules: {
                machineRoom: [
                    { required: true, message: '请输入机房', trigger: 'blur' }
                ],
                section: [
                    { required: true, message: '请选择节次', trigger: 'blur' }
                ],
                time: [
                    { required: true, message: '请选择时间', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        this.changeShowData();
    },
    methods: {
        selectMachineRoom(val) {
            this.rejectRecordForm.machineRoom = val;
        },
        selectSection(val) {
            this.rejectRecordForm.section = val;
        },
        /**
         * 查询所有机房
         */
        queryAllMachineRoom() {
            this.machineRoomOptionsLoading = true;
            getAllMachineRoom().then(res => {
                this.machineRoomOptionsLoading = false;
                if (res.code === 200) {
                    this.machineRoomOptions = res.data;
                }
            }).catch(err => {
                this.$message.error('请求出错了：' + err);
            });
        },
        /**
         * 查询所有机房
         */
        queryAllSection() {
            this.sectionOptions = true;
            getAllSection().then(res => {
                this.sectionOptions = false;
                if (res.code === 200) {
                    this.sectionOptions = res.data;
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
            this.$refs['rejectRecordForm'].resetFields();
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
            // 切换数据
            // if(this.actionType==='新增'){
            //     this.rejectRecordForm.machineRoom=this.rejectRecordForm.machineRoomObject.name;
            //     this.rejectRecordForm.section=this.rejectRecordForm.sectionObject.number;
            // }
            let params = { ...this.rejectRecordForm };
            // 校验数据合法性
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.actionType === '新增') {
                        /**
                         * 新增机房开放时间段信息
                         */
                        addRejectRecord(params).then(res => {
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
                         * 编辑机房开放时间段信息
                         */
                        editRejectRecord(params).then(res => {
                            if (res.code === 200) {
                                this.$message({ type: 'success', message: '机房开放时间段信息更新成功！' });
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
