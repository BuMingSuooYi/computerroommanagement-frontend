<template>
    <el-dialog :title="actionType + '班级学时'"
               :visible.sync='showDialog'
               @close='closeDialog(false)'>
        <el-form :model='PeriodForm'
                 :rules='rules'
                 ref='PeriodForm'
                 label-width='120px'
                 class='demo-PeriodForm'>

            <el-form-item label='班级' prop='clazz'>
                <el-input v-model='PeriodForm.clazz' placeholder='请输入班级'></el-input>
            </el-form-item>
            <el-form-item label='班级学时' prop='time'>
                <el-input-number v-model='PeriodForm.time' :step='1'></el-input-number>
                <!--                <el-input v-model='PeriodForm.time' placeholder='请输入班级学时'></el-input>-->
            </el-form-item>

            <el-form-item>
                <el-button @click='closeDialog(false)'>取消</el-button>
                <el-button type='primary' @click="submitForm('PeriodForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>

export default {
    name: 'PeriodForm',
    props: {
        actionType: {
            type: String,
            default: '添加班级学时'
        },
        selectedPeriod: {
            type: Object
        }
    },
    data() {
        return {
            showDialog: false,
            // 表单数据
            PeriodForm: { ...this.selectedPeriod },
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
            console.log(this.selectedPeriod);
        },

        /**
         * 关闭对话框
         * @param changeInfo 数据是否需要刷新
         */
        closeDialog(changeInfo) {
            // 重置表单
            this.$refs['PeriodForm'].resetFields();
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
                    let params = { ...this.PeriodForm };
                    if (this.actionType === '新增') {
                        /**
                         * 新增班级学时信息
                         */
                        // addPeriod(params).then(res => {
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
                        // editPeriod(params).then(res => {
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
