<template>
    <div class='container'>
        <div class='form-content'>
            <el-form :inline='true' :model='accountForm' class='demo-form-inline'>
                <el-form-item label='学生'>
                    <el-input v-model.trim='accountForm.student' placeholder='请输入用户名'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' icon='el-icon-search' @click='querySubmit'>查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class='table-content'>
            <el-table
                :data='accountData'
                tooltip-effect='dark'
                border
                stripe
                style='width: 100%;background-color: #3A71A8'
                :header-cell-style="{ background: '#f5f7fa' }">
                <el-table-column label='序号' type='index' width='120'>

                </el-table-column>
                <el-table-column prop='student' label='学生' width='170'>
                </el-table-column>


                <el-table-column prop='machineRoom' label='机房' width='170'>
                </el-table-column>

                <el-table-column prop='computer' label='电脑' width='170'>
                </el-table-column>

                <el-table-column prop='startTime' label='起始时间' width='170'>
                </el-table-column>

                <el-table-column prop='endTime' label='结束时间' width='170'>
                </el-table-column>

                <el-table-column label='操作' fixed='right'>
                    <template slot-scope='scope'>
                        <el-button size='mini' type='danger' @click='handleDelete(null, scope.row.id)'>删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background
                           @size-change='handleSizeChange'
                           @current-change='handleCurrentChange'
                           :current-page.sync='page'
                           :page-sizes='pageSizes'
                           :page-size='pageSize'
                           layout='total, sizes, prev, pager, next, jumper'
                           :total='totalDataSize'>
            </el-pagination>
        </div>
        <UploadForm />
        <AccountForm v-if='showDialog'
                     ref='accountForm'
                     :action-type='actionType'
                     @closeDialog='closeDialog' />
    </div>
</template>

<script>
import { getAccountByPage, deleteAccountById } from '@/api/basic/account';
import UploadForm from '@/components/page/common/UploadForm.vue';
import { mapMutations, mapState } from 'vuex';
import AccountForm from '@/components/page/basic/account/modules/AccountForm.vue';

/**
 * 参考教程 https://www.jianshu.com/p/01720959efdb/
 */
export default {
    name: 'Account',
    components: {
        AccountForm,
        UploadForm
    },
    created() {
        // 初始化数据
        this.initAccountData();
        // 监听是否需要刷新书库
        this.$watch('uploadSuccess', this.refreshData);
    },
    data() {
        return {
            tableLoading: false,  // 加载动画
            // 角色表单信息(查询条件）
            accountForm: {
                student: ''// 用户名
            },
            // 表格所有数据
            accountData: [
                {
                    id: '1',
                    student: '张三',
                    machineRoom: 'D304',
                    computer: 'A001',

                    startTime: '2022.04.01 12:00:00',
                    endTime: '2022.04.01 12:00:00'
                }
            ],
            showDialog: false,
            actionType: '',// 操作类型
            // 分页数据
            page: 1,  // 当前第几页
            pageSize: 8,  // 当前每页大小
            pageSizes: [8, 10, 15], // 每页大小
            totalDataSize: 0, // 数据总条数
            // 选中的账户
            selectedAccount: {},
            uploadFile: {}

        };
    },
    computed: {
        ...mapState(['uploadSuccess'])
    },
    methods: {
        // 使用了mapMutations辅助函数将toggleUploadDialog mutation映射到组件中的toggleUploadDialog方法。
        ...mapMutations(['toggleUploadDialog', 'refreshTableData']),
        /**
         * 展示上传文件对话框
         */
        showUploadFileDialog() {
            this.toggleUploadDialog(true);
        },
        /**
         * 刷新数据监听
         * @param newVal
         * @param oldVal
         */
        refreshData(newVal, oldVal) {
            // 在shouldRefreshData状态变化时执行的操作
            if (newVal) {
                this.initAccountData();
                this.refreshTableData(false);
            }
        },
        /**
         * 初始化账户表格信息
         * @returns {Promise<void>}
         */
        initAccountData: async function() {
            this.tableLoading = true;
            // 定义请求参数 (查询条件)
            const params = {
                page: this.page,
                pageSize: this.pageSize,
                username: this.accountForm.username ? this.accountForm.username : '',
                type: this.accountForm.type ? this.accountForm.type : -1,
                isDisabled: this.accountForm.isDisabled ? this.accountForm.isDisabled : -1
            };
            await getAccountByPage(params).then(res => {
                if (res.code === 200) {
                    // 存储请求到的后端数据
                    this.accountData = res.data.records;
                    for (let index = 0; index < this.accountData.length; index++) {
                        this.accountData[index].isDisabled === 1 ? this.accountData[index].isDisabled = true : this.accountData[index].isDisabled = false;
                    }
                    // 设置数据总条数
                    this.totalDataSize = res.data.total;
                    this.tableLoading = false;
                }
            }).catch(err => {
                this.$message.error('请求出错了：' + err);
            });
        },
        /**
         * 添加账户
         */
        handleEditOrAdd(row, type) {
            this.actionType = type;
            if (this.actionType === '新增') {
                this.selectedAccount = {
                    username: '',
                    password: ''
                };
            } else {
                this.selectedAccount = row;
            }
            this.showDialog = true;
            // 对话框展开
            this.$nextTick(() => {
                this.$refs['accountForm'].showDialog = true;
            });

        },
        /**
         * 根据id删除账户
         * @param id
         */
        handleDelete(id) {
            this.$confirm('此操作将永久删除账户信息, 是否继续?', '确定删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 批量删除或单条数据删除，走同一个后端接口
                deleteAccountById(id).then(res => {
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        });
                        // 重新查询更新数据
                        this.querySubmit();
                    } else {
                        this.$message({ type: 'error', message: res.msg || '操作失败' });
                    }
                }).catch(err => {
                    this.$message({ type: 'error', message: '请求出错了：' + err });
                });
            }).catch(() => {
                this.$message({ type: 'info', message: '已取消删除' });
            });
        },
        /**
         * 切换每页多少条数据
         * @param val  每页数据量
         */
        handleSizeChange(val) {
            this.pageSize = val;
            this.initAccountData();
        },
        /**
         * 切换第几页
         * @param val 第几页
         */
        handleCurrentChange(val) {
            this.page = val;
            this.initAccountData();
        },

        /**
         * 条件查询角色
         */
        querySubmit() {
            this.page = 1;  // 设置查询第page页或者第一页
            this.initAccountData();
        },

        /**
         * 关闭对话框
         * @param changeInfo 数据更新, true:更新，false:未更新
         */
        closeDialog(changeInfo) {
            // 数据改变，重新刷新表格数据
            if (changeInfo) {
                this.initAccountData();
            }
            // 关闭对话框
            this.showDialog = false;
        }
    }
};
</script>

<style scoped>

.table-content {
    padding-right: 20px;
}

.handle-group {
    height: 45px;
}

.el-pagination {
    border-bottom: 1px solid #dfe6ec;
    border-left: 1px solid #dfe6ec;
    border-right: 1px solid #dfe6ec;
    margin-top: 0px;
    height: 48px;
    display: flex;
    align-items: center;
}

/deep/ .el-table .cell {
    word-break: keep-all;
}
</style>
