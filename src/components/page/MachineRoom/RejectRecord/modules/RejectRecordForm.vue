<template>
    <el-dialog :title="actionType + '车辆'" :visible.sync="showDialog" @close="closeDialog(0)">
        <el-form :model="rejectRecordForm" :rules="rules" ref="rejectRecordForm" label-width="100px" class="demo-rejectRecordForm">


            <el-form-item label="机房">
                <el-select v-model="rejectRecordForm.machineRoomObject.name" placeholder="请选择机房" @visible-change="queryAllMachineRoom">
                    <el-option v-for="(item, index) in machineRoomOptions" :label="item.name" :value="item.id"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="节次">
                <el-select v-model="rejectRecordForm.sectionObject.name" placeholder="请选择节次" @visible-change="queryAllSection">
                    <el-option v-for="(item, index) in sectionOptions" :label="item.name" :value="item.id"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="车辆状态" prop="status">

            </el-form-item>

            <el-form-item>
                <el-button @click="closeDialog(0)">取消</el-button>
                <el-button type="primary" @click="submitForm('rejectRecordForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import {addRejectRecord, editRejectRecord} from "@/api/basic/rejectRecord";

import { getAllMachineRoom } from '@/api/basic/machineRoom';
import { getAllSection } from '@/api/basic/section';

export default {
    name: "RejectRecordForm",
    props: {
        actionType: {
            type: String,
            default: '添加车辆'
        },
        selectedRejectRecord: {
            type: Object
        }
    },
    data() {
        // 自定义验证手机号码规则
        return {
            showDialog: false,
            machineRoomOptions: [],//选中的驾驶员
            sectionOptions: [], //选中的节次
            rejectRecordType: [
                {label: '平板卡车', value: '1'},
                {label: '冷藏卡车', value: '2'},
                {label: '集装箱卡车', value: '3'}
            ],
            // 表单数据
            rejectRecordForm: {...this.selectedRejectRecord},
            // 表单校验规则
            rules: {

            },
        }
    },
    created() {
        this.changeShowData()
    },
    methods: {
        /**
         * 查询所有机房
         */
        queryAllMachineRoom() {
            getAllMachineRoom().then(res => {
                if (res.code === 200) {
                    this.machineRoomOptions = res.data
                }
            }).catch(err => {
                this.$message.error('请求出错了：' + err)
            })
        },
        /**
         * 查询所有机房
         */
        queryAllSection() {
            getAllSection().then(res => {
                if (res.code === 200) {
                    this.sectionOptions = res.data
                }
            }).catch(err => {
                this.$message.error('请求出错了：' + err)
            })
        },
        /**
         * 为了展示需要编辑的表单数据
         * 1. 性别由数字转字符串
         * 2. 区域码由字符串转数组
         */
        changeShowData() {
            if (this.actionType === '编辑') {
                this.rejectRecordForm.type = this.rejectRecordForm.type.toString()
                this.rejectRecordForm.status = this.rejectRecordForm.status.toString()
            }
        },
        /**
         * 关闭对话框
         * @param changeInfo 数据是否需要刷新
         */
        closeDialog(changeInfo) {
            // 重置表单
            this.$refs['rejectRecordForm'].resetFields();
            // 关闭对话框
            this.showDialog = false
            // 传递事件给父组件
            this.$emit("closeDialog", changeInfo)
        },

        /**
         * 提交表单
         * @param formName
         */
        submitForm(formName) {
            // 校验数据合法性
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // // 将地址区域码转换成字符串
                    // this.addressCodeToString(this.rejectRecordForm.addressCode)
                    let params = {...this.rejectRecordForm}
                    if (this.actionType === '新增') {
                        /**
                         * 新增车辆信息
                         */
                        addRejectRecord(params).then(res => {
                            if (res.code === 200) {
                                this.$message({type: 'success', message: '添加成功！'})
                                // 关闭对话框同时需要刷新数据
                                this.closeDialog(1)
                            }
                        }).catch(err => {
                            this.$message.error('请求出错了：' + err)
                        })
                    } else {
                        /**
                         * 编辑车辆信息
                         */
                        editRejectRecord(params).then(res => {
                            if (res.code === 200) {
                                this.$message({type: "success", message: '车辆信息更新成功！'})
                                // 关闭对话框同时需要刷新数据
                                this.closeDialog(1)
                            }
                        }).catch(err => {
                            this.$message.error('请求出错了：' + err)
                        })
                    }
                } else {
                    this.$message({type: "error", message: '提交失败，请检验数据是否合法！'})
                    return false;
                }
            });
        }
    }
}
</script>

<style scoped></style>
