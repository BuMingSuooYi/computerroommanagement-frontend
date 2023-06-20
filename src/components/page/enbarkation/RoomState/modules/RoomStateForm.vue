<template>
    <el-dialog :title="actionType + '机房不可用时间段'"
               :visible.sync='showDialog'
               @close='closeDialog(false)'>
        <el-form :model='RoomStateForm'
                 :rules='rules'
                 ref='RoomStateForm'
                 label-width='120px'
                 class='demo-RoomStateForm'>
            <el-form-item label='机房'>
                <el-select v-model='RoomStateForm.machineRoom' placeholder='请选择机房'>

                </el-select>
            </el-form-item>
            <el-form-item label='节次'>
                <el-select v-model='RoomStateForm.section' placeholder='请选择节次'>

                </el-select>
            </el-form-item>


            <el-form-item>
                <el-button @click='closeDialog(false)'>取消</el-button>
                <el-button type='primary' @click="submitForm('RoomStateForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>

export default {
    name: 'RoomStateForm',
    props: {
        actionType: {
            type: String,
            default: '添加班级学时'
        },
        selectedRoomState: {
            type: Object
        }
    },
    data() {
        return {
            showDialog: false,
            // 表单数据
            RoomStateForm: { ...this.selectedRoomState },
            // 表单校验规则
            rules: {
                clazz: [
                    { required: true, message: '请输入班级学时编号', trigger: 'blur' }
                ],
                time: [
                    { required: true, message: '请输入班级学时姓名', trigger: 'blur' },
                    { min: 2, max: 100, message: '请正确输入学时', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        this.changeShowData();
    },
    methods: {
        changeShowData() {
            console.log(this.actionType);
            console.log(this.selectedRoomState);
        },

        /**
         * 关闭对话框
         * @param changeInfo 数据是否需要刷新
         */
        closeDialog(changeInfo) {
            // 重置表单
            this.$refs['RoomStateForm'].resetFields();
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
                    let params = { ...this.RoomStateForm };
                    if (this.actionType === '新增') {
                        /**
                         * 新增班级学时信息
                         */
                        // addRoomState(params).then(res => {
                        //     if (res.code === 200) {
                        //         this.$message({ type: 'success', message: '添加成功！' });
                        //         // 关闭对话框同时需要刷新数据
                        //         this.closeDialog(1);
                        //     }
                        // }).catch(err => {
                        //     this.$message.error('请求出错了：' + err);
                        // });
                    } else {
                        /**
                         * 编辑班级学时信息
                         */
                        // editRoomState(params).then(res => {
                        //     if (res.code === 200) {
                        //         this.$message({ type: 'success', message: '班级学时信息更新成功！' });
                        //         // 关闭对话框同时需要刷新数据
                        //         this.closeDialog(1);
                        //     }
                        // }).catch(err => {
                        //     this.$message.error('请求出错了：' + err);
                        // });
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
